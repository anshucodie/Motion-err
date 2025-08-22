export interface QuestionPattern {
  id: string;
  html: string;
}

export const questionPatterns: QuestionPattern[] = [
  {
    id: "Q1",
    html: `<div class="flex h-full w-full items-center justify-center">
    <div class="relative h-[40%] w-[40%] rounded-full bg-blue-500 text-white">
        <div class="absolute bottom-[2px] left-[2px] h-[calc(100%-4px)] w-[calc(50%-4px)] rounded-full border-2 border-white bg-white"></div>
    </div>
</div>`,
  },
  {
    id: "Q2",
    html: `<div class="bg-green-500 text-white p-6 rounded-xl border-2 border-green-300">
  <h2 class="text-2xl font-semibold mb-3">Question 2</h2>
  <p class="text-base">This is a sample pattern for Q2</p>
</div>`,
  },
  {
    id: "Q3",
    html: `<div class="bg-purple-500 text-white p-5 rounded-md shadow-xl">
  <h2 class="text-lg font-medium mb-2">Question 3</h2>
  <p class="text-sm opacity-90">This is a sample pattern for Q3</p>
</div>`,
  },
];

export const getPatternHtml = (id: string): string => {
  const pattern = questionPatterns.find((pattern) => pattern.id === id);
  return pattern?.html ?? "";
};
