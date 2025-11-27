import React from "react";
import type { LayoutOptions } from "@/types/layout";

type LayoutToolbarProps = {
  layoutOptions: LayoutOptions;
  onChange: (patch: Partial<LayoutOptions>) => void;
};

type ToolbarFieldConfig = {
  label: string;
  field: keyof LayoutOptions;
  options: number[];
  inputWidth: string;
};

const TOOLBAR_FIELDS: ToolbarFieldConfig[] = [
  {
    label: "Width",
    field: "pageWidth",
    inputWidth: "w-20",
    options: [300, 400, 500, 600, 700, 794, 900, 1000], // A4 default included
  },
  {
    label: "Height",
    field: "pageHeight",
    inputWidth: "w-20",
    options: [400, 500, 600, 700, 800, 900, 1000, 1123, 1300, 1500], // A4 default included
  },
  {
    label: "Top",
    field: "marginTop",
    inputWidth: "w-16",
    options: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  {
    label: "Bottom",
    field: "marginBottom",
    inputWidth: "w-16",
    options: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  {
    label: "Left",
    field: "marginLeft",
    inputWidth: "w-16",
    options: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  {
    label: "Right",
    field: "marginRight",
    inputWidth: "w-16",
    options: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  {
    label: "Line height",
    field: "lineHeight",
    inputWidth: "w-16",
    options: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  },
  {
    label: "Font size",
    field: "fontSize",
    inputWidth: "w-16",
    options: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  },
];

/**
 * LayoutToolbar with dropdown inputs
 *
 * Avoids numeric input problems and ensures only valid layout values are used.
 */
export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
  layoutOptions,
  onChange,
}) => {
  function handleSelectChange(field: keyof LayoutOptions) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      onChange({ [field]: value });
    };
  }

  return (
    <div className="w-full border-b border-slate-200 bg-white px-4 py-2 flex flex-wrap gap-4 items-center text-xs">
      <span className="font-semibold text-slate-700 mr-2">Page layout</span>

      {TOOLBAR_FIELDS.map(({ label, field, inputWidth, options }) => (
        <label key={field} className="flex items-center gap-1">
          <span className="text-slate-500">{label}</span>

          <select
            className={`${inputWidth} border border-slate-200 rounded px-1 py-0.5 text-[11px] bg-white`}
            value={layoutOptions[field] as number}
            onChange={handleSelectChange(field)}
          >
            {options.map((value) => (
              <option key={value} value={value}>
                {value}px
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
};
