import { useState, useEffect, type FC } from "react";

const TypingIndicator: FC = () => {
  const [ninjaImageError, setNinjaImageError] = useState(false);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    // Load SVG from public folder and inline it for animations to work
    fetch("/svg/typing-dots.svg")
      .then((res) => res.text())
      .then((text) => {
        setSvgContent(text);
      })
      .catch((err) => {
        console.error("Failed to load typing dots SVG:", err);
      });
  }, []);

  return (
    <div className="flex gap-3">
      {/* Ninja Icon */}
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 bg-[#1A1A1A] flex items-center justify-center">
          {!ninjaImageError ? (
            <img
              src="/svg/ninja-spinner.svg"
              alt="Ninja Assistant"
              className="h-5 w-5"
              onError={() => setNinjaImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-[#DC2626] font-bold">
              N
            </div>
          )}
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="flex items-start">
        <div className="max-w-[75%] sm:max-w-[70%] md:max-w-[65%] rounded-lg px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white/70 rounded-tl-sm">
          <div className="flex items-center gap-1">
            {svgContent ? (
              <div
                className="typing-dots"
                dangerouslySetInnerHTML={{ __html: svgContent }}
                style={{ color: "currentColor" }}
              />
            ) : (
              <svg
                width="48"
                height="12"
                viewBox="0 0 48 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="typing-dots"
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4"
                  fill="currentColor"
                  fillOpacity="0.6"
                  className="typing-dot-1"
                />
                <circle
                  cx="24"
                  cy="6"
                  r="4"
                  fill="currentColor"
                  fillOpacity="0.6"
                  className="typing-dot-2"
                />
                <circle
                  cx="42"
                  cy="6"
                  r="4"
                  fill="currentColor"
                  fillOpacity="0.6"
                  className="typing-dot-3"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
