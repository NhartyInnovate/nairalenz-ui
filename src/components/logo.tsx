import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-primary shadow-glow">
        <span className="font-display text-lg italic leading-none text-primary-foreground">₦</span>
        <span className="absolute inset-0 rounded-[10px] ring-1 ring-inset ring-white/20" />
      </span>
      {showWord && (
        <span className="flex items-baseline gap-1 leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            NairaLens
          </span>
          <span className="font-display text-[15px] italic text-primary">AI</span>
        </span>
      )}
    </Link>
  );
}
