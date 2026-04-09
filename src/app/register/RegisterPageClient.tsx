'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User as FirebaseUser } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '../../lib/firebase';
import { ensureUserProfile } from '../../lib/customerStore';
import {
  applyPendingAuthAction,
  clearPendingAuthAction,
  getResolvedPostAuthPath,
  readPendingAuthAction,
} from '../../lib/pendingAuthAction';
import '../auth.css';

type RegisterPageClientProps = {
  redirectTo: string;
};

export default function RegisterPageClient({ redirectTo }: RegisterPageClientProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const finishSignedInUser = async (signedInUser: FirebaseUser, welcomeMessage: string) => {
    const pendingAction = readPendingAuthAction();
    let actionMessage: string | null = null;

    try {
      actionMessage = await applyPendingAuthAction(signedInUser, pendingAction);
    } catch (actionError) {
      console.error('Unable to complete the saved shopping action:', actionError);
      toast.error('Account created, but we could not finish your previous action automatically.');
    } finally {
      clearPendingAuthAction();
    }

    toast.success(welcomeMessage);

    if (actionMessage) {
      toast.success(actionMessage);
    }

    router.push(getResolvedPostAuthPath(pendingAction, redirectTo));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Use at least 8 characters for your password.');
      setLoading(false);
      return;
    }

    if (!auth) {
      setError('Authentication is not configured right now.');
      setLoading(false);
      return;
    }

    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(credentials.user, {
        displayName: formData.fullName,
      });

      await ensureUserProfile(credentials.user, {
        fullName: formData.fullName,
        phone: formData.phone,
      });

      await finishSignedInUser(credentials.user, 'Your account is ready.');
    } catch (issue: unknown) {
      console.error('Registration failed:', issue);

      const code =
        typeof issue === 'object' && issue && 'code' in issue ? String(issue.code) : '';

      if (code === 'auth/email-already-in-use') {
        setError('An account already exists for that email address.');
      } else if (code === 'auth/weak-password') {
        setError('Choose a stronger password.');
      } else if (code === 'auth/invalid-email') {
        setError('Enter a valid email address.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-up is not enabled in Firebase Console.');
      } else {
        setError('Unable to create your account right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError('');

    if (!auth || !googleProvider) {
      setError('Google sign-up is not configured right now.');
      setGoogleLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      void ensureUserProfile(result.user);
      await finishSignedInUser(result.user, 'Your account is ready.');
    } catch (issue: unknown) {
      const code =
        typeof issue === 'object' && issue && 'code' in issue ? String(issue.code) : '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setGoogleLoading(false);
        return;
      }

      console.error('Google sign-up failed:', issue);
      setError('Google sign-up could not be completed.');
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
            Create your account to save your cart, place orders, and track every purchase.
          </p>
          <div className="auth-hero-stats">
            <div className="auth-stat">
              <div className="auth-stat-number">Rs. 399+</div>
              <div className="auth-stat-label">Starting Price</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">Premium</div>
              <div className="auth-stat-label">Store Experience</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-number">Secure</div>
              <div className="auth-stat-label">Firebase Login</div>
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
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">Start your Star Mens Park shopping profile.</p>
          </div>

          {error ? <div className="auth-error">{error}</div> : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="register-name">
                Full Name
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="register-name"
                  name="fullName"
                  className="auth-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <UserIcon size={16} className="auth-input-icon" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="register-email"
                  name="email"
                  className="auth-input"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail size={16} className="auth-input-icon" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-phone">
                Phone Number
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="register-phone"
                  name="phone"
                  className="auth-input"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Phone size={16} className="auth-input-icon" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="register-password"
                  name="password"
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <Lock size={16} className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="register-confirm-password">
                Confirm Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  className="auth-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <Lock size={16} className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or sign up with</span>
            <div className="auth-divider-line" />
          </div>

          <div className="auth-social-row">
            <button
              type="button"
              className="auth-social-btn"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
            >
              {googleLoading ? <span className="auth-spinner" /> : 'Google'}
            </button>
          </div>

          <p className="auth-footer-text">
            Already have an account?
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="auth-footer-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
