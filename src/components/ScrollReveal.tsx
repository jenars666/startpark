"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = "",
}: ScrollRevealProps) {
  // Define the starting position based on the chosen direction
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      case "none":
        return { opacity: 0, scale: 0.95 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-100px" }} // Triggers slightly before coming fully into view
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1], // Smooth cubic bezier easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
