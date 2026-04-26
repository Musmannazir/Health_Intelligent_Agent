import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & {
  tealTop?: boolean;
  delay?: number;
};

export function GlassCard({ className, children, tealTop, delay = 0, ...props }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass relative rounded-2xl p-5 transition-all duration-300 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)]",
        tealTop && "teal-top",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
