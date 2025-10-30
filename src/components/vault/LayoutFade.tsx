"use client";
import { motion } from "framer-motion";

export function LayoutFade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function SectionFade({
  children,
  delay = 0,
  as: As = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: any;
}) {
  return (
    <As
      className=""
      // @ts-ignore (motion typing)
      as={motion[As] ?? motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </As>
  );
}
