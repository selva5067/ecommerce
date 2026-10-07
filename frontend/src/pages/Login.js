import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Lock, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password);
      addToast(`Welcome back, ${username}!`, 'success');
      navigate('/');
    } catch {
      addToast('Invalid username or password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    addToast('Demo credentials filled! Click Login to proceed.', 'info');
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card} className="animate-fade-in">
        <div style={styles.cardHeader}>
          <div style={styles.iconCircle}>
            <Sparkles size={20} color="#4f46e5" />
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account to manage cart & orders</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrap}>
              <User size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <Lock size={16} color="#94a3b8" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePassBtn}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={styles.submitBtn}
          >
            {submitting ? 'Logging in...' : (
              <>
                <LogIn size={16} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Login Button for Client Testing */}
        <div style={styles.demoBox}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>
            CLIENT DEMO TESTING
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            style={styles.demoBtn}
          >
            Fill Demo Admin Login
          </button>
        </div>

        <div style={styles.footer}>
          <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: 'calc(100vh - 140px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    border: '1px solid #e2e8f0',
    padding: '40px 36px',
    maxWidth: 420,
    width: '100%',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: '#eef2ff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {},
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
    marginBottom: 6,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    border: '1px solid #cbd5e1',
    borderRadius: 12,
    padding: '10px 14px',
    backgroundColor: '#f8fafc',
  },
  input: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
  },
  togglePassBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: 15,
    borderRadius: 12,
    marginTop: 8,
  },
  demoBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    border: '1px dashed #cbd5e1',
    textAlign: 'center',
  },
  demoBtn: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    paddingTop: 20,
    borderTop: '1px solid #f1f5f9',
  },
};
