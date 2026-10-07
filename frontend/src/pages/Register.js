import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, UserPlus } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(username, email, password);
      addToast(`Account created! Welcome, ${username}!`, 'success');
      navigate('/');
    } catch (err) {
      const errMsg = err.response?.data?.username?.[0] || 'Registration failed. Try a different username.';
      addToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card} className="animate-fade-in">
        <div style={styles.cardHeader}>
          <div style={styles.iconCircle}>
            <Sparkles size={20} color="#4f46e5" />
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join ShopEasy to start shopping & track orders</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrap}>
              <User size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrap}>
              <Mail size={16} color="#94a3b8" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Create password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                minLength={6}
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
            {submitting ? 'Creating account...' : (
              <>
                <UserPlus size={16} /> Sign Up
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Sign In
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
  footer: {
    marginTop: 24,
    textAlign: 'center',
    paddingTop: 20,
    borderTop: '1px solid #f1f5f9',
  },
};
