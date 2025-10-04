import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';

const StickyNotesBoard = () => {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Bienvenue ! 👋', x: 50, y: 50, color: 'yellow' },
    { id: 2, text: 'Double-cliquez pour éditer', x: 300, y: 100, color: 'pink' },
    { id: 3, text: 'Glissez-déposez pour déplacer', x: 150, y: 250, color: 'blue' }
  ]);
  const [draggedNote, setDraggedNote] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const colors = {
    yellow: 'bg-yellow-200 border-yellow-300',
    pink: 'bg-pink-200 border-pink-300',
    blue: 'bg-blue-200 border-blue-300',
    green: 'bg-green-200 border-green-300',
    purple: 'bg-purple-200 border-purple-300',
    orange: 'bg-orange-200 border-orange-300'
  };

  const colorOptions = Object.keys(colors);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: 'Nouveau post-it',
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleMouseDown = (e, note) => {
    if (editingId === note.id) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedNote(note);
  };

  const handleMouseMove = (e) => {
    if (!draggedNote) return;

    const boardRect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - boardRect.left - dragOffset.x;
    const newY = e.clientY - boardRect.top - dragOffset.y;

    setNotes(notes.map(note =>
      note.id === draggedNote.id
        ? { ...note, x: Math.max(0, Math.min(newX, boardRect.width - 200)), y: Math.max(0, Math.min(newY, boardRect.height - 200)) }
        : note
    ));
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    setNotes(notes.map(note =>
      note.id === editingId ? { ...note, text: editText } : note
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const changeColor = (id) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        const currentIndex = colorOptions.indexOf(note.color);
        const nextIndex = (currentIndex + 1) % colorOptions.length;
        return { ...note, color: colorOptions[nextIndex] };
      }
      return note;
    }));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📌 Tableau de Post-its</h1>
          <p className="text-sm text-gray-600">Double-clic pour éditer • Glisser-déposer pour déplacer</p>
        </div>
        <button
          onClick={addNote}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
        >
          <Plus size={20} />
          Nouveau post-it
        </button>
      </div>

      {/* Board */}
      <div
        className="relative w-full h-[calc(100vh-80px)] cursor-default"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {notes.map(note => (
          <div
            key={note.id}
            className={`absolute w-48 h-48 p-4 rounded-lg shadow-lg border-2 ${colors[note.color]} ${
              draggedNote?.id === note.id ? 'cursor-grabbing scale-105' : 'cursor-grab'
            } transition-shadow hover:shadow-xl`}
            style={{
              left: `${note.x}px`,
              top: `${note.y}px`,
              transform: draggedNote?.id === note.id ? 'rotate(2deg)' : 'rotate(0deg)'
            }}
            onMouseDown={(e) => handleMouseDown(e, note)}
            onDoubleClick={() => startEditing(note)}
          >
            {/* Note Header */}
            <div className="flex justify-between items-start mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  changeColor(note.id);
                }}
                className="w-4 h-4 rounded-full border-2 border-gray-400 hover:scale-110 transition-transform"
                title="Changer de couleur"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Note Content */}
            {editingId === note.id ? (
              <div className="flex flex-col gap-2 h-[calc(100%-2rem)]">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {note.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyNotesBoard;