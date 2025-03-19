import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn; 