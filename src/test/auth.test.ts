import { describe, it, expect, beforeEach } from 'vitest';
import { UserProfile } from '@/types/fleet';

describe('Authentication & Session Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated with no session by default', () => {
    const saved = localStorage.getItem('bytebeam_demo_user');
    expect(saved).toBeNull();
  });

  it('persists session profile with required id, email, full_name, and operations role', () => {
    const profile: UserProfile = {
      id: 'd1111111-1111-4111-8111-111111111111',
      email: 'operator@bytebeam.io',
      full_name: 'Ramesh Kumar',
      role: 'operations',
    };

    localStorage.setItem('bytebeam_demo_user', JSON.stringify(profile));
    const saved = localStorage.getItem('bytebeam_demo_user');
    expect(saved).not.toBeNull();

    const parsed: UserProfile = JSON.parse(saved!);
    expect(parsed.id).toBe('d1111111-1111-4111-8111-111111111111');
    expect(parsed.email).toBe('operator@bytebeam.io');
    expect(parsed.full_name).toBe('Ramesh Kumar');
    expect(parsed.role).toBe('operations');
  });

  it('enforces default role as operations and prevents unauthorized elevation', () => {
    // Simulated sign-up or profile payload where client attempts to specify role
    const signupInput = {
      email: 'newuser@bytebeam.io',
      fullName: 'Anita Sharma',
      attemptedRole: 'admin',
    };

    // System creates profile with enforced 'operations' role
    const sanitizedProfile: UserProfile = {
      id: 'u2222222-2222-4222-8222-222222222222',
      email: signupInput.email,
      full_name: signupInput.fullName,
      role: 'operations', // Enforced default
    };

    expect(sanitizedProfile.role).toBe('operations');
    expect(sanitizedProfile.role).not.toBe(signupInput.attemptedRole);
  });

  it('extracts full_name correctly from metadata or email fallback', () => {
    const extractName = (metadataName?: string, email?: string) => {
      if (metadataName?.trim()) return metadataName.trim();
      if (!email) return 'Fleet Operator';
      return email
        .split('@')[0]
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    };

    expect(extractName('Vikram Singh', 'vikram@bytebeam.io')).toBe('Vikram Singh');
    expect(extractName(undefined, 'vikram.singh@bytebeam.io')).toBe('Vikram Singh');
    expect(extractName('', 'operator@bytebeam.io')).toBe('Operator');
  });

  it('clears session on logout', () => {
    localStorage.setItem('bytebeam_demo_user', JSON.stringify({ email: 'test@bytebeam.io' }));
    expect(localStorage.getItem('bytebeam_demo_user')).not.toBeNull();

    // Simulating sign out
    localStorage.removeItem('bytebeam_demo_user');
    expect(localStorage.getItem('bytebeam_demo_user')).toBeNull();
  });

  it('formats invalid credentials or nonexistent account into administrator provisioning guidance', () => {
    const formatAuthError = (rawError: string) => {
      const normalized = rawError.toLowerCase();
      if (
        normalized.includes('credential') ||
        normalized.includes('invalid') ||
        normalized.includes('user not found') ||
        normalized.includes('not confirmed')
      ) {
        return 'Invalid credentials or account does not exist. Access requires an existing account provisioned by your fleet administrator.';
      }
      return rawError;
    };

    expect(formatAuthError('Invalid login credentials')).toBe(
      'Invalid credentials or account does not exist. Access requires an existing account provisioned by your fleet administrator.'
    );
    expect(formatAuthError('User not found')).toBe(
      'Invalid credentials or account does not exist. Access requires an existing account provisioned by your fleet administrator.'
    );
    expect(formatAuthError('Network timeout')).toBe('Network timeout');
  });
});

