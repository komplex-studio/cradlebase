"use client";

import { useSyncExternalStore } from "react";
import Lottie from "lottie-react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
// No media query on the server — assume motion is allowed for the initial HTML.
const getServerSnapshot = () => false;

/**
 * Thin wrapper around lottie-react that respects the user's reduced-motion
 * preference — when motion is reduced we render the first frame, static.
 */
export default function LottiePlayer({ animationData, className = "", loop = true }) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Lottie
      animationData={animationData}
      loop={loop && !reduced}
      autoplay={!reduced}
      className={className}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      aria-hidden="true"
    />
  );
}
