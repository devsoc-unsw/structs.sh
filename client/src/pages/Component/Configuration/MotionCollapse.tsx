import { AnimatePresence, motion } from 'framer-motion';

interface MotionCollapseProps {
  children: React.ReactNode;
}

interface MotionCollapseProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export const MotionCollapse: React.FC<MotionCollapseProps> = ({
  children,
  isOpen,
}: MotionCollapseProps) => {
  const variants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        opacity: {
          delay: 0.3,
        },
      },
    },
    closed: { opacity: 0, height: 0 },
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
