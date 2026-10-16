/**
 * AuthModal Component - Hiện thực USC01 (Đăng ký), USC02 (Đăng nhập), USC17 (Quên mật khẩu)
 * Đã hỗ trợ đa ngôn ngữ đầy đủ theo ngữ cảnh i18n
 */
import { ClientSession } from '../services/ClientSession.js';
import { getI18n } from '../services/I18nService.js';

export class AuthModal {
  constructor(onSuccess, getCurrentLang) {
    this.onSuccess = onSuccess;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.mode = 'login'; // 'login' | 'register' | 'forgot'
    this.init();
  }

  get t() {
    return getI18n(this.getCurrentLang());
  }

  init() {
    let el = document.getElementById('auth-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'auth-modal';
      el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 hidden';
      document.body.appendChild(el);
    }
  }

  open(mode = 'login') {
    this.mode = mode;
    this.render();
    const el = document.getElementById('auth-modal');
    el.classList.remove('hidden');
  }

  close() {
    const el = document.getElementById('auth-modal');
    if (el) el.classList.add('hidden');
  }

  render() {
    const t = this.t;
    const el = document.getElementById('auth-modal');
    el.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in">
        <!-- Header -->
        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </span>
            <h3 class="font-bold text-lg">
              ${this.mode === 'login' ? t.modalTitleLogin : this.mode === 'register' ? t.modalTitleRegister : t.modalTitleForgot}
            </h3>
          </div>
          <button id="close-auth-modal" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div id="auth-alert" class="mx-5 mt-4 p-3 rounded-lg text-xs hidden"></div>

        <div class="p-5">
          ${this.renderFormContent()}
        </div>

        <!-- Footer switch mode -->
        <div class="p-4 bg-slate-950/60 border-t border-slate-800 text-center text-xs text-slate-400">
          ${this.renderFooterLinks()}
        </div>
      </div>
    `;

    this.bindEvents(el);
  }

  renderFormContent() {
    const t = this.t;

    if (this.mode === 'login') {
      return `
        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelEmailOrPhone}</label>
            <input type="email" id="login-email" required placeholder="admin@museum.vn / visitor@museum.vn" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-semibold text-slate-300">${t.labelPassword}</label>
              <button type="button" id="switch-to-forgot" class="text-xs text-amber-400 hover:underline">${t.btnForgotPassword}</button>
            </div>
            <input type="password" id="login-password" required placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>

          <!-- Quick Fill Demo -->
          <div class="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs">
            <span class="text-slate-400 font-medium">${t.demoAccountBox}</span>
            <div class="mt-1 flex gap-2">
              <button type="button" id="fill-admin" class="bg-amber-500/20 text-amber-300 px-2 py-1 rounded hover:bg-amber-500/30">Admin (admin@museum.vn)</button>
              <button type="button" id="fill-user" class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded hover:bg-blue-500/30">User (visitor@museum.vn)</button>
            </div>
          </div>

          <button type="submit" id="login-submit-btn" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition">
            ${t.btnLoginSubmit}
          </button>
        </form>
      `;
    }

    if (this.mode === 'register') {
      return `
        <form id="register-form" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelFullName}</label>
            <input type="text" id="reg-name" required placeholder="Nguyễn Văn A" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input type="email" id="reg-email" required placeholder="email@example.com" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelDefaultLang}</label>
            <select id="reg-lang" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelMinPassword}</label>
            <input type="password" id="reg-password" required placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelConfirmPassword}</label>
            <input type="password" id="reg-confirm-pwd" required placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>

          <button type="submit" id="reg-submit-btn" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition mt-2">
            ${t.btnRegisterSubmit}
          </button>
        </form>
      `;
    }

    if (this.mode === 'forgot') {
      return `
        <form id="forgot-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelRegisteredEmail}</label>
            <input type="email" id="forgot-email" required placeholder="visitor@museum.vn" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <button type="button" id="send-otp-btn" class="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 py-2 rounded-lg text-xs font-bold transition">
            ${t.btnSendOtp}
          </button>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelOtpCode}</label>
            <input type="text" id="forgot-otp" placeholder="888888" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">${t.labelNewPassword}</label>
            <input type="password" id="forgot-new-pwd" placeholder="••••••••" 
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
          </div>
          <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition">
            ${t.btnUpdatePasswordSubmit}
          </button>
        </form>
      `;
    }
  }

  renderFooterLinks() {
    const t = this.t;
    if (this.mode === 'login') {
      return `${t.switchRegisterText} <button id="switch-to-register" class="text-amber-400 font-bold hover:underline">${t.switchRegisterAction}</button>`;
    }
    return `${t.switchLoginText} <button id="switch-to-login" class="text-amber-400 font-bold hover:underline">${t.switchLoginAction}</button>`;
  }

  showAlert(message, isError = true) {
    const alertEl = document.getElementById('auth-alert');
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.className = `mx-5 mt-4 p-3 rounded-lg text-xs font-medium ${isError ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`;
    alertEl.classList.remove('hidden');
  }

  bindEvents(el) {
    el.querySelector('#close-auth-modal').onclick = () => this.close();

    const switchReg = el.querySelector('#switch-to-register');
    if (switchReg) switchReg.onclick = () => this.open('register');

    const switchLog = el.querySelector('#switch-to-login');
    if (switchLog) switchLog.onclick = () => this.open('login');

    const switchForgot = el.querySelector('#switch-to-forgot');
    if (switchForgot) switchForgot.onclick = () => this.open('forgot');

    // Quick fill
    const fillAdmin = el.querySelector('#fill-admin');
    if (fillAdmin) {
      fillAdmin.onclick = () => {
        el.querySelector('#login-email').value = 'admin@museum.vn';
        el.querySelector('#login-password').value = 'admin123';
      };
    }
    const fillUser = el.querySelector('#fill-user');
    if (fillUser) {
      fillUser.onclick = () => {
        el.querySelector('#login-email').value = 'visitor@museum.vn';
        el.querySelector('#login-password').value = 'password123';
      };
    }

    // Submit Login
    const loginForm = el.querySelector('#login-form');
    if (loginForm) {
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = el.querySelector('#login-email').value.trim();
        const pwd = el.querySelector('#login-password').value;
        const btn = el.querySelector('#login-submit-btn');

        try {
          btn.disabled = true;
          btn.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> ...`;
          const session = await ClientSession.login(email, pwd);
          this.close();
          if (this.onSuccess) this.onSuccess(session);
        } catch (err) {
          this.showAlert(err.message, true);
        } finally {
          btn.disabled = false;
          btn.textContent = this.t.btnLoginSubmit;
        }
      };
    }

    // Submit Register
    const regForm = el.querySelector('#register-form');
    if (regForm) {
      regForm.onsubmit = async (e) => {
        e.preventDefault();
        const fullName = el.querySelector('#reg-name').value.trim();
        const email = el.querySelector('#reg-email').value.trim();
        const defaultLang = el.querySelector('#reg-lang').value;
        const pwd = el.querySelector('#reg-password').value;
        const confirmPwd = el.querySelector('#reg-confirm-pwd').value;

        if (pwd !== confirmPwd) {
          this.showAlert('Mật khẩu xác nhận không khớp.', true);
          return;
        }

        try {
          await ClientSession.register({ fullName, email, password: pwd, defaultLang });
          this.showAlert('Đăng ký thành công! / Registration successful!', false);
          setTimeout(() => this.open('login'), 1200);
        } catch (err) {
          this.showAlert(err.message, true);
        }
      };
    }

    // Submit Forgot Password
    const sendOtpBtn = el.querySelector('#send-otp-btn');
    if (sendOtpBtn) {
      sendOtpBtn.onclick = async () => {
        const email = el.querySelector('#forgot-email').value.trim();
        if (!email) {
          this.showAlert('Vui lòng nhập Email để nhận OTP.', true);
          return;
        }
        try {
          const res = await ClientSession.forgotPassword(email);
          this.showAlert(res.message, false);
        } catch (err) {
          this.showAlert(err.message, true);
        }
      };
    }

    const forgotForm = el.querySelector('#forgot-form');
    if (forgotForm) {
      forgotForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = el.querySelector('#forgot-email').value.trim();
        const otp = el.querySelector('#forgot-otp').value.trim();
        const newPwd = el.querySelector('#forgot-new-pwd').value;

        try {
          const res = await ClientSession.resetPassword(email, otp, newPwd);
          this.showAlert(res.message, false);
          setTimeout(() => this.open('login'), 1500);
        } catch (err) {
          this.showAlert(err.message, true);
        }
      };
    }
  }
}
