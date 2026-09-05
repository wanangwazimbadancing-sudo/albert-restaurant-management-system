import React from "react";

const TOSSED_ITEMS = [
  { id: "tomato", type: "circle", cx: 108, cy: 68, r: 6, color: "#bf4a3a", delay: "0s" },
  {
    id: "noodle",
    type: "path",
    d: "M148 58 q10 -14 20 -4 q8 8 -2 16",
    color: "#d6a52f",
    delay: "0.18s",
  },
  {
    id: "herb",
    type: "path",
    d: "M188 56 q8 -10 16 -2 q6 6 -4 12",
    color: "#7c8f4f",
    delay: "0.36s",
  },
];

const PageLoader = ({ label = "Albert is cooking" }) => {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center gap-6  py-10">


      <svg viewBox="0 0 300 170" className="w-56 h-auto" fill="none">
        {/* steam rising from the pan */}
        <path
          className="rl-steam"
          style={{ animationDelay: "0.2s" }}
          d="M122 42 q6 -8 0 -16 q-6 -8 0 -16"
          stroke="#c9c3b8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="rl-steam"
          style={{ animationDelay: "0.9s" }}
          d="M172 46 q6 -8 0 -16 q-6 -8 0 -16"
          stroke="#c9c3b8"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* food tossing above the pan */}
        {TOSSED_ITEMS.map((item) =>
          item.type === "circle" ? (
            <circle
              key={item.id}
              className="rl-toss-piece"
              style={{ animationDelay: item.delay }}
              cx={item.cx}
              cy={item.cy}
              r={item.r}
              fill={item.color}
            />
          ) : (
            <path
              key={item.id}
              className="rl-toss-piece"
              style={{ animationDelay: item.delay }}
              d={item.d}
              stroke={item.color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          )
        )}

        {/* the pan, drawn last so it sits in front */}
        <g stroke="#2b2a28" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="50" y1="96" x2="270" y2="96" />
          <path d="M50 96 C50 122 68 138 96 138 L174 138 C202 138 220 122 220 96" />
          <path d="M72 108 q6 12 0 22" strokeWidth="3" />
          <path d="M198 108 q-6 12 0 22" strokeWidth="3" />
        </g>
      </svg>

      <p className="text-sm tracking-wide text-stone-500">
        {label}
        <span className="rl-dot" style={{ animationDelay: "0s" }}>.</span>
        <span className="rl-dot" style={{ animationDelay: "0.2s" }}>.</span>
        <span className="rl-dot" style={{ animationDelay: "0.4s" }}>.</span>
      </p>
    </div>
  );
}

export default PageLoader;