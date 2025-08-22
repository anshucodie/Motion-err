"use client";

import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { useState, useEffect } from "react";
import { questionPatterns, getPatternHtml } from "../data/questionPatterns";
import { tailwindCSS } from "../utils/tailwindCompletion";
import { HtmlPreview } from "../components/HtmlPreview";

export default function HomePage() {
  const [changed, setChanged] = useState("");
  const [activePattern, setActivePattern] = useState("Q1");
  const [topDivContent, setTopDivContent] = useState("");
  const [matchResult, setMatchResult] = useState<"success" | "failure" | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTopDivContent(getPatternHtml("Q1"));
  }, []);

  const handlePatternClick = (pattern: string) => {
    setActivePattern(pattern);
    setTopDivContent(getPatternHtml(pattern));
    setChanged("");
    setMatchResult(null);
  };

  const handleMatch = async () => {
    setLoading(true);
    try {
      const patternHtml = getPatternHtml(activePattern);
      const userHtml = changed || topDivContent || "";

      const res = await fetch("/api/visual-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlA: patternHtml, htmlB: userHtml }),
      });
      if (!res.ok) {
        alert("Matching failed on server. Try again.");
        return;
      }
      const data = (await res.json()) as {
        matched: boolean;
        pixelDifferences: number;
        totalPixels: number;
        matchPercentage: number;
        threshold: number;
      };

      if (data.matched) {
        setMatchResult("success");
        alert("Success! The designs visually match.");
      } else {
        setMatchResult("failure");
        alert(
          `Try again. ${data.pixelDifferences} pixels different out of ${data.totalPixels} total (${data.matchPercentage.toFixed(1)}% match)`,
        );
      }
    } catch (e) {
      console.error("Match error:", e);
      alert(
        `Error during matching: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full w-full flex-col justify-center">
      <div className="mx-5 mt-[1.5vh] flex h-[6vh] w-[calc(100%-10)] items-center justify-between border-1 border-gray-700 px-5">
        <div className="text-2xl font-light">Motion-err</div>
        <div className="flex items-center justify-center">
          {questionPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handlePatternClick(pattern.id)}
              className={`mx-10 cursor-pointer text-2xl font-light transition-colors ${
                activePattern === pattern.id
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {pattern.id}
            </button>
          ))}
        </div>
      </div>
      <div className="flex h-[92.5vh] w-full">
        <div className="ml-5 flex h-[92.5vh] w-[50%] flex-col gap-5">
          <div
            className={`grid-background relative mt-5 h-[50%] w-full border-1 ${
              matchResult === "success"
                ? "border-2 border-[#a3e635] transition-all duration-300"
                : matchResult === "failure"
                  ? "border-[#ef4444] transition-all duration-300"
                  : "border-gray-700"
            }`}
          >
            <div className="relative z-10 h-full w-full">
              {changed ? (
                <HtmlPreview htmlContent={changed} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Start typing HTML with Tailwind classes...
                </div>
              )}
            </div>
          </div>
          <div className="grid-background relative mb-5 h-[50%] w-full border-1 border-gray-700">
            <div className="relative z-10 h-full w-full">
              {topDivContent ? (
                <HtmlPreview htmlContent={topDivContent} />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-[70%] w-[40%] rounded-full bg-blue-500 text-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative m-5 h-[100vh-5] w-[50%] border-1 border-gray-700">
          <CodeMirror
            value={changed || topDivContent}
            height="100%"
            extensions={[html(), tailwindCSS()]}
            onChange={(value) => {
              setChanged(value);
            }}
          />
          <div className="absolute bottom-0 h-[7vh] w-full border-t border-gray-700">
            <div className="flex h-full w-full items-center justify-end">
              {loading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-700 border-t-transparent"></div>
              )}
              <button
                onClick={handleMatch}
                disabled={loading}
                className={`mx-3 cursor-pointer rounded-sm border-1 border-gray-700 px-5 py-1 text-xl font-light ${
                  matchResult === "success"
                    ? "bg-[#bef264] text-black transition-all duration-300"
                    : matchResult === "failure"
                      ? "bg-[#ef4444] text-white transition-all duration-300"
                      : ""
                } ${loading ? "cursor-not-allowed opacity-75" : ""}`}
              >
                Match
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
