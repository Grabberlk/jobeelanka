export const bentoSpring = {
  type: "spring" as const,
  stiffness: 350,
  damping: 28,
  mass: 0.8,
};

export const gentleFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

export const bentoCardHover = {
  rest: { scale: 1, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)" },
  hover: {
    scale: 1.015,
    boxShadow: "0 20px 30px -10px rgba(5, 150, 105, 0.15)",
    transition: bentoSpring,
  },
  tap: { scale: 0.985 },
};

export const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const itemStagger = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: bentoSpring,
  },
};

