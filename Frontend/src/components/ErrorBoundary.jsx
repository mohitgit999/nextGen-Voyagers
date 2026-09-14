import React from 'react';

/**
 * ErrorBoundary — catches any unhandled render/commit error in the React tree
 * and renders a friendly recovery UI instead of a blank white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[NextGen Voyagers] React error caught by ErrorBoundary:', error, info);
  }

  handleReload() {
    window.location.reload();
  }

  handleHome() {
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0d12 0%, #111827 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          padding: '24px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '48px',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🗺️</div>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '12px'
            }}>
              Something went wrong
            </h1>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              The app hit an unexpected error. Your trip data is safe — reload the page to continue planning.
            </p>
            {this.state.error && (
              <details style={{ marginBottom: '24px', textAlign: 'left' }}>
                <summary style={{ color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '8px' }}>
                  Error details
                </summary>
                <pre style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.75rem',
                  color: '#f87171',
                  overflow: 'auto',
                  maxHeight: '120px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #1bb89a, #0ea5e9)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                🔄 Reload Page
              </button>
              <button
                onClick={this.handleHome}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
