import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="flex justify-center h-full">
      <motion.div
        className="w-[50%] h-[50%] glass self-center"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 className="text-white text-lg">
          Find a user to start a conversation
        </h1>
      </motion.div>
    </div>
  );
}
