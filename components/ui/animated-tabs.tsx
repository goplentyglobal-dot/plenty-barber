"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: AnimatedTab[];
  defaultTab?: string;
  className?: string;
}

export function AnimatedTabs({ tabs, defaultTab, className }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);

  if (!tabs?.length) return null;

  return (
    <div className={cn("flex w-full flex-col gap-y-2", className)}>
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-noir-soft/60 p-1 backdrop-blur">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="relative rounded-lg px-3 py-1.5 text-sm font-medium text-cream/72 outline-none transition-colors hover:text-cream"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="pb-active-tab"
                className="absolute inset-0 rounded-lg border border-gold/25 bg-gold/10 shadow-gold"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <span className={cn("relative z-10", activeTab === tab.id && "text-gold-light")}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div className="luxury-panel min-h-60 rounded-xl p-5 text-cream backdrop-blur">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, scale: 0.97, x: -10, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: "circInOut" }}
              >
                {tab.content}
              </motion.div>
            )
        )}
      </div>
    </div>
  );
}
