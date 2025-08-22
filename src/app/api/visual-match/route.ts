import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import puppeteer, { type Browser, type Page } from "puppeteer";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { promises as fs } from "fs";
import path from "path";

interface PixelComparisonResult {
  matched: boolean;
  pixelDifferences: number;
  totalPixels: number;
  matchPercentage: number;
  threshold: number;
}

interface MatchRequestBody {
  htmlA: string;
  htmlB: string;
}

function createTestPage(htmlA: string, htmlB: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PNG Visual Match Test</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }
    body { 
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
    }
    .test-container {
      display: flex;
      flex-direction: column;
      gap: 40px;
      padding: 20px;
      background: #ffffff;
    }
    .test-div {
      width: 400px;
      height: 300px;
      padding: 20px;
      background: #ffffff;
      border: none;
      overflow: hidden;
      position: relative;
    }
    /* Ensure consistent rendering */
    .test-div * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
</head>
<body>
  <div class="test-container">
    <div class="test-div" id="divA">${htmlA}</div>
    <div class="test-div" id="divB">${htmlB}</div>
  </div>
  
  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.pageReady = true;
      }, 1500);
    });
  </script>
</body>
</html>`;
}

async function captureElementScreenshot(
  page: Page,
  elementId: string,
): Promise<Buffer> {
  const element = await page.$(`#${elementId}`);
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found`);
  }

  const screenshot = await element.screenshot({
    type: "png",
    omitBackground: false,
  });

  return screenshot as Buffer;
}

async function comparePixels(
  imageA: Buffer,
  imageB: Buffer,
  threshold = 0.1,
): Promise<PixelComparisonResult> {
  const pngA = PNG.sync.read(imageA);
  const pngB = PNG.sync.read(imageB);

  if (pngA.width !== pngB.width || pngA.height !== pngB.height) {
    throw new Error(
      `Image dimensions don't match: ${pngA.width}x${pngA.height} vs ${pngB.width}x${pngB.height}`,
    );
  }

  const { width, height } = pngA;
  const totalPixels = width * height;

  const diff = new PNG({ width, height });

  const pixelDifferences = pixelmatch(
    pngA.data,
    pngB.data,
    diff.data,
    width,
    height,
    { threshold },
  );

  const matchPercentage =
    ((totalPixels - pixelDifferences) / totalPixels) * 100;
  const matched = pixelDifferences === 0;

  return {
    matched,
    pixelDifferences,
    totalPixels,
    matchPercentage,
    threshold,
  };
}

async function saveDebugImages(
  imageA: Buffer,
  imageB: Buffer,
  timestamp: string,
): Promise<void> {
  const debugDir = path.join(process.cwd(), "debug-screenshots");

  try {
    await fs.mkdir(debugDir, { recursive: true });

    const patternPath = path.join(debugDir, `pattern-${timestamp}.png`);
    const userPath = path.join(debugDir, `user-${timestamp}.png`);
    const diffPath = path.join(debugDir, `diff-${timestamp}.png`);

    await fs.writeFile(patternPath, imageA);
    await fs.writeFile(userPath, imageB);

    const pngA = PNG.sync.read(imageA);
    const pngB = PNG.sync.read(imageB);

    if (pngA.width === pngB.width && pngA.height === pngB.height) {
      const { width, height } = pngA;
      const diff = new PNG({ width, height });

      pixelmatch(pngA.data, pngB.data, diff.data, width, height, {
        threshold: 0.1,
        diffColor: [255, 0, 0],
        diffColorAlt: [255, 255, 0],
      });

      await fs.writeFile(diffPath, PNG.sync.write(diff));
    }
  } catch (error) {
    console.warn("Failed to save debug images:", error);
  }
}

export async function POST(req: NextRequest) {
  let browser: Browser | null = null;

  try {
    const body = (await req.json()) as MatchRequestBody;
    const { htmlA, htmlB } = body;

    if (!htmlA || !htmlB) {
      return NextResponse.json(
        { error: "Both htmlA and htmlB are required" },
        { status: 400 },
      );
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
      executablePath:
        process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : undefined,
    });

    const page: Page = await browser.newPage();
    await page.setViewport({
      width: 500,
      height: 500,
      deviceScaleFactor: 1,
    });

    await page.setContent(createTestPage(htmlA, htmlB), {
      waitUntil: "networkidle0",
    });

    await page.waitForFunction(
      () => (window as { pageReady?: boolean }).pageReady === true,
      { timeout: 10000 },
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    const [screenshotA, screenshotB] = await Promise.all([
      captureElementScreenshot(page, "divA"),
      captureElementScreenshot(page, "divB"),
    ]);

    await browser.close();
    browser = null;

    const comparison = await comparePixels(screenshotA, screenshotB, 0.1);

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    await saveDebugImages(screenshotA, screenshotB, timestamp);

    return NextResponse.json({
      matched: comparison.matched,
      pixelDifferences: comparison.pixelDifferences,
      totalPixels: comparison.totalPixels,
      matchPercentage: parseFloat(comparison.matchPercentage.toFixed(2)),
      threshold: comparison.threshold,
    });
  } catch (error) {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Failed to close browser:", closeError);
      }
    }

    console.error("PNG Visual match error:", error);

    return NextResponse.json(
      {
        error: "PNG visual match failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
