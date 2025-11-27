import React from "react";
import type { LayoutOptions } from "@/types/layout";

type LayoutToolbarProps = {
  layoutOptions: LayoutOptions;
  onChange: (patch: Partial<LayoutOptions>) => void;
};

type ToolbarFieldConfig = {
  label: string;
  field: keyof LayoutOptions;
  inputWidth: string;
};

const TOOLBAR_FIELDS: ToolbarFieldConfig[] = [
  { label: "Width", field: "pageWidth", inputWidth: "w-16" },
  { label: "Height", field: "pageHeight", inputWidth: "w-16" },
  { label: "Top", field: "marginTop", inputWidth: "w-14" },
  { label: "Bottom", field: "marginBottom", inputWidth: "w-14" },
  { label: "Left", field: "marginLeft", inputWidth: "w-14" },
  { label: "Right", field: "marginRight", inputWidth: "w-14" },
];

/**
 * LayoutToolbar
 *
 * Renders a toolbar with input controls for adjusting page layout options
 * (dimensions, margins). Updates are passed to the parent via onChange.
 */
export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
  layoutOptions,
  onChange,
}) => {
  const handleNumberChange =
    (field: keyof LayoutOptions) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      if (Number.isNaN(value)) return;
      onChange({ [field]: value });
    };

  return (
    <div className="w-full border-b border-slate-200 bg-white px-4 py-2 flex flex-wrap gap-4 items-center text-xs">
      <span className="font-semibold text-slate-700 mr-2">Page layout</span>

      {TOOLBAR_FIELDS.map(({ label, field, inputWidth }) => (
        <label key={field} className="flex items-center gap-1">
          <span className="text-slate-500">{label}</span>
          <input
            type="number"
            className={`${inputWidth} border border-slate-200 rounded px-1 py-0.5 text-[11px]`}
            value={layoutOptions[field] as number}
            onChange={handleNumberChange(field)}
          />
        </label>
      ))}
    </div>
  );
};
