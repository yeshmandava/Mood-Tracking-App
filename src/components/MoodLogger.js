import React, { useState } from 'react';
import { Smile, Frown, Meh, Angry, Heart, Star, CheckCircle, Wind } from 'lucide-react';
import BreathingMeditation from './BreathingMeditation';
import IdleMinions from './IdleMinions';

const MoodLogger = ({ onAddMood }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);

  const moods = [
    { id: 1, emoji: '😢', label: 'Very Sad', value: 1, color: '#6B7280', icon: Frown },
    { id: 2, emoji: '😟', label: 'Sad', value: 2, color: '#9CA3AF', icon: Frown },
    { id: 3, emoji: '😐', label: 'Neutral', value: 3, color: '#D1D5DB', icon: Meh },
    { id: 4, emoji: '🙂', label: 'Happy', value: 4, color: '#93C5FD', icon: Smile },
    { id: 5, emoji: '😊', label: 'Very Happy', value: 5, color: '#60A5FA', icon: Heart },
    { id: 6, emoji: '🤩', label: 'Ecstatic', value: 6, color: '#3B82F6', icon: Star }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMood) {
      onAddMood(selectedMood, notes);
      setSelectedMood(null);
      setNotes('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="mood-logger">
      <div className="mood-logger-content">
        <div className="mood-header">
          <h2>How are you feeling today?</h2>
          <p>Select your current mood and add any notes you'd like</p>
        </div>

        <form onSubmit={handleSubmit} className="mood-form">
          <div className="mood-selector">
            <div className="mood-grid">
              {moods.map((mood) => {
                const IconComponent = mood.icon;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    className={`mood-option ${
                      selectedMood?.id === mood.id ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedMood(mood)}
                    style={{
                      '--mood-color': mood.color
                    }}
                  >
                    <div className="mood-emoji">{mood.emoji}</div>
                    <div className="mood-label">{mood.label}</div>
                    <IconComponent className="mood-icon" size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Show Pause & Breathe button for any mood other than ecstatic */}
          {selectedMood && selectedMood.value < 6 && (
            <div className="breathing-prompt">
              <p>Let's make this an ecstatic mood. Trust me and breathe :)</p>
              <button
                type="button"
                className="breathing-button"
                onClick={() => setShowBreathing(true)}
              >
                <Wind size={16} />
                Pause & Breathe
              </button>
            </div>
          )}

          <div className="notes-section">
            <label htmlFor="notes" className="notes-label">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind? Describe your day, thoughts, or anything you'd like to remember..."
              className="notes-input"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={!selectedMood}
            className="submit-button"
          >
            <Heart size={16} />
            Log Mood
          </button>
        </form>

        {showSuccess && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>Mood logged successfully!</span>
          </div>
        )}
      </div>

      <BreathingMeditation
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
      />
      <IdleMinions />
    </div>
  );
};

export default MoodLogger;

