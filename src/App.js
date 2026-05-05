import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
    const [code, setCode] = useState('');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        alert('Copied to clipboard!');
    };

    const clearAll = () => {
        setCode('');
        setExplanation('');
        setError('');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>AI Code Explainer</h1>

            <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Paste code here..."
                rows={12}
                style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontFamily: 'monospace'
                }}
            />

            <div style={{ marginTop: '12px' }}>
                <button
                    onClick={handleExplain}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '10px'
                    }}
                >
                    {loading ? 'Explaining...' : 'Explain Code'}
                </button>

                {explanation && (
                    <button
                        onClick={clearAll}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>

            {error && (
                <div style={{
                    color: '#721c24',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    padding: '12px',
                    borderRadius: '5px',
                    marginTop: '15px'
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {explanation && (
                <div style={{
                    marginTop: '20px',
                    textAlign: 'left',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>AI Explanation:</h3>
                        <button
                            onClick={copyToClipboard}
                            style={{
                                padding: '6px 12px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px'
                            }}
                        >
                            Copy
                        </button>
                    </div>
                    <hr style={{ margin: '15px 0' }} />
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default App;