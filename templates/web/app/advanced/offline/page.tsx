'use client';

import React, { useState, useEffect } from 'react';
import { createFloatStore } from '@float-v/core';
import { useConnectionStore, connectionActions } from '@float-v/showcase-mobile';

// Persistent store for offline data
const useNotesStore = createFloatStore(
    {
        notes: [] as Array<{ id: string; content: string; timestamp: number; synced: boolean }>,
    },
    {
        persist: 'float-v-notes',
    }
);

export default function OfflinePage() {
    const { isOnline, socketStatus } = useConnectionStore();
    const notes = useNotesStore(state => state.notes);
    const [newNote, setNewNote] = useState('');

    // Simulate connection toggling for demo purposes
    const toggleConnection = () => {
        const newStatus = isOnline ? 'disconnected' : 'connected';
        connectionActions.setSocketStatus(newStatus);
    };

    const addNote = () => {
        if (!newNote.trim()) return;

        const note = {
            id: Date.now().toString(),
            content: newNote.trim(),
            timestamp: Date.now(),
            synced: isOnline,
        };

        useNotesStore.setState({ notes: [note, ...notes] });
        setNewNote('');
    };

    // Auto-sync simulation when coming back online
    useEffect(() => {
        if (isOnline) {
            const hasUnsynced = notes.some(n => !n.synced);
            if (hasUnsynced) {
                // Simulate sync delay
                connectionActions.setSyncing(true);
                setTimeout(() => {
                    useNotesStore.setState({
                        notes: notes.map(n => ({ ...n, synced: true }))
                    });
                    connectionActions.setSyncing(false);
                }, 2000);
            }
        }
    }, [isOnline]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Resilience & Offline-First</h1>
                    <p className="text-gray-600">Demonstrating Float-V persistence and sync logic</p>
                </div>
                <button
                    onClick={toggleConnection}
                    className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${isOnline
                            ? 'border-green-500 text-green-600 bg-green-50'
                            : 'border-red-500 text-red-600 bg-red-50'
                        }`}
                >
                    {isOnline ? '🟢 Online Mode' : '🔴 Offline Mode'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Control Panel */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4 text-gray-800 text-lg">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Connectivity</span>
                                <span className={isOnline ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                    {isOnline ? 'Active' : 'Disconnected'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Socket</span>
                                <span className="capitalize font-mono text-sm px-2 py-0.5 bg-gray-100 rounded">
                                    {socketStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 italic font-medium">Float-V Resilience Protocol Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
                        <h3 className="font-bold mb-2">Vibe Logic</h3>
                        <p className="text-xs text-indigo-100 leading-relaxed mb-4">
                            This application automatically handles disconnections. Changes are saved locally and synced when connection is restored.
                        </p>
                        <div className="text-2xl font-black opacity-30 select-none">FLOAT-V</div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex gap-2">
                            <input
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && addNote()}
                                placeholder="Write something..."
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-400"
                            />
                            <button
                                onClick={addNote}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {notes.map(note => (
                            <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                                <div className="space-y-1">
                                    <p className="text-gray-800 font-medium">{note.content}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(note.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {note.synced ? (
                                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">Synced</span>
                                    ) : (
                                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded animate-pulse">Local Only</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {notes.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-lg">No notes yet.</p>
                                <p className="text-sm">Try adding one even while offline!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
