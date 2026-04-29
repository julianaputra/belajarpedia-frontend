"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "variants" | "initial" | "whileInView" | "viewport"
> & {
  /** Cancel the entrance once it has fired. Defaults to true. */
  once?: boolean;
  /** Override the stagger interval (seconds). */
  stagger?: number;
};

/**
 * Container that orchestrates a staggered entrance for its direct children.
 *
 * Children should be wrapped in <RevealItem> so each one inherits the
 * `hidden`/`visible` states. Drop in as the layout div itself — pass
 * `className` for grid/flex/spacing the same way you would on a normal div.
 */
export function Reveal({
  once = true,
  stagger,
  children,
  ...rest
}: RevealProps) {
  const variants: Variants = stagger
    ? {
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: 0.05 },
        },
      }
    : containerVariants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Single fade-up element. Use as a child of <Reveal>. */
export function RevealItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
}
