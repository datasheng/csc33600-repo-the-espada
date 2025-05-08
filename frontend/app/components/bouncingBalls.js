import { motion } from 'framer-motion';

export default function BouncingBalls({delay = 0, color = "bg-blue-500"}) {
    return (
        <motion.div
            className  = {`w-10 h-10 rounded-full ${color}`}
            animate = {{
                y: ['0%', '100%', '0%'],
            }}

            transition={{
                duration: 1.0,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
                delay,
            }}
        />
    );
}