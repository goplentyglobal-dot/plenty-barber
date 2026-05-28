"use client";

import { useEffect } from "react";

const patterns = {
  complete: [80, 40, 120],
  success: [60, 30, 60],
  error: [180, 60, 180]
} as const;

export function VibrationFeedback({ type = "complete" }: { type?: keyof typeof patterns }) {
  useEffect(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(patterns[type]);
    }
  }, [type]);

  return null;
}
