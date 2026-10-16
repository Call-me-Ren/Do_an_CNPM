/**
 * QRScanner Component - Tương ứng Component Diagram (QR Scanner)
 * Xử lý USC03: Quét mã QR hiện vật (đa ngôn ngữ giao diện)
 */
import { ArtifactServiceInstance } from '../services/ArtifactService.js';
import { getI18n } from '../services/I18nService.js';

export class QRScannerModal {
  constructor(onSuccess, onError, getCurrentLang) {
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.stream = null;
    this.isOpen = false;
  }

  get t() {
    return getI18n(this.getCurrentLang());
  }

  render() {
    const t = this.t;
    let modalEl = document.getElementById('qr-scanner-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'qr-scanner-modal';
      modalEl.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 hidden';
      document.body.appendChild(modalEl);
    }

    modalEl.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in">
        <!-- Header -->
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            </span>
            <h3 class="font-bold text-lg">${t.scannerTitle}</h3>
          </div>
          <button id="close-qr-scanner" class="text-slate-400 hover:text-white p-1 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Camera Scanner Simulator / Live Video -->
        <div class="p-6 flex flex-col items-center">
          <div class="relative w-64 h-64 bg-slate-950 rounded-xl overflow-hidden border-2 border-dashed border-amber-500/60 flex items-center justify-center shadow-inner group">
            <video id="qr-video" class="w-full h-full object-cover hidden" playsinline></video>
            
            <div id="camera-placeholder" class="text-center p-4">
              <div class="w-16 h-16 mx-auto mb-3 text-amber-400/80 animate-pulse">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <p class="text-xs text-slate-400">${t.scannerHint}</p>
            </div>

            <!-- Scanning overlay line -->
            <div class="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-lg shadow-amber-500/50 animate-bounce"></div>
          </div>

          <div class="w-full mt-4 text-center">
            <p class="text-xs text-slate-400 mb-2">${t.quickTryHint}</p>
            <div class="flex flex-wrap justify-center gap-2">
              <button data-quick-code="ART_art_001" class="quick-qr-btn text-xs bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-full border border-slate-700 transition">
                ${t.quickArtifact1}
              </button>
              <button data-quick-code="ART_art_002" class="quick-qr-btn text-xs bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-full border border-slate-700 transition">
                ${t.quickArtifact2}
              </button>
              <button data-quick-code="ART_art_003" class="quick-qr-btn text-xs bg-slate-800 hover:bg-amber-600 px-3 py-1.5 rounded-full border border-slate-700 transition">
                ${t.quickArtifact3}
              </button>
            </div>
          </div>

          <!-- Nhập thủ công -->
          <div class="w-full mt-5 pt-4 border-t border-slate-800">
            <form id="manual-qr-form" class="flex gap-2">
              <input type="text" id="manual-qr-input" placeholder="${t.manualInputPlaceholder}" 
                class="flex-1 bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500">
              <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition">
                ${t.btnLookup}
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(modalEl);
  }

  bindEvents(modalEl) {
    modalEl.querySelector('#close-qr-scanner').onclick = () => this.close();
    
    // Quick click
    modalEl.querySelectorAll('.quick-qr-btn').forEach(btn => {
      btn.onclick = () => {
        const code = btn.getAttribute('data-quick-code');
        this.processCode(code);
      };
    });

    // Form submit
    modalEl.querySelector('#manual-qr-form').onsubmit = (e) => {
      e.preventDefault();
      const val = modalEl.querySelector('#manual-qr-input').value.trim();
      if (val) {
        this.processCode(val);
      }
    };
  }

  open() {
    this.render();
    const modalEl = document.getElementById('qr-scanner-modal');
    modalEl.classList.remove('hidden');
    this.isOpen = true;
    this.startCamera();
  }

  close() {
    const modalEl = document.getElementById('qr-scanner-modal');
    if (modalEl) modalEl.classList.add('hidden');
    this.stopCamera();
    this.isOpen = false;
  }

  async startCamera() {
    const video = document.getElementById('qr-video');
    const placeholder = document.getElementById('camera-placeholder');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (video) {
          video.srcObject = this.stream;
          video.classList.remove('hidden');
          placeholder.classList.add('hidden');
          video.play();
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async processCode(code) {
    try {
      const artifact = await ArtifactServiceInstance.resolveQRCode(code);
      this.close();
      if (this.onSuccess) this.onSuccess(artifact);
    } catch (err) {
      alert(err.message);
      if (this.onError) this.onError(err);
    }
  }
}
