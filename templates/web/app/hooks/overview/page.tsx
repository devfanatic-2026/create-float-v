'use client';

import React from 'react';
import { useFloatState, useFloatEffect, useFloatCallback, useFloatMemo } from '@float-v/core';

export default function HooksOverviewPage() {
    // 1. useFloatState with persistence and debugging
    const [count, setCount] = useFloatState(0, {
        persist: 'demo-counter',
        debug: true,
    });

    // 2. useFloatState with history
    const history = useFloatState(0, {
        history: true,
        maxHistory: 5,
    });

    // 3. useFloatCallback with performance tracking
    const handleExpensiveOperation = useFloatCallback(
        () => {
            // Simulate expensive operation
            let result = 0;
            for (let i = 0; i < 1000000; i++) {
                result += Math.sqrt(i);
            }
            return result;
        },
        [],
        { name: 'expensive-op', debug: true, metrics: true }
    );

    // 4. useFloatMemo with metrics
    const expensiveValue = useFloatMemo(
        () => {
            let sum = 0;
            for (let i = 0; i < count * 100000; i++) {
                sum += i;
            }
            return sum;
        },
        [count],
        { name: 'expensive-computation', debug: true, metrics: true }
    );

    // 5. useFloatEffect with named effect
    useFloatEffect(
        () => {
            console.log('Count changed to:', count);
            return () => console.log('Count effect cleanup');
        },
        [count],
        { name: 'count-logger', debug: true }
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-4xl font-bold text-gray-900">Float-V Hooks Overview</h1>
                <p className="text-gray-600 mt-2 text-lg">
                    Enhanced React primitives with debugging, persistence, and performance tracking
                </p>
            </div>

            {/* Introduction */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">🪝 Vibe-Coding Philosophy</h2>
                <p className="text-indigo-100 leading-relaxed">
                    Float-V hooks are **enhanced React primitives** designed for the agentic era. They maintain
                    100% compatibility with React hooks while adding powerful features like automatic persistence,
                    debugging, and performance metrics—perfect for building production-ready applications from
                    sandbox code.
                </p>
            </div>

            {/* 1. useFloatState Demo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 text-blue-600 font-mono text-sm px-3 py-1 rounded-md">
                        useFloatState
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Enhanced State Management</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Persistent Counter */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">💾</span>
                            Persistent Counter
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            This counter persists to localStorage. Try refreshing the page!
                        </p>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-600 mb-4">{count}</div>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setCount(count - 1)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    -1
                                </button>
                                <button
                                    onClick={() => setCount(0)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setCount(count + 1)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    +1
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded text-xs font-mono text-blue-800">
                            Check your console for debug logs!
                        </div>
                    </div>

                    {/* History Tracking */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-2xl">⏰</span>
                            History Tracking
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            This counter tracks history with undo/redo capabilities.
                        </p>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-purple-600 mb-4">{history.value}</div>
                            <div className="flex gap-2 justify-center mb-4">
                                <button
                                    onClick={() => history.setValue(history.value - 1)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    -1
                                </button>
                                <button
                                    onClick={() => history.reset()}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => history.setValue(history.value + 1)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    +1
                                </button>
                            </div>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => history.undo?.()}
                                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                                >
                                    ↶ Undo
                                </button>
                                <button
                                    onClick={() => history.redo?.()}
                                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                                >
                                    ↷ Redo
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                            History: {history.history?.length || 0} entries
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. useFloatCallback & useFloatMemo Demo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 text-green-600 font-mono text-sm px-3 py-1 rounded-md">
                        useFloatCallback + useFloatMemo
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Performance Tracking</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Callback Demo */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-bold text-gray-800 mb-4">🎯 Tracked Callback</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Click to run an expensive operation. Check console for performance metrics.
                        </p>
                        <button
                            onClick={handleExpensiveOperation}
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-700"
                        >
                            Run Expensive Operation
                        </button>
                    </div>

                    {/* Memo Demo */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-bold text-gray-800 mb-4">💡 Memoized Computation</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            This value is recalculated when count changes. Check console for metrics.
                        </p>
                        <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Computed Value</div>
                            <div className="text-2xl font-bold text-gray-900 break-all">
                                {expensiveValue.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Examples */}
            <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
                <h3 className="text-white font-bold text-lg mb-4">📝 Code Examples</h3>
                <pre className="text-green-400 text-sm leading-relaxed">
                    {`// 1. useFloatState with persistence
const [count, setCount] = useFloatState(0, {
  persist: 'my-counter',  // Auto-saves to localStorage
  debug: true             // Logs all changes
});

// 2. useFloatState with history
const history = useFloatState(0, {
  history: true,         // Track state history
  maxHistory: 10         // Keep last 10 states
});
history.undo();          // Go back
history.redo();          // Go forward

// 3. useFloatCallback with metrics
const handleClick = useFloatCallback(
  () => expensiveOp(),
  [],
  { name: 'click', debug: true, metrics: true }
);

// 4. useFloatMemo with tracking
const value = useFloatMemo(
  () => heavyComputation(data),
  [data],
  { name: 'computation', metrics: true }
);

// 5. useFloatEffect with conditions
useFloatEffect(
  () => fetchData(),
  [id],
  { name: 'fetch', condition: isLoggedIn }
);`}
                </pre>
            </div>

            {/* Feature Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">React vs Float-V Hooks</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Feature
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    React Hooks
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Float-V Hooks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Persistence
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">Manual implementation</td>
                                <td className="px-6 py-4 text-sm text-green-600 font-medium">✓ Built-in</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Debug Logging
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">Manual console.log</td>
                                <td className="px-6 py-4 text-sm text-green-600 font-medium">✓ Automatic</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    History/Undo
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">Complex custom logic</td>
                                <td className="px-6 py-4 text-sm text-green-600 font-medium">✓ One flag</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Performance Metrics
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">Requires Profiler</td>
                                <td className="px-6 py-4 text-sm text-green-600 font-medium">✓ Real-time tracking</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Named Effects
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">N/A</td>
                                <td className="px-6 py-4 text-sm text-green-600 font-medium">✓ Better debugging</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Conditional Effects
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">Manual if statements</td>
                                <td className="px-6 py-4 text-sm text-green-600 font-medium">✓ Built-in option</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
