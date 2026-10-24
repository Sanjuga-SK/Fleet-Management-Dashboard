import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Radio, Lock, Mail, AlertCircle, ArrowRight, PlayCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signInDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);
      const res = await signIn(email.trim(), password);
      if (res.error) {
        // If credentials invalid or user not found, present clear administrator provisioning notice
        const normalized = res.error.toLowerCase();
        if (
          normalized.includes('credential') ||
          normalized.includes('invalid') ||
          normalized.includes('user not found') ||
          normalized.includes('not confirmed')
        ) {
          setError(
            'Invalid credentials or account does not exist. Access requires an existing account provisioned by your fleet administrator.'
          );
        } else {
          setError(res.error);
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials or contact your administrator.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    try {
      await signInDemo();
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Subtle Green and Orange Ambient Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          {/* Brand Header */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center pb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-md mb-4 border border-green-600/20">
              <Radio className="w-7 h-7 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bytebeam Fleet Command
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Industrial IoT Telematics & Fleet Dispatch Portal
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-control bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Credentials Sign-In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Operator Email"
              type="email"
              required
              placeholder="operator@bytebeam.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Sign In to Continue
            </Button>
          </form>

          {/* Explicit Offline Simulator Demo Mode */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 mb-2.5">
              Need to test features without entering credentials?
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full"
              icon={<PlayCircle className="w-4 h-4 text-orange" />}
            >
              Launch Demo Mode (Offline Simulator)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
