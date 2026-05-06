import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
    const [code, setCode] = useState('');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // ✅ CHANGE THIS TO YOUR RENDER JAVA URL
    const API_URL = 'https://ai-explainer-api.onrender.com/explain';

    const handleExplain = async () => {
        if (!code.trim()) {
            setError('Please paste some code first');
            return;
        }

        setLoading(true);
        setExplanation('');
        setError('');

        try {
            const res = await fetch('http://localhost:8080/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const text = await res.text();

            if (!res.ok) {
                // 2. Better error handling for Render sleep
                if (text.includes('Failed to fetch') || res.status === 502 || res.status === 503) {
                    throw new Error('Backend is waking up. Free tier takes ~50s. Wait 30s and click again.');
                }
                throw new Error(text);
            }

            setExplanation(text);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(explanation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setCode('');
        setExplanation('');
        setError('');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: 'clamp(20px, 5vw, 40px)' // 1. Mobile responsive
            }}>
                <h1 style={{
                    margin: '0 0 8px 0',
                    fontSize: 'clamp(24px, 5vw, 36px)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    AI Code Explainer
                </h1>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                    Paste any code and get a beginner-friendly explanation powered by Gemini
                </p>

                {/* 3. Code highlighting with Prism */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder="Paste your Java/Python/C++ code here..."
                        rows={12}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: '2px solid #e0e0e0',
                            fontFamily: 'Monaco, Consolas, monospace',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                            outline: 'none',
                            transition: 'border 0.3s'
                        }}
                        onFocus={e => e.target.style.border = '2px solid #667eea'}
                        onBlur={e => e.target.style.border = '2px solid #e0e0e0'}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleExplain}
                        disabled={loading}
                        style={{
                            padding: '14px 28px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            transition: 'transform 0.2s',
                            transform: loading ? 'scale(0.98)' : 'scale(1)'
                        }}
                    >
                        {loading ? (
                            <span>
                                {/* 1. Loading spinner */}
                                <span style={{
                                    display: 'inline-block',
                                    width: '14px',
                                    height: '14px',
                                    border: '2px solid #fff',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                    marginRight: '8px',
                                    verticalAlign: 'middle'
                                }}></span>
                                Explaining...
                            </span>
                        ) : '✨ Explain Code'}
                    </button>

                    {explanation && (
                        <button
                            onClick={clearAll}
                            style={{
                                padding: '14px 28px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backgroundColor: '#f0f0f0',
                                color: '#333',
                                border: 'none',
                                borderRadius: '10px'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* 2. Error handling with wake-up message */}
                {error && (
                    <div style={{
                        color: '#721c24',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        padding: '16px',
                        borderRadius: '10px',
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '24px' }}>⚠️</span>
                        <div>
                            <strong>Note:</strong> {error}
                        </div>
                    </div>
                )}

                {explanation && (
                    <div style={{
                        marginTop: '24px',
                        padding: '24px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        backgroundColor: '#fafafa'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>AI Explanation:</h3>
                            {/* 4. Copy button */}
                            <button
                                onClick={copyToClipboard}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: copied ? '#28a745' : '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {copied ? '✓ Copied!' : '📋 Copy'}
                            </button>
                        </div>
                        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                        <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                )}

                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default App;