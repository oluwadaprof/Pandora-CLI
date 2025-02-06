export const ANIMATION_CONFIG = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: {
    type: "spring",
    stiffness: 200,
    damping: 20,
  },
};

export const PANEL_ANIMATION_CONFIG = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { type: "spring", stiffness: 500, damping: 30 },
};

export const TAB_MAX_LENGTH = 20;
