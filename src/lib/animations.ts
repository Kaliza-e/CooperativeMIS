// Centralized Framer Motion animation variants and configurations for TERIMBERE

export const transitionFast = { duration: 0.15, ease: 'easeOut' };
export const transitionNormal = { duration: 0.25, ease: [0.22, 1, 0.36, 1] };
export const transitionSmooth = { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

export const springModal = {
  type: 'spring' as const,
  damping: 26,
  stiffness: 320,
};

// Page transitions for React Router
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: 'easeIn' } },
};

// Staggered list / card container
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

// Individual item fade & rise
export const fadeUpItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

// Micro-interaction for buttons
export const buttonMotion = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { duration: 0.12 },
};

// Card hover lift
export const cardHoverMotion = {
  whileHover: { y: -3, transition: { duration: 0.2, ease: 'easeOut' } },
};

