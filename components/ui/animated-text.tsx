"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  gradientColors?: string;
  gradientAnimationDuration?: number;
  className?: string;
  textClassName?: string;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      gradientColors = "linear-gradient(90deg, #8A6820, #E8D5A3, #C9A84C, #F7F3EC, #8A6820)",
      gradientAnimationDuration = 6,
      className,
      textClassName,
      ...props
    },
    ref
  ) => {
    const textVariants: Variants = {
      initial: { backgroundPosition: "0 0" },
      animate: {
        backgroundPosition: "100% 0",
        transition: {
          duration: gradientAnimationDuration,
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      }
    };

    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        <motion.span
          className={cn("font-display leading-tight", textClassName)}
          style={{
            background: gradientColors,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          {text}
        </motion.span>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
