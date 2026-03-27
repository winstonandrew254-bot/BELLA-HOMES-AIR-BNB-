import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[210] p-2 bg-white/10 rounded-full backdrop-blur-sm"
      >
        <X size={32} />
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Navigation Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[210] p-3 bg-white/10 rounded-full backdrop-blur-sm"
        >
          <ChevronLeft size={40} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[210] p-3 bg-white/10 rounded-full backdrop-blur-sm"
        >
          <ChevronRight size={40} />
        </button>

        {/* Image Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Counter */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/50 font-medium tracking-widest text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </motion.div>
  );
};
