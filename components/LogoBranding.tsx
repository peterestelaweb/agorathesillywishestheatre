import React from 'react';
import { motion } from 'framer-motion';

const LogoBranding: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="fixed bottom-6 left-6 z-50 pointer-events-none select-none"
        >
            <img
                src="/silly-wishes-logo.jpg"
                alt="The Silly Wishes Theatre"
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300 rounded-full shadow-2xl border-4 border-white/60"
            />
        </motion.div>
    );
};

export default LogoBranding;
