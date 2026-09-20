const items = [
  "REACT.JS",
  "NEXT.JS",
  "TYPESCRIPT",
  "TAILWIND CSS",
  "NODE.JS",
  "CUSTOM WEB APPS",
  "SEO-MINDED BUILDS",
  "BUSINESS WEBSITES",
];

export function MarqueeStrip() {
  const track = [...items, ...items];

  return (
    <div className="bg-foreground text-background overflow-hidden border-y border-foreground/10">
      <div className="flex w-max py-4 animate-marquee">
        {track.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="mx-6 sm:mx-8 text-sm sm:text-base font-semibold tracking-[0.15em] whitespace-nowrap">
              {item}
            </span>
            <span className="text-primary text-lg">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
