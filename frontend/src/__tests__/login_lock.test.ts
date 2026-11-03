// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerFailedAttempt,
  getLockRemainingMs,
  getAttemptsLeft,
  resetLoginLock,
  MAX_LOGIN_ATTEMPTS,
  LOCK_DURATION_MS,
  LOGIN_LOCK_KEY,
} from '../shared/utils/loginLock';

describe('Admin Login Lockout Logic (USC01 - E1)', () => {
  beforeEach(() => {
    localStorage.removeItem(LOGIN_LOCK_KEY);
  });

  it('starts with max attempts left and no lock', () => {
    expect(getAttemptsLeft()).toBe(MAX_LOGIN_ATTEMPTS);
    expect(getLockRemainingMs()).toBe(0);
  });

  it('decrements attempts left on failed attempts', () => {
    registerFailedAttempt();
    expect(getAttemptsLeft()).toBe(4);
    registerFailedAttempt();
    expect(getAttemptsLeft()).toBe(3);
  });

  it('locks after 5 failed attempts for 5 minutes', () => {
    const baseTime = 1000000;
    for (let i = 0; i < 4; i++) {
      const locked = registerFailedAttempt(baseTime);
      expect(locked).toBe(false);
    }
    const lockedOn5th = registerFailedAttempt(baseTime);
    expect(lockedOn5th).toBe(true);
    expect(getLockRemainingMs(baseTime)).toBe(LOCK_DURATION_MS);
    expect(getLockRemainingMs(baseTime + LOCK_DURATION_MS - 1000)).toBe(1000);
    expect(getLockRemainingMs(baseTime + LOCK_DURATION_MS + 1000)).toBe(0);
  });

  it('resets lock state on resetLoginLock', () => {
    registerFailedAttempt();
    registerFailedAttempt();
    resetLoginLock();
    expect(getAttemptsLeft()).toBe(MAX_LOGIN_ATTEMPTS);
    expect(getLockRemainingMs()).toBe(0);
  });
});
