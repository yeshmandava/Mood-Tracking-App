import React, { useState } from 'react';
import { PlusCircle, BookOpen, Calendar, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Journal = ({ entries, onAddEntry }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedEntry, setExpandedEntry] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddEntry(title, content);
      setTitle('');
      setContent('');
      setIsWriting(false);
    }
  };

  const toggleEntry = (entryId) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy • h:mm a');
    } catch {
      return 'Unknown date';
    }
  };

  const getPreview = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="journal">
      <div className="journal-content">
        <div className="journal-header">
          <h2>Your Journal</h2>
          <p>Reflect on your thoughts and experiences</p>
          
          {!isWriting && (
            <button 
              className="new-entry-button"
              onClick={() => setIsWriting(true)}
            >
              <PlusCircle size={20} />
              New Entry
            </button>
          )}
        </div>

        {isWriting && (
          <div className="journal-editor">
            <form onSubmit={handleSubmit} className="entry-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Entry Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="title-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  Your Thoughts
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? Write about your day, your feelings, your dreams, or anything that comes to heart..."
                  className="content-textarea"
                  rows={12}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsWriting(false);
                    setTitle('');
                    setContent('');
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="save-button"
                >
                  <Edit3 size={16} />
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="journal-entries">
          {entries.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} className="empty-icon" />
              <h3>No journal entries yet</h3>
              <p>Start writing to capture your thoughts and memories</p>
            </div>
          ) : (
            <div className="entries-list">
              {entries
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((entry) => (
                  <div key={entry.id} className="journal-entry">
                    <div className="entry-header" onClick={() => toggleEntry(entry.id)}>
                      <h3 className="entry-title">{entry.title}</h3>
                      <div className="entry-meta">
                        <Calendar size={14} />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </div>
                    
                    <div className="entry-content">
                      {expandedEntry === entry.id ? (
                        <div className="full-content">
                          {entry.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                          <button 
                            className="collapse-button"
                            onClick={() => setExpandedEntry(null)}
                          >
                            Show less
                          </button>
                        </div>
                      ) : (
                        <div className="preview-content">
                          <p>{getPreview(entry.content)}</p>
                          {entry.content.length > 150 && (
                            <button 
                              className="expand-button"
                              onClick={() => toggleEntry(entry.id)}
                            >
                              Read more
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;

