import { motion } from "framer-motion";

export default function Dots() {
  const circleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="flex items-center justify-center space-x-0.5">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="h-1 w-1 rounded-full bg-primary"
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.9,
            delay: index * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>
      ))}
    </div>
  );
}
