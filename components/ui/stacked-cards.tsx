"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export interface StackedCardData {
  image: string;
  title: string;
  description: string;
}

function StackCard({
  className,
  image,
  children
}: {
  className?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "luxury-panel h-[400px] w-[320px] cursor-pointer overflow-hidden rounded-2xl",
        className
      )}
    >
      {image && (
        <div className="relative mx-2 mt-2 h-72 w-[calc(100%-1rem)] overflow-hidden rounded-xl shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={String(children)} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-y-1 px-4 py-3">{children}</div>
    </div>
  );
}

export function StackedCards({
  cards,
  spreadDistance = 48,
  rotationAngle = 6,
  animationDelay = 0.1
}: {
  cards: StackedCardData[];
  spreadDistance?: number;
  rotationAngle?: number;
  animationDelay?: number;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const limitedCards = cards.slice(0, 3);

  return (
    <div className="relative flex h-[420px] w-full items-center justify-center">
      <div className="relative h-[400px] w-[320px]">
        {limitedCards.map((card, index) => {
          const isFirst = index === 0;
          let xOffset = 0;
          let rotation = 0;

          if (limitedCards.length > 1) {
            if (index === 1) {
              xOffset = -spreadDistance;
              rotation = -rotationAngle;
            } else if (index === 2) {
              xOffset = spreadDistance;
              rotation = rotationAngle;
            }
          }

          return (
            <motion.div
              key={index}
              className={cn("absolute", isFirst ? "z-10" : "z-0")}
              initial={{ x: 0, rotate: 0 }}
              animate={{
                x: isHovering ? xOffset : 0,
                rotate: isHovering ? rotation : 0,
                zIndex: isFirst ? 10 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: index * animationDelay, type: "spring" }}
              {...(isFirst && {
                onHoverStart: () => setIsHovering(true),
                onHoverEnd: () => setIsHovering(false)
              })}
            >
              <StackCard className={isFirst ? "z-10" : "z-0"} image={card.image}>
                <h3 className="font-display text-xl text-cream">{card.title}</h3>
                <p className="text-sm text-cream/62">{card.description}</p>
              </StackCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
