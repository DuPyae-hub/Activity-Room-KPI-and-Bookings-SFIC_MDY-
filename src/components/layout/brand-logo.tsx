import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  height?: number;
};

export function BrandLogo({ className, height = 40 }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-white p-1 shadow-md ring-1 ring-black/10",
        className,
      )}
    >
      <Image
        src="/brand/sfic-logo.png"
        alt="Strategy First International College Mandalay"
        width={Math.round(height * 3.2)}
        height={height}
        className="h-auto w-auto object-contain"
        style={{ maxHeight: height }}
        priority
      />
    </span>
  );
}
