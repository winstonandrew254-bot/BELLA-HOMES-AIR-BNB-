import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Play, AlertCircle, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeVideoProps {
  onVideoReady?: (url: string) => void;
}

export const WelcomeVideo: React.FC<WelcomeVideoProps> = ({ onVideoReady }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio?.hasSelectedApiKey) {
        const selected = await win.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio?.openSelectKey) {
      await win.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A cinematic, welcoming drone shot of a modern luxury apartment building in a serene, green environment in Elburgon, Kenya. The sun is setting, casting a warm golden glow. The interior shows a cozy, high-end studio with modern furniture and a welcoming atmosphere. High quality, 4k, smooth camera movement.',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        if (onVideoReady) onVideoReady(url);
      }
    } catch (err: any) {
      console.error('Error generating video:', err);
      if (err.message?.includes('not found')) {
        setHasKey(false);
        setError('API Key not found or invalid. Please select a valid key.');
      } else {
        setError('Failed to generate video. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-neutral-100 rounded-2xl border-2 border-dashed border-neutral-300">
        <Key className="text-gold mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">API Key Required</h3>
        <p className="text-neutral-600 text-center mb-6 max-w-md">
          To generate a personalized welcoming video, you need to select a paid Gemini API key.
        </p>
        <button 
          onClick={handleSelectKey}
          className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          Select API Key
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 text-xs text-neutral-400 hover:underline"
        >
          Learn more about billing
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl group">
      <AnimatePresence mode="wait">
        {videoUrl ? (
          <motion.video
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white p-8"
          >
            {isGenerating ? (
              <div className="text-center">
                <Loader2 className="animate-spin text-gold mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-2">Creating Your Welcome Video...</h3>
                <p className="text-white/60">This may take a minute or two. We're crafting something special for Bella Homes.</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Play size={40} fill="currentColor" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Welcome to Bella Homes</h3>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  Experience the luxury of Elburgon through a cinematic preview of our premium apartments.
                </p>
                <button 
                  onClick={generateVideo}
                  className="bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-gold/20"
                >
                  Generate Welcome Video
                </button>
              </div>
            )}
            {error && (
              <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                <AlertCircle size={18} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
