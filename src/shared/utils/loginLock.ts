/**
 * Khóa đăng nhập tạm thời (USC01 - E1): sai quá 5 lần thì khóa 5 phút.
 * Trạng thái lưu trong localStorage để tải lại trang không bypass được khóa.
 */
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 5 * 60 * 1000;
export const LOGIN_LOCK_KEY = 'admin_login_lock_v1';

interface LockState {
  failedCount: number;
  lockUntil: number;
}

function readState(): LockState {
  try {
    const raw = localStorage.getItem(LOGIN_LOCK_KEY);
    if (!raw) return { failedCount: 0, lockUntil: 0 };
    const parsed = JSON.parse(raw);
    return {
      failedCount: Number(parsed.failedCount) || 0,
      lockUntil: Number(parsed.lockUntil) || 0,
    };
  } catch {
    return { failedCount: 0, lockUntil: 0 };
  }
}

function writeState(state: LockState): void {
  try {
    localStorage.setItem(LOGIN_LOCK_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/** Số mili-giây còn lại của khóa (0 nếu không bị khóa). */
export function getLockRemainingMs(now: number = Date.now()): number {
  const { lockUntil } = readState();
  return lockUntil > now ? lockUntil - now : 0;
}

/** Số lần thử còn lại trước khi bị khóa. */
export function getAttemptsLeft(): number {
  return Math.max(0, MAX_LOGIN_ATTEMPTS - readState().failedCount);
}

/** Ghi nhận một lần đăng nhập sai. Trả về true nếu lần sai này kích hoạt khóa. */
export function registerFailedAttempt(now: number = Date.now()): boolean {
  const state = readState();
  // Khóa cũ đã hết hạn thì đếm lại từ đầu
  const failedCount = state.lockUntil && state.lockUntil <= now ? 1 : state.failedCount + 1;
  if (failedCount >= MAX_LOGIN_ATTEMPTS) {
    writeState({ failedCount: 0, lockUntil: now + LOCK_DURATION_MS });
    return true;
  }
  writeState({ failedCount, lockUntil: 0 });
  return false;
}

/** Xóa trạng thái khóa (khi đăng nhập thành công). */
export function resetLoginLock(): void {
  try {
    localStorage.removeItem(LOGIN_LOCK_KEY);
  } catch {
    // ignore
  }
}
