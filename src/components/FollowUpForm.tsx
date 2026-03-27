import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, MessageCircle, CheckCircle } from 'lucide-react';

import { format } from 'date-fns';

interface FollowUpFormProps {
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  onClose: () => void;
}

export const FollowUpForm: React.FC<FollowUpFormProps> = ({ propertyTitle, checkIn, checkOut, onClose }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
  };

  const handleWhatsAppFeedback = () => {
    const message = `Hello Bella Homes,
I'm sharing my feedback for my stay at ${propertyTitle} (${format(new Date(checkIn), 'MMM dd')} - ${format(new Date(checkOut), 'MMM dd, yyyy')}).

Rating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
Feedback: ${feedback}`;

    window.open(`https://wa.me/254799590951?text=${encodeURIComponent(message)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-dark transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {!submitted ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                  <Star size={40} />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">How was your stay?</h2>
              <div className="bg-neutral-50 rounded-lg p-3 mb-6 text-center border border-neutral-100">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Your Stay at</p>
                <p className="text-sm font-bold text-dark">{propertyTitle}</p>
                <p className="text-[10px] text-neutral-500 mt-1">
                  {format(new Date(checkIn), 'MMM dd')} - {format(new Date(checkOut), 'MMM dd, yyyy')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 transition-all ${rating >= star ? 'text-gold scale-110' : 'text-neutral-200'}`}
                    >
                      <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you liked or how we can improve..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all h-32 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full bg-dark hover:bg-black text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppFeedback}
                    className="w-full bg-gold hover:bg-gold-dark text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                  >
                    <MessageCircle size={20} /> Send via WhatsApp
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-neutral-600 mb-8">
                Your feedback helps us provide a better experience for everyone. We hope to see you again soon!
              </p>
              <button
                onClick={onClose}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
