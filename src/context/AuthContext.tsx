import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types/fleet';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoSession: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string; message?: string }>;
  signInDemo: (customUser?: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = 'bytebeam_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(false);

  // Helper to load or synchronize profile from public.profiles
  const syncProfileFromDatabase = async (supabaseUser: any): Promise<UserProfile> => {
    const verifiedEmail = supabaseUser.email || '';
    const metadataName =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      splitEmail(verifiedEmail);

    const defaultProfile: UserProfile = {
      id: supabaseUser.id,
      email: verifiedEmail,
      full_name: metadataName,
      role: 'operations',
    };

    if (!isSupabaseConfigured || !supabase) {
      return defaultProfile;
    }

    try {
      // 1. Query existing profile from public.profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', supabaseUser.id)
        .single();

      if (!error && profile) {
        return {
          id: profile.id,
          email: profile.email || verifiedEmail,
          full_name: profile.full_name || metadataName,
          role: (profile.role as UserRole) || 'operations',
        };
      }

      // 2. If not found in table yet, upsert safe default profile
      const { data: upserted } = await supabase
        .from('profiles')
        .upsert(
          {
            id: supabaseUser.id,
            email: verifiedEmail,
            full_name: metadataName,
            role: 'operations',
          },
          { onConflict: 'id' }
        )
        .select('id, email, full_name, role')
        .single();

      if (upserted) {
        return {
          id: upserted.id,
          email: upserted.email || verifiedEmail,
          full_name: upserted.full_name || metadataName,
          role: (upserted.role as UserRole) || 'operations',
        };
      }
    } catch (e) {
      console.warn('Profile synchronization notice:', e);
    }

    return defaultProfile;
  };

  function splitEmail(email: string): string {
    if (!email) return 'Fleet Operator';
    const namePart = email.split('@')[0];
    return (
      namePart
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ') || 'Fleet Operator'
    );
  }

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        if (isSupabaseConfigured && supabase) {
          // Check for active Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await syncProfileFromDatabase(session.user);
            setUser(profile);
            setIsDemoSession(false);
          } else {
            setUser(null);
            setIsDemoSession(false);
          }

          // Subscribe to live auth state changes
          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const profile = await syncProfileFromDatabase(session.user);
              setUser(profile);
              setIsDemoSession(false);
            } else {
              setUser(null);
              setIsDemoSession(false);
            }
          });
        } else {
          // Check if user previously logged in via explicit demo login
          const savedDemoUser = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (savedDemoUser) {
            try {
              const parsed = JSON.parse(savedDemoUser);
              setUser(parsed);
              setIsDemoSession(true);
            } catch {
              localStorage.removeItem(DEMO_USER_STORAGE_KEY);
              setUser(null);
              setIsDemoSession(false);
            }
          } else {
            setUser(null);
            setIsDemoSession(false);
          }
        }
      } catch (err) {
        console.error('Session restoration error:', err);
        setUser(null);
        setIsDemoSession(false);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      if (!password) {
        return { error: 'Password is required' };
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        const profile = await syncProfileFromDatabase(data.user);
        setUser(profile);
        setIsDemoSession(false);
      }
      return {};
    }

    // When Supabase is not configured locally, authenticate gracefully in local demo mode
    await signInDemo({ email });
    return {};
  };

  // Sign up new user with full name, email, and password
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error?: string; message?: string }> => {
    if (!email.trim() || !password) {
      return { error: 'Email and password are required' };
    }
    if (!fullName.trim()) {
      return { error: 'Full name is required' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        if (data.session) {
          const profile = await syncProfileFromDatabase(data.user);
          setUser(profile);
          setIsDemoSession(false);
          return {};
        }
        return {
          message: 'Account created! Please check your email to confirm your account, then sign in.',
        };
      }
    }

    // Fallback when Supabase is unconfigured: create demo user with given credentials
    await signInDemo({
      email: email.trim(),
      full_name: fullName.trim(),
      role: 'operations',
    });
    return {};
  };

  // Explicit demo login flow: marks session as simulated demo data
  const signInDemo = async (customUser?: Partial<UserProfile>): Promise<void> => {
    const demoUser: UserProfile = {
      id: customUser?.id || 'demo-operator-001',
      email: customUser?.email || 'demo.operator@bytebeam.io',
      full_name: customUser?.full_name || 'Fleet Operations Lead',
      role: 'operations',
    };

    setUser(demoUser);
    setIsDemoSession(true);
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
  };

  // Sign out clears remote Supabase session and local demo persistence
  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut warning:', e);
      }
    }
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    setUser(null);
    setIsDemoSession(false);
  };

  const refreshProfile = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await syncProfileFromDatabase(session.user);
        setUser(profile);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoSession,
        signIn,
        signUp,
        signInDemo,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
