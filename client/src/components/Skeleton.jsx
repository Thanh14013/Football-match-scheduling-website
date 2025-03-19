import { motion } from 'framer-motion';

const Skeleton = ({ className = '', width = '100%', height = '20px' }) => {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default Skeleton; 