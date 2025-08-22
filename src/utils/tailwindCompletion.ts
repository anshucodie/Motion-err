import {
  autocompletion,
  type CompletionContext,
} from "@codemirror/autocomplete";
import type { Extension } from "@codemirror/state";

const TAILWIND_UTILITIES = {
  spacing: {
    margin: ["m", "mx", "my", "mt", "mr", "mb", "ml"],
    padding: ["p", "px", "py", "pt", "pr", "pb", "pl"],
    space: ["space-x", "space-y"],
    values: [
      "0",
      "0.5",
      "1",
      "1.5",
      "2",
      "2.5",
      "3",
      "3.5",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "20",
      "24",
      "28",
      "32",
      "36",
      "40",
      "44",
      "48",
      "52",
      "56",
      "60",
      "64",
      "72",
      "80",
      "96",
      "auto",
      "px",
    ],
  },
  sizing: {
    width: ["w"],
    height: ["h"],
    minWidth: ["min-w"],
    minHeight: ["min-h"],
    maxWidth: ["max-w"],
    maxHeight: ["max-h"],
    values: [
      "0",
      "0.5",
      "1",
      "1.5",
      "2",
      "2.5",
      "3",
      "3.5",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "20",
      "24",
      "28",
      "32",
      "36",
      "40",
      "44",
      "48",
      "52",
      "56",
      "60",
      "64",
      "72",
      "80",
      "96",
      "auto",
      "px",
      "full",
      "screen",
      "min",
      "max",
      "fit",
    ],
  },
  position: {
    properties: [
      "top",
      "right",
      "bottom",
      "left",
      "inset",
      "inset-x",
      "inset-y",
    ],
    values: [
      "0",
      "0.5",
      "1",
      "1.5",
      "2",
      "2.5",
      "3",
      "3.5",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "20",
      "24",
      "28",
      "32",
      "36",
      "40",
      "44",
      "48",
      "52",
      "56",
      "60",
      "64",
      "72",
      "80",
      "96",
      "auto",
      "px",
      "full",
    ],
  },
  colors: {
    properties: ["bg", "text", "border", "ring", "shadow"],
    values: [
      "transparent",
      "current",
      "inherit",
      "black",
      "white",
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
    ],
    intensities: [
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ],
  },
  layout: {
    display: [
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "table",
      "inline-table",
      "table-caption",
      "table-cell",
      "table-column",
      "table-column-group",
      "table-footer-group",
      "table-header-group",
      "table-row-group",
      "table-row",
      "flow-root",
      "grid",
      "inline-grid",
      "contents",
      "list-item",
      "hidden",
    ],
    position: ["static", "fixed", "absolute", "relative", "sticky"],
    overflow: [
      "overflow-auto",
      "overflow-hidden",
      "overflow-clip",
      "overflow-visible",
      "overflow-scroll",
      "overflow-x-auto",
      "overflow-y-auto",
      "overflow-x-hidden",
      "overflow-y-hidden",
      "overflow-x-clip",
      "overflow-y-clip",
      "overflow-x-visible",
      "overflow-y-visible",
      "overflow-x-scroll",
      "overflow-y-scroll",
    ],
  },
  flexbox: {
    direction: ["flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse"],
    wrap: ["flex-wrap", "flex-wrap-reverse", "flex-nowrap"],
    align: [
      "items-start",
      "items-end",
      "items-center",
      "items-baseline",
      "items-stretch",
    ],
    justify: [
      "justify-start",
      "justify-end",
      "justify-center",
      "justify-between",
      "justify-around",
      "justify-evenly",
    ],
    gap: ["gap", "gap-x", "gap-y"],
  },
  typography: {
    fontSize: [
      "text-xs",
      "text-sm",
      "text-base",
      "text-lg",
      "text-xl",
      "text-2xl",
      "text-3xl",
      "text-4xl",
      "text-5xl",
      "text-6xl",
      "text-7xl",
      "text-8xl",
      "text-9xl",
    ],
    fontWeight: [
      "font-thin",
      "font-extralight",
      "font-light",
      "font-normal",
      "font-medium",
      "font-semibold",
      "font-bold",
      "font-extrabold",
      "font-black",
    ],
    textAlign: [
      "text-left",
      "text-center",
      "text-right",
      "text-justify",
      "text-start",
      "text-end",
    ],
    textTransform: ["uppercase", "lowercase", "capitalize", "normal-case"],
  },
  borders: {
    width: [
      "border",
      "border-0",
      "border-2",
      "border-4",
      "border-8",
      "border-t",
      "border-r",
      "border-b",
      "border-l",
      "border-t-0",
      "border-r-0",
      "border-b-0",
      "border-l-0",
      "border-t-2",
      "border-r-2",
      "border-b-2",
      "border-l-2",
      "border-t-4",
      "border-r-4",
      "border-b-4",
      "border-l-4",
      "border-t-8",
      "border-r-8",
      "border-b-8",
      "border-l-8",
    ],
    radius: [
      "rounded",
      "rounded-none",
      "rounded-sm",
      "rounded-md",
      "rounded-lg",
      "rounded-xl",
      "rounded-2xl",
      "rounded-3xl",
      "rounded-full",
      "rounded-t",
      "rounded-r",
      "rounded-b",
      "rounded-l",
      "rounded-tl",
      "rounded-tr",
      "rounded-br",
      "rounded-bl",
    ],
  },
};

const STATE_MODIFIERS = [
  "hover",
  "focus",
  "focus-within",
  "focus-visible",
  "active",
  "visited",
  "target",
  "first",
  "last",
  "odd",
  "even",
  "first-of-type",
  "last-of-type",
  "only-child",
  "only-of-type",
  "empty",
  "disabled",
  "enabled",
  "checked",
  "indeterminate",
  "default",
  "required",
  "valid",
  "invalid",
  "in-range",
  "out-of-range",
  "placeholder-shown",
  "autofill",
  "read-only",
];

const RESPONSIVE_MODIFIERS = ["sm", "md", "lg", "xl", "2xl"];

const THEME_MODIFIERS = ["dark"];

function generateTailwindClasses(): string[] {
  const classes: string[] = [];

  TAILWIND_UTILITIES.spacing.margin.forEach((prefix) => {
    TAILWIND_UTILITIES.spacing.values.forEach((value) => {
      classes.push(`${prefix}-${value}`);
    });
  });

  TAILWIND_UTILITIES.spacing.padding.forEach((prefix) => {
    TAILWIND_UTILITIES.spacing.values.forEach((value) => {
      classes.push(`${prefix}-${value}`);
    });
  });

  Object.values(TAILWIND_UTILITIES.sizing)
    .slice(0, -1)
    .forEach((prefixes) => {
      if (Array.isArray(prefixes)) {
        prefixes.forEach((prefix) => {
          TAILWIND_UTILITIES.sizing.values.forEach((value) => {
            classes.push(`${prefix}-${value}`);
          });
        });
      }
    });

  TAILWIND_UTILITIES.position.properties.forEach((prefix) => {
    TAILWIND_UTILITIES.position.values.forEach((value) => {
      classes.push(`${prefix}-${value}`);
    });
  });

  TAILWIND_UTILITIES.colors.properties.forEach((prefix) => {
    TAILWIND_UTILITIES.colors.values.forEach((color) => {
      if (
        ["transparent", "current", "inherit", "black", "white"].includes(color)
      ) {
        classes.push(`${prefix}-${color}`);
      } else {
        TAILWIND_UTILITIES.colors.intensities.forEach((intensity) => {
          classes.push(`${prefix}-${color}-${intensity}`);
        });
      }
    });
  });

  classes.push(...TAILWIND_UTILITIES.layout.display);
  classes.push(...TAILWIND_UTILITIES.layout.position);
  classes.push(...TAILWIND_UTILITIES.layout.overflow);

  classes.push(...TAILWIND_UTILITIES.flexbox.direction);
  classes.push(...TAILWIND_UTILITIES.flexbox.wrap);
  classes.push(...TAILWIND_UTILITIES.flexbox.align);
  classes.push(...TAILWIND_UTILITIES.flexbox.justify);

  TAILWIND_UTILITIES.flexbox.gap.forEach((prefix) => {
    TAILWIND_UTILITIES.spacing.values.forEach((value) => {
      classes.push(`${prefix}-${value}`);
    });
  });

  classes.push(...TAILWIND_UTILITIES.typography.fontSize);
  classes.push(...TAILWIND_UTILITIES.typography.fontWeight);
  classes.push(...TAILWIND_UTILITIES.typography.textAlign);
  classes.push(...TAILWIND_UTILITIES.typography.textTransform);

  classes.push(...TAILWIND_UTILITIES.borders.width);
  classes.push(...TAILWIND_UTILITIES.borders.radius);

  return classes;
}

function generateClassesWithModifiers(): string[] {
  const baseClasses = generateTailwindClasses();
  const allClasses = [...baseClasses];

  STATE_MODIFIERS.forEach((modifier) => {
    baseClasses.forEach((className) => {
      allClasses.push(`${modifier}:${className}`);
    });
  });

  RESPONSIVE_MODIFIERS.forEach((modifier) => {
    baseClasses.forEach((className) => {
      allClasses.push(`${modifier}:${className}`);
    });
  });

  THEME_MODIFIERS.forEach((modifier) => {
    baseClasses.forEach((className) => {
      allClasses.push(`${modifier}:${className}`);
    });
  });

  RESPONSIVE_MODIFIERS.forEach((responsive) => {
    STATE_MODIFIERS.forEach((state) => {
      baseClasses.forEach((className) => {
        allClasses.push(`${responsive}:${state}:${className}`);
      });
    });
  });

  return allClasses;
}

function isInClassAttribute(context: CompletionContext): boolean {
  const line = context.state.doc.lineAt(context.pos);
  const lineText = line.text;
  const beforeCursor = lineText.slice(0, context.pos - line.from);

  const patterns = [
    /class\s*=\s*["'][^"']*$/, // class="..."
    /className\s*=\s*["'][^"']*$/, // className="..."
    /class\s*=\s*["'][^"']*\s[^"']*$/, // class="existing-class new-class"
  ];

  return patterns.some((pattern) => pattern.exec(beforeCursor) !== null);
}

function isArbitraryValue(text: string): boolean {
  const regex = /^[a-z-]+\[/;
  return regex.exec(text) !== null;
}

function generateArbitraryValueSuggestions(prefix: string): string[] {
  const suggestions: string[] = [];

  const patterns = {
    spacing: [
      "1px",
      "2px",
      "3px",
      "4px",
      "5px",
      "10px",
      "15px",
      "20px",
      "25px",
      "30px",
    ],
    sizes: [
      "100px",
      "200px",
      "300px",
      "400px",
      "500px",
      "50%",
      "100%",
      "25%",
      "75%",
    ],
    colors: [
      "#000",
      "#fff",
      "#333",
      "#666",
      "#999",
      "#ccc",
      "rgb(255,0,0)",
      "rgba(255,0,0,0.5)",
    ],
  };

  if (
    prefix.startsWith("top-[") ||
    prefix.startsWith("right-[") ||
    prefix.startsWith("bottom-[") ||
    prefix.startsWith("left-[") ||
    prefix.startsWith("m-[") ||
    prefix.startsWith("p-[") ||
    prefix.startsWith("mt-[") ||
    prefix.startsWith("mr-[") ||
    prefix.startsWith("mb-[") ||
    prefix.startsWith("ml-[") ||
    prefix.startsWith("pt-[") ||
    prefix.startsWith("pr-[") ||
    prefix.startsWith("pb-[") ||
    prefix.startsWith("pl-[")
  ) {
    patterns.spacing.forEach((value) => {
      suggestions.push(prefix.replace(/\[[^\]]*$/, `[${value}]`));
    });
  }

  if (
    prefix.startsWith("w-[") ||
    prefix.startsWith("h-[") ||
    prefix.startsWith("min-w-[") ||
    prefix.startsWith("max-w-[") ||
    prefix.startsWith("min-h-[") ||
    prefix.startsWith("max-h-[")
  ) {
    patterns.sizes.forEach((value) => {
      suggestions.push(prefix.replace(/\[[^\]]*$/, `[${value}]`));
    });
  }

  if (
    prefix.startsWith("bg-[") ||
    prefix.startsWith("text-[") ||
    prefix.startsWith("border-[")
  ) {
    patterns.colors.forEach((value) => {
      suggestions.push(prefix.replace(/\[[^\]]*$/, `[${value}]`));
    });
  }

  return suggestions;
}

const tailwindCompletion = autocompletion({
  override: [
    (context) => {
      if (!isInClassAttribute(context)) {
        return null;
      }

      const line = context.state.doc.lineAt(context.pos);
      const lineText = line.text;
      const beforeCursor = lineText.slice(0, context.pos - line.from);

      const wordRegex = /(?:^|[\s"'])([^\s"']*)$/;
      const wordMatch = wordRegex.exec(beforeCursor);
      if (!wordMatch?.[1]) {
        return null;
      }

      const word = wordMatch[1];
      const wordStart = context.pos - word.length;

      if (isArbitraryValue(word)) {
        const arbitrarySuggestions = generateArbitraryValueSuggestions(word);
        return {
          from: wordStart,
          options: arbitrarySuggestions.map((label) => ({
            label,
            type: "keyword",
          })),
        };
      }

      const allClasses = generateClassesWithModifiers();

      const filteredClasses = allClasses
        .filter((className) =>
          className.toLowerCase().startsWith(word.toLowerCase()),
        )
        .slice(0, 50);

      return {
        from: wordStart,
        options: filteredClasses.map((label) => ({
          label,
          type: "keyword",
          info: `Tailwind CSS utility class`,
        })),
      };
    },
  ],
});

export function tailwindCSS(): Extension {
  return [tailwindCompletion];
}
