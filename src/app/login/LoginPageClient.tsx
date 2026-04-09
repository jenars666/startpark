'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '../../lib/firebase';
import { ensureUserProfile, getUserProfile } from '../../lib/customerStore';
import {
  applyPendingAuthAction,
  clearPendingAuthAction,
  getResolvedPostAuthPath,
  readPendingAuthAction,
} from '../../lib/pendingAuthAction';
import '../auth.css';

type LoginPageClientProps = {
  redirectTo: string;
};

export default function LoginPageClient({ redirectTo }: LoginPageClientProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const finishSignedInUser = async (signedInUser: User, welcomeMessage: string) => {
    const pendingAction = readPendingAuthAction();
    let actionMessage: string | null = null;

    const profile = await ensureUserProfile(signedInUser).catch((profileError) => {
      console.error('Unable to ensure user profile during login:', profileError);
      return null;
    });

    const persistedProfile =
      profile ||
      (await getUserProfile(signedInUser.uid).catch((profileError) => {
        console.error('Unable to read user profile during login:', profileError);
        return null;
      }));

    try {
      actionMessage = await applyPendingAuthAction(signedInUser, pendingAction);
    } catch (actionError) {
      console.error('Unable to complete the saved shopping action:', actionError);
      toast.error('Signed in, but we could not finish your previous action automatically.');
    } finally {
      clearPendingAuthAction();
    }

    toast.success(welcomeMessage);
    if (actionMessage) toast.success(actionMessage);

    const resolvedRedirect = getResolvedPostAuthPath(pendingAction, redirectTo);

    // Keep admin users inside the requested admin route after login.
    if (persistedProfile?.role === 'admin') {
      // Set cookie immediately so middleware allows access
      document.cookie = 'user-role=admin; path=/; max-age=86400; SameSite=Strict';
      window.location.href = resolvedRedirect.startsWith('/admin') ? resolvedRedirect : '/admin';
      return;
    }

    if (resolvedRedirect.startsWith('/admin')) {
      toast.error('This account is not authorized for admin access.');
      router.push('/');
      return;
    }

    router.push(resolvedRedirect);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!auth) {
      setError('Authentication is not configured right now.');
      setLoading(false);
      return;
    }

    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);

      await finishSignedInUser(credentials.user, 'Welcome back to Star Mens Park.');
    } catch (issue: unknown) {
      console.error('Login failed:', issue);

      const code =
        typeof issue === 'object' && issue && 'code' in issue ? String(issue.code) : '';

      if (code === 'auth/user-not-found') {
        setError('No account was found for that email address.');
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('The email or password is incorrect.');
      } else if (code === 'auth/invalid-email') {
        setError('Enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again in a little while.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled in Firebase Console.');
      } else {
        setError('Unable to sign you in right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    if (!auth || !googleProvider) {
      setError('Google sign-in is not configured right now.');
      setGoogleLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);

      await finishSignedInUser(result.user, 'Welcome to Star Mens Park!');
    } catch (issue: unknown) {
      const code =
        typeof issue === 'object' && issue && 'code' in issue ? String(issue.code) : '';

      // User closed the popup — not an error, ignore silently
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }

      console.error('Google login error:', issue);

      const issueText =
        issue instanceof Error ? issue.message : typeof issue === 'string' ? issue : 'Unknown error';

      setError(
        `Google sign-in failed: ${code || issueText}. Try email login or check Firebase Console.`
      );
    } finally {
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
            Premium menswear and polished service from Dindigul.
          </p>
          <div className="auth-hero-stats">
            <div className="auth-stat">
              <div className="auth-stat-number">10K+</div>
              <div className="auth-stat-label">Customers</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">600+</div>
              <div className="auth-stat-label">Reviews</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">22-5XL</div>
              <div className="auth-stat-label">Size Range</div>
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
            <h2 className="auth-form-title">Sign In</h2>
            <p className="auth-form-subtitle">Access your cart, orders, and account details.</p>
          </div>

          {error ? <div className="auth-error">{error}</div> : null}

          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            suppressHydrationWarning
          >
            {googleLoading ? (
              <span className="auth-spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or use your email</span>
            <div className="auth-divider-line" />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  suppressHydrationWarning
                />
                <Mail size={16} className="auth-input-icon" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password"
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  suppressHydrationWarning
                />
                <Lock size={16} className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Toggle password visibility"
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              suppressHydrationWarning
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Need an account?
            <Link
              href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
              className="auth-footer-link"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
