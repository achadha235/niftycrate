import { motion } from 'framer-motion';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2, delay: 0.15 }}
      className="w-full h-full flex justify-center items-center"
    >
      <CircularProgress />
    </motion.div>
  );
}
