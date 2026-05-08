import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            color: '#f3f6ff',
            background: 'linear-gradient(160deg, #070914, #11182f)'
          }}
        >
          <div
            style={{
              width: 'min(720px, 100%)',
              padding: '28px',
              borderRadius: '24px',
              border: '1px solid rgba(114, 151, 255, 0.2)',
              background: 'rgba(17, 24, 47, 0.92)'
            }}
          >
            <p style={{ margin: '0 0 12px', color: '#65d7ff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              SortLab Fehleranzeige
            </p>
            <h1 style={{ margin: '0 0 12px', fontSize: '2rem' }}>Die React-App ist abgestürzt.</h1>
            <p style={{ margin: '0 0 16px', color: '#9bacd7', lineHeight: 1.7 }}>
              Das ist absichtlich sichtbar, damit wir keinen leeren Bildschirm mehr haben.
            </p>
            <pre
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'Consolas, monospace',
                color: '#f3f6ff'
              }}
            >
              {String(this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
