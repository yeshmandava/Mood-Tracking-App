import React, { useState, useEffect } from 'react';
import './App.css';
import MoodLogger from './components/MoodLogger';
import Journal from './components/Journal';
import Analytics from './components/Analytics';
import AudioManager from './components/AudioManager';
import { Moon, Sun, TrendingUp, BookOpen, Heart } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('mood');
  const [darkMode, setDarkMode] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMoodData = localStorage.getItem('moodData');
    const savedJournalEntries = localStorage.getItem('journalEntries');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedMoodData) {
      setMoodData(JSON.parse(savedMoodData));
    }
    if (savedJournalEntries) {
      setJournalEntries(JSON.parse(savedJournalEntries));
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [moodData]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addMoodEntry = (mood, notes) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood,
      notes
    };
    setMoodData(prev => [...prev, newEntry]);
  };

const addJournalEntry = (title, content, name) => {
  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    title,
    content,
    name
  };
  setJournalEntries(prev => [...prev, newEntry]);
};

const updateJournalEntry = (id, updatedFields) => {
  setJournalEntries(prev =>
    prev.map(entry => (entry.id === id ? { ...entry, ...updatedFields } : entry))
  );
};

const deleteJournalEntry = id => {
  setJournalEntries(prev => prev.filter(entry => entry.id !== id));
};

  const renderContent = () => {
    switch (activeTab) {
      case 'mood':
        return <MoodLogger onAddMood={addMoodEntry} />;
      case 'journal':
        return (
          <Journal
            entries={journalEntries}
            onAddEntry={addJournalEntry}
            onUpdateEntry={updateJournalEntry}
            onDeleteEntry={deleteJournalEntry}
          />
        );
      case 'analytics':
        return <Analytics moodData={moodData} />;
      default:
        return <MoodLogger onAddMood={addMoodEntry} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-emoji">🧠</div>
            <h1>MindFlow</h1>
          </div>
          
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'mood' ? 'active' : ''}`}
              onClick={() => setActiveTab('mood')}
            >
              <Heart size={18} />
              Mood
            </button>
            <button 
              className={`nav-tab ${activeTab === 'journal' ? 'active' : ''}`}
              onClick={() => setActiveTab('journal')}
            >
              <BookOpen size={18} />
              Journal
            </button>
            <button 
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={18} />
              Analytics
            </button>
          </nav>

          <div className="header-controls">
            <AudioManager />
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
