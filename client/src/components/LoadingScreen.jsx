import { motion } from 'framer-motion'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 mb-4 mx-auto"
        >
          <div className="w-full h-full rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
        </motion.div>
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl font-medium text-gray-700 dark:text-gray-300"
        >
          Đang tải...
        </motion.h2>
      </motion.div>
    </div>
  )
}

export default LoadingScreen 