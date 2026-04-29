"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

type CountUpProps = {
  value: number;
  /** Animation duration in seconds. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Locale for thousand separator. Default `id-ID` (period separator). */
  locale?: string;
  className?: string;
};

export function CountUp({
  value,
  duration = 1.4,
  prefix = "",
  suffix = "",
  locale = "id-ID",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(reduceMotion ? value : 0);
  const formatted = useTransform(
    motionValue,
    (latest) => `${prefix}${Math.round(latest).toLocaleString(locale)}${suffix}`,
  );

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.4, 0, 0.2, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {formatted}
    </motion.span>
  );
}
