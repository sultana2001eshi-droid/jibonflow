import { forwardRef } from "react";

export interface ApplicationData {
  text: string;
  type: string;
  typeLabel: string;
}

const ApplicationPreview = forwardRef<HTMLDivElement, { data: ApplicationData }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-gray-900 font-bangla"
        style={{
          fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
          width: "210mm",
          minHeight: "297mm",
          padding: "25mm 20mm",
          boxSizing: "border-box",
        }}
      >
        {/* Decorative header */}
        <div className="text-center mb-8">
          <div className="inline-block border-b-2 border-t-2 border-gray-800 py-2 px-8">
            <h1 className="text-xl font-bold tracking-wide">{data.typeLabel}</h1>
          </div>
        </div>

        {/* Body */}
        <div className="whitespace-pre-wrap text-base leading-[2] text-gray-800">
          {data.text}
        </div>

        {/* Footer note */}
        <div className="mt-auto pt-16 text-center text-xs text-gray-400 border-t border-gray-200">
          JibonFlow — স্মার্ট দরখাস্ত জেনারেটর
        </div>
      </div>
    );
  }
);

ApplicationPreview.displayName = "ApplicationPreview";
export default ApplicationPreview;
