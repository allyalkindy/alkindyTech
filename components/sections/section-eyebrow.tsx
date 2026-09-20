export function SectionEyebrow({
  index,
  label,
  light = false,
}: {
  index: string;
  label: string;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`font-serif italic text-lg ${light ? "text-primary" : "text-primary"}`}>
        {index}
      </span>
      <span className={`w-8 h-px ${light ? "bg-background/30" : "bg-border"}`} />
      <span
        className={`text-xs font-semibold tracking-[0.2em] uppercase ${
          light ? "text-background/70" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
