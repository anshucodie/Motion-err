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
    html: `<div class="flex h-full w-full items-center justify-center">
    <div class="relative h-[40%] w-[40%] rounded-full bg-green-500 text-white">
        <div class="absolute bottom-[2px] left-[2px] h-[calc(100%-4px)] w-[calc(50%-4px)] rounded-full border-2 border-white bg-white"></div>
    </div>
</div>`,
  },
  {
    id: "Q3",
    html: `<div class="flex h-full w-full items-center justify-center">
    <div class="relative h-[40%] w-[40%] rounded-full bg-pink-500 text-white">
        <div class="absolute bottom-[2px] left-[2px] h-[calc(100%-4px)] w-[calc(50%-4px)] rounded-full border-2 border-white bg-white"></div>
    </div>
</div>`,
  },
];

export const getPatternHtml = (id: string): string => {
  const pattern = questionPatterns.find((pattern) => pattern.id === id);
  return pattern?.html ?? "";
};
