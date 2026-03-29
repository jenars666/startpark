'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import '../auth.css'; // Path adjusted

// ⚠️ TEMPORARY DEV CREDENTIALS — remove before deployment
const DEV_CREDENTIALS = [
  { email: 'user@starmenspark.com',  password: 'user123',  role: 'user'  },
  { email: 'admin@starmenspark.com', password: 'admin123', role: 'admin' },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Manual email/password submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const match = DEV_CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    );

    if (match) {
      if (match.role === 'admin') {
        window.location.href = '/admin';
      } else {
        router.push('/'); // Redirect to root home instead of /home
      }
      return;
    }

    setLoading(false);
    setError('Invalid email or password. Please try again.');
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    if (!auth || !googleProvider) {
      setError('Google sign-in is not configured yet.');
      setGoogleLoading(false);
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/'); // Redirect to root after successful Firebase login
    } catch (err: any) {
      // Don't show error if user just closed the popup
      if (err.code === 'auth/popup-closed-by-user') {
        setGoogleLoading(false);
        return;
      }
      // Don't show if another popup was already opened and cancelled this one
      if (err.code === 'auth/cancelled-popup-request') {
        setGoogleLoading(false);
        return;
      }
      
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-pattern" />
        <div className="auth-hero-content">
          <h1 className="auth-hero-logo">
            Star
            <span>MENS PARK</span>
          </h1>
          <p className="auth-hero-tagline">
            Premium Menswear &amp; Group Shirts — Dindigul
          </p>
          <div className="auth-hero-stats">
            <div className="auth-stat">
              <div className="auth-stat-number">600+</div>
              <div className="auth-stat-label">Reviews</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">10K+</div>
              <div className="auth-stat-label">Happy Customers</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">22–5XL</div>
              <div className="auth-stat-label">All Sizes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-logo">
            Star
            <span>MENS PARK</span>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">
              Sign in to your Star Mens Park account.
            </p>
          </div>

          <div className="auth-dev-hint">
            <strong>🔐 Dev Credentials</strong>
            <div className="auth-dev-row">
              <span className="auth-dev-badge user">USER</span>
              <code>user@starmenspark.com</code> / <code>user123</code>
            </div>
            <div className="auth-dev-row">
              <span className="auth-dev-badge admin">ADMIN</span>
              <code>admin@starmenspark.com</code> / <code>admin123</code>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <span className="auth-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or sign in with email</span>
            <div className="auth-divider-line" />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email Address</label>
              <div className="auth-input-wrapper">
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} className="auth-input-icon" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password"
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={16} className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-options-row">
              <label className="auth-remember">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="auth-forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don&apos;t have an account?
            <Link href="/register" className="auth-footer-link">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
