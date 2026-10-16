/**
 * ClientSession Component - Mô phỏng theo Component Diagram (Client Session)
 * Giao tiếp với I_Auth để xác thực người dùng, lưu trữ Token JWT và quản lý phiên.
 * Tương ứng USC01, USC02, USC16, USC17
 */
import { mockDB } from './MockDatabase.js';

class ClientSessionService {
  constructor() {
    this.STORAGE_KEY = 'museum_auth_session';
    this.LOGIN_ATTEMPTS_KEY = 'museum_login_attempts';
    this.currentUser = this.loadSession();
    this.listeners = [];
  }

  // Tải session đã lưu
  loadSession() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Đăng ký observer khi trạng thái auth thay đổi
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  // USC02: Đăng nhập hệ thống (hỗ trợ kiểm tra khóa 5 lần sai - E2)
  async login(email, password) {
    await this.delay(500); // Giả lập độ trễ mạng

    // Kiểm tra số lần nhập sai
    const attempts = parseInt(localStorage.getItem(this.LOGIN_ATTEMPTS_KEY) || '0', 10);
    if (attempts >= 5) {
      throw new Error('Tài khoản đã bị tạm khóa do nhập sai quá 5 lần. Vui lòng thử lại sau 15 phút hoặc chọn Quên mật khẩu.');
    }

    const user = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Tài khoản không tồn tại trên hệ thống (E1).');
    }

    if (user.password !== password) {
      localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, (attempts + 1).toString());
      const remaining = 5 - (attempts + 1);
      throw new Error(`Mật khẩu không chính xác. Bạn còn ${remaining} lần thử trước khi bị khóa (E2).`);
    }

    // Đăng nhập thành công -> Reset số lần thử và cấp session
    localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    const sessionData = {
      token: 'jwt_mock_token_' + Date.now(),
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role, // 'user' hoặc 'admin' (A1)
      defaultLang: user.defaultLang || 'vi',
      favorites: [...user.favorites]
    };

    this.currentUser = sessionData;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    this.notify();
    return sessionData;
  }

  // USC01: Đăng ký tài khoản
  async register({ fullName, email, password, defaultLang = 'vi' }) {
    await this.delay(600);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Định dạng email không hợp lệ (E1).');
    }

    if (password.length < 6) {
      throw new Error('Mật khẩu phải có tối thiểu 6 ký tự (E1).');
    }

    // Kiểm tra tài khoản đã tồn tại (E2)
    const exists = mockDB.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('Email này đã được đăng ký trước đó. Vui lòng đăng nhập hoặc dùng chức năng Quên mật khẩu (E2).');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName,
      email,
      password,
      role: 'user',
      defaultLang,
      favorites: []
    };

    mockDB.users.push(newUser);
    return { success: true, message: 'Đăng ký tài khoản thành công!' };
  }

  // USC16: Đăng xuất
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.notify();
    return true;
  }

  // USC17: Quên mật khẩu & Gửi mã OTP giả lập
  async forgotPassword(email) {
    await this.delay(500);
    const user = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Email chưa được đăng ký trong hệ thống (E1).');
    }
    // Tạo OTP mock
    const mockOtp = '888888';
    sessionStorage.setItem('otp_reset_pwd_' + email, mockOtp);
    return { success: true, message: `Mã OTP đã được gửi đến email ${email}. (Mã thử nghiệm: ${mockOtp})` };
  }

  // Đặt lại mật khẩu mới
  async resetPassword(email, otp, newPassword) {
    await this.delay(500);
    const savedOtp = sessionStorage.getItem('otp_reset_pwd_' + email);
    if (!savedOtp || savedOtp !== otp) {
      throw new Error('Mã xác nhận OTP không đúng hoặc đã hết hạn.');
    }
    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
    }
    const user = mockDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.password = newPassword;
      sessionStorage.removeItem('otp_reset_pwd_' + email);
      return { success: true, message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' };
    }
    throw new Error('Người dùng không tồn tại.');
  }

  // USC06: Lưu sự vật yêu thích
  toggleFavorite(artifactId) {
    if (!this.currentUser) {
      throw new Error('Vui lòng đăng nhập để lưu hiện vật vào danh sách yêu thích!');
    }
    const favs = this.currentUser.favorites || [];
    const index = favs.indexOf(artifactId);
    let isFav = false;

    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(artifactId);
      isFav = true;
    }

    this.currentUser.favorites = favs;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));

    // Cập nhật lại trong mockDB user
    const dbUser = mockDB.users.find(u => u.id === this.currentUser.id);
    if (dbUser) {
      dbUser.favorites = favs;
    }

    this.notify();
    return isFav;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  getUser() {
    return this.currentUser;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const ClientSession = new ClientSessionService();
