import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioManager = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Create a zen ambient sound using Web Audio API
  const createZenAmbientSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create a low-frequency oscillator for a deep, calming drone
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      
      // Create gain nodes for volume control
      const gainNode = audioContext.createGain();
      const masterGain = audioContext.createGain();
      gainNodeRef.current = masterGain;

      // Set up frequencies for a zen-like ambient sound
      oscillator1.frequency.setValueAtTime(60, audioContext.currentTime); // Deep base
      oscillator2.frequency.setValueAtTime(120, audioContext.currentTime); // Harmonic
      oscillator3.frequency.setValueAtTime(180, audioContext.currentTime); // Higher harmonic
      
      // Use sine waves for smooth, calming tones
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      oscillator3.type = 'triangle'; // Slightly different timbre
      
      // Set up gain values for a subtle ambient effect
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.1, audioContext.currentTime);
      
      // Connect the audio graph
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      oscillator3.connect(gainNode);
      gainNode.connect(masterGain);
      masterGain.connect(audioContext.destination);
      
      // Add subtle modulation for a more organic feel
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
      lfo.type = 'sine';
      lfoGain.gain.setValueAtTime(2, audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator1.frequency);
      
      // Start the oscillators
      oscillator1.start();
      oscillator2.start();
      oscillator3.start();
      lfo.start();
      
      oscillatorRef.current = [oscillator1, oscillator2, oscillator3, lfo];
      setIsLoaded(true);
      
    } catch (error) {
      console.log('Audio not supported or blocked:', error);
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    // Start audio after user interaction to comply with browser policies
    const startAudio = () => {
      if (!isLoaded) {
        createZenAmbientSound();
      }
    };

    // Try to start immediately, but fallback to user interaction
    const timer = setTimeout(() => {
      startAudio();
    }, 1000);

    // Also listen for any user interaction
    const handleInteraction = () => {
      startAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [isLoaded]);

  useEffect(() => {
    // Update volume when mute state changes
    if (gainNodeRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.setTargetAtTime(
        isMuted ? 0 : 0.1, 
        currentTime, 
        0.1
      );
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Oscillator might already be stopped
          }
        });
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <button 
      className="audio-toggle"
      onClick={toggleMute}
      title={isMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};

export default AudioManager;

