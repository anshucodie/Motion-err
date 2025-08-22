"use client";

import { useMemo } from "react";

interface HtmlPreviewProps {
  htmlContent: string;
  className?: string;
}

export function HtmlPreview({ htmlContent, className = "" }: HtmlPreviewProps) {
  const iframeSrc = useMemo(() => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: transparent;
      height: 100vh;
      overflow: hidden;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

    return `data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`;
  }, [htmlContent]);

  return (
    <iframe
      src={iframeSrc}
      className={`h-full w-full border-none ${className}`}
      title="HTML Preview"
      sandbox="allow-scripts"
    />
  );
}
