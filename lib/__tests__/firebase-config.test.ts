import { describe, it, expect } from 'vitest';
import { firebaseConfig, validateFirebaseConfig } from '../firebase-config';

describe('Firebase Configuration', () => {
  it('should have all required Firebase config values', () => {
    expect(firebaseConfig.projectId).toBe('thechaknastore');
    expect(firebaseConfig.authDomain).toBe('thechaknastore.firebaseapp.com');
    expect(firebaseConfig.storageBucket).toBe('thechaknastore.firebasestorage.app');
    expect(firebaseConfig.webAppId).toBe('1:274624443566:web:9ee8fa8bd5c4f49de1293f');
    expect(firebaseConfig.androidAppId).toBe('1:274624443566:android:f069333c17eb0568e1293f');
    expect(firebaseConfig.iosAppId).toBe('1:274624443566:ios:14d5a7cb44f49aace1293f');
  });

  it('should validate Firebase configuration successfully', () => {
    const isValid = validateFirebaseConfig();
    expect(isValid).toBe(true);
  });

  it('should have valid project ID format', () => {
    expect(firebaseConfig.projectId).toMatch(/^[a-z0-9-]+$/);
  });

  it('should have valid auth domain format', () => {
    expect(firebaseConfig.authDomain).toMatch(/\.firebaseapp\.com$/);
  });

  it('should have valid storage bucket format', () => {
    expect(firebaseConfig.storageBucket).toMatch(/\.firebasestorage\.app$/);
  });

  it('should have valid app IDs', () => {
    expect(firebaseConfig.webAppId).toMatch(/^1:\d+:web:/);
    expect(firebaseConfig.androidAppId).toMatch(/^1:\d+:android:/);
    expect(firebaseConfig.iosAppId).toMatch(/^1:\d+:ios:/);
  });
});
