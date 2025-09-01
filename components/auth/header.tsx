import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
  className?: string;
}

export const Header = ({
  label,
  className,
}: HeaderProps) => {
  return (
    <div className={cn("w-full flex flex-col gap-y-6 items-center justify-center text-center", className)}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.jpg"
            alt="DENR Logo"
            width={48}
            height={48}
            className="rounded-lg shadow-sm"
          />
        </div>
        <h1 className={cn(
          "text-2xl font-bold text-lime-900 dark:text-lime-100",
          font.className,
        )}>
          Chainsaw Registry
        </h1>
      </div>
      <p className="text-lime-700 dark:text-lime-300 text-sm max-w-sm leading-relaxed">
        {label}
      </p>
    </div>
  );
};
