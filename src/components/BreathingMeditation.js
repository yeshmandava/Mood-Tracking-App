import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Clock } from 'lucide-react';

const BreathingMeditation = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 seconds (5 full cycles)
  const [timeLeft, setTimeLeft] = useState(60);
  const [breathPhase, setBreathPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [showComplete, setShowComplete] = useState(false);
  const [showDurationSelect, setShowDurationSelect] = useState(false);
  const intervalRef = useRef(null);
  const breathCycleRef = useRef(null);

  const durations = [
    { label: '1 minute', value: 60 },     // 5 cycles (5 × 12s) 
    { label: '2 minutes', value: 120 },   // 10 cycles (10 × 12s)
    { label: '5 minutes', value: 300 },   // 25 cycles (25 × 12s)
    { label: '10 minutes', value: 600 }   // 50 cycles (50 × 12s)
  ];

  useEffect(() => {
    if (!isOpen) {
      resetMeditation();
    }
  }, [isOpen]);

  const resetMeditation = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setBreathPhase('inhale');
    setShowComplete(false);
    setShowDurationSelect(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathCycleRef.current) clearInterval(breathCycleRef.current);
  };

  const startMeditation = () => {
    setIsActive(true);
    setTimeLeft(duration);
    setShowComplete(false);
    setShowDurationSelect(false);
    
    // Timer countdown
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          setShowComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Breathing cycle (4 seconds inhale, 2 seconds hold, 6 seconds exhale)
    // Total cycle = 12 seconds. Start with inhale at the beginning.
    let totalElapsed = 0;
    
    breathCycleRef.current = setInterval(() => {
      totalElapsed += 0.1;
      const cyclePosition = totalElapsed % 12; // Position within current 12-second cycle
      
      if (cyclePosition < 4) {
        setBreathPhase('inhale');
      } else if (cyclePosition < 6) {
        setBreathPhase('hold');
      } else {
        setBreathPhase('exhale');
      }
    }, 100);
  };

  const stopMeditation = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathCycleRef.current) clearInterval(breathCycleRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingCircleStyle = () => {
    let scale = 1;
    let animationDuration = '4s';
    
    if (breathPhase === 'inhale') {
      scale = 1.5;
      animationDuration = '4s';
    } else if (breathPhase === 'hold') {
      scale = 1.5;
      animationDuration = '2s';
    } else if (breathPhase === 'exhale') {
      scale = 1;
      animationDuration = '6s';
    }

    return {
      transform: `scale(${scale})`,
      transition: `transform ${animationDuration} ease-in-out`
    };
  };

  const getInstructionText = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly...';
      default:
        return 'Breathe naturally...';
    }
  };

  const selectDuration = (newDuration) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setShowDurationSelect(false);
  };

  const restartWithNewDuration = () => {
    setShowComplete(false);
    setShowDurationSelect(true);
  };

  const restartSameDuration = () => {
    resetMeditation();
    setTimeout(() => startMeditation(), 100);
  };

  if (!isOpen) return null;

  return (
    <div className="meditation-overlay">
      <div className="meditation-modal">
        <div className="meditation-header">
          <h2>Pause & Breathe</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="meditation-content">
          {!isActive && !showComplete && !showDurationSelect && (
            <>
              <div className="meditation-intro">
                <p>Take a moment to center yourself with a guided breathing exercise.</p>
                <div className="duration-display">
                  <Clock size={16} />
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              <button className="start-meditation-button" onClick={startMeditation}>
                Start Breathing Exercise
              </button>
              <button className="change-duration-button" onClick={() => setShowDurationSelect(true)}>
                Change Duration
              </button>
            </>
          )}

          {showDurationSelect && (
            <div className="duration-selector">
              <h3>Select Duration</h3>
              <div className="duration-options">
                {durations.map((dur) => (
                  <button
                    key={dur.value}
                    className={`duration-option ${duration === dur.value ? 'selected' : ''}`}
                    onClick={() => selectDuration(dur.value)}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isActive && (
            <>
              <div className="breathing-circle-container">
                <div 
                  className="breathing-circle" 
                  style={getBreathingCircleStyle()}
                ></div>
                <div className="breathing-instructions">
                  {getInstructionText()}
                </div>
              </div>
              <div className="meditation-timer">
                {formatTime(timeLeft)}
              </div>
              <button className="stop-meditation-button" onClick={stopMeditation}>
                Stop
              </button>
            </>
          )}

          {showComplete && (
            <div className="meditation-complete">
              <div className="complete-icon">✨</div>
              <h3>Well done!</h3>
              <p>You've completed your breathing exercise. How would you like to continue?</p>
              <div className="completion-actions">
                <button className="action-button primary" onClick={restartSameDuration}>
                  <RotateCcw size={16} />
                  Repeat Session
                </button>
                <button className="action-button secondary" onClick={restartWithNewDuration}>
                  <Clock size={16} />
                  Change Duration
                </button>
                <button className="action-button tertiary" onClick={onClose}>
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingMeditation;

