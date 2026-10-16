/**
 * AdminDashboard - Màn hình Quản trị viên (Admin)
 * Hỗ trợ USC07, USC08, USC09, USC10, USC11 và đa ngôn ngữ I18n
 */
import { mockDB } from '../services/MockDatabase.js';
import { ArtifactServiceInstance } from '../services/ArtifactService.js';
import { getI18n } from '../services/I18nService.js';

export class AdminDashboard {
  constructor(onRefresh, getCurrentLang) {
    this.onRefresh = onRefresh;
    this.getCurrentLang = getCurrentLang || (() => 'vi');
    this.currentTab = 'artifacts'; // 'artifacts' | 'analytics'
  }

  get t() {
    return getI18n(this.getCurrentLang());
  }

  render(container) {
    const t = this.t;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Admin Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div class="flex items-center space-x-3">
              <span class="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </span>
              <div>
                <h1 class="text-2xl font-bold text-white">${t.adminTitle}</h1>
                <p class="text-xs text-slate-400">${t.adminSubtitle}</p>
              </div>
            </div>
          </div>

          <!-- Tab buttons -->
          <div class="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button id="tab-btn-artifacts" class="px-4 py-2 text-xs font-semibold rounded-lg transition ${this.currentTab === 'artifacts' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
              ${t.tabArtifacts}
            </button>
            <button id="tab-btn-analytics" class="px-4 py-2 text-xs font-semibold rounded-lg transition ${this.currentTab === 'analytics' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
              ${t.tabAnalytics}
            </button>
          </div>
        </div>

        <div id="admin-tab-content" class="mt-6">
          ${this.currentTab === 'artifacts' ? this.renderArtifactsTab() : this.renderAnalyticsTab()}
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  renderArtifactsTab() {
    const t = this.t;
    const currentLang = this.getCurrentLang();

    return `
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-white">${t.adminArtifactListTitle(mockDB.artifacts.length)}</h2>
          <button id="admin-add-artifact-btn" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>${t.btnAddArtifact}</span>
          </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3">${t.colCodeAndImg}</th>
                  <th class="px-4 py-3">${t.colArtifactName}</th>
                  <th class="px-4 py-3">${t.colZoneEra}</th>
                  <th class="px-4 py-3 text-center">${t.colListens}</th>
                  <th class="px-4 py-3 text-center">${t.colQRCode}</th>
                  <th class="px-4 py-3 text-right">${t.colActions}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-xs">
                ${mockDB.artifacts.map(art => {
                  const nameInLang = art.name[currentLang] || art.name.vi;
                  return `
                    <tr class="hover:bg-slate-800/50 transition">
                      <td class="px-4 py-3 flex items-center space-x-3">
                        <img src="${art.image}" class="w-10 h-10 rounded-lg object-cover border border-slate-700" alt="">
                        <div>
                          <span class="font-mono text-[11px] text-amber-400 font-bold">${art.code}</span>
                          <p class="text-[10px] text-slate-500">${art.id}</p>
                        </div>
                      </td>
                      <td class="px-4 py-3 font-semibold text-white">
                        ${nameInLang}
                        <p class="text-[11px] font-normal text-slate-400">${art.name.en || ''}</p>
                      </td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">${art.zone}</span>
                        <p class="text-[11px] text-slate-400 mt-1">${art.era}</p>
                      </td>
                      <td class="px-4 py-3 text-center font-mono font-bold text-amber-400">
                        🎧 ${art.listenCount.toLocaleString()}
                      </td>
                      <td class="px-4 py-3 text-center">
                        <a href="${art.qrCodeUrl}" target="_blank" class="inline-block p-1 bg-white rounded border hover:scale-110 transition" title="QR">
                          <img src="${art.qrCodeUrl}" class="w-7 h-7" alt="QR">
                        </a>
                      </td>
                      <td class="px-4 py-3 text-right space-x-1">
                        <button data-delete-id="${art.id}" class="delete-art-btn text-xs px-2.5 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition border border-red-500/20">
                          ${t.btnDelete}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderAnalyticsTab() {
    const t = this.t;
    const { analytics } = mockDB;

    return `
      <div class="space-y-6">
        <!-- Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <span class="text-xs text-slate-400 uppercase font-semibold">${t.statTotalListeners}</span>
            <div class="text-3xl font-extrabold text-amber-400 mt-2 font-mono">${analytics.totalListeners.toLocaleString()}</div>
            <p class="text-xs text-emerald-400 mt-1">${t.statGrowth}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <span class="text-xs text-slate-400 uppercase font-semibold">${t.statStreamingTime}</span>
            <div class="text-3xl font-extrabold text-cyan-400 mt-2 font-mono">${(analytics.totalMinutesStreamed / 60).toFixed(0)} ${t.statHours}</div>
            <p class="text-xs text-slate-400 mt-1">AudioStreamer / I_Audio</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <span class="text-xs text-slate-400 uppercase font-semibold">${t.statActiveArtifacts}</span>
            <div class="text-3xl font-extrabold text-white mt-2 font-mono">${mockDB.artifacts.length}</div>
            <p class="text-xs text-amber-400 mt-1">${t.statActiveNote}</p>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top Artifacts Bar Chart -->
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 class="text-sm font-bold text-white mb-4">${t.topArtifactsTitle}</h3>
            <div class="space-y-4">
              ${analytics.topArtifacts.map(item => `
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-300 font-medium">${item.name}</span>
                    <span class="text-amber-400 font-bold font-mono">${item.listens} (${item.percent}%)</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-2">
                    <div class="bg-amber-500 h-2 rounded-full" style="width: ${item.percent}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Weekly Trend -->
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <h3 class="text-sm font-bold text-white mb-4">${t.weeklyTrendTitle}</h3>
            <div class="flex items-end justify-between h-44 pt-6 px-2">
              ${analytics.dailyTrends.map(d => {
                const heightPercent = (d.listens / 3500) * 100;
                const dayLabel = t.days[d.day] || d.day;
                return `
                  <div class="flex flex-col items-center flex-1">
                    <div class="w-7 bg-amber-500/80 hover:bg-amber-400 rounded-t-md transition relative group" style="height: ${heightPercent}%">
                      <span class="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none font-mono">
                        ${d.listens}
                      </span>
                    </div>
                    <span class="text-[11px] text-slate-400 mt-2 font-semibold">${dayLabel}</span>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="text-right mt-4">
              <button id="admin-export-btn" class="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700 transition">
                ${t.btnExportReport}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    const tabArt = container.querySelector('#tab-btn-artifacts');
    const tabAna = container.querySelector('#tab-btn-analytics');

    if (tabArt) {
      tabArt.onclick = () => {
        this.currentTab = 'artifacts';
        this.render(container);
      };
    }

    if (tabAna) {
      tabAna.onclick = () => {
        this.currentTab = 'analytics';
        this.render(container);
      };
    }

    const exportBtn = container.querySelector('#admin-export-btn');
    if (exportBtn) {
      exportBtn.onclick = () => alert(this.t.exportReportSuccess);
    }

    // Delete artifact
    container.querySelectorAll('.delete-art-btn').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute('data-delete-id');
        if (confirm(this.t.confirmDelete(id))) {
          await ArtifactServiceInstance.deleteArtifact(id);
          this.render(container);
          if (this.onRefresh) this.onRefresh();
        }
      };
    });

    // Add artifact
    const addBtn = container.querySelector('#admin-add-artifact-btn');
    if (addBtn) {
      addBtn.onclick = () => {
        const titleVi = prompt('Tên Hiện Vật / Artifact Name:', 'Nồi Gốm Hoa Nâu');
        if (!titleVi) return;
        const era = prompt('Niên đại / Era:', 'Thế kỷ XIII - XIV');
        const zone = prompt('Khu vực trưng bày / Gallery Zone:', 'Khu B');

        ArtifactServiceInstance.createArtifact({
          name: { vi: titleVi, en: titleVi, fr: titleVi, ja: titleVi, zh: titleVi },
          era: era || 'Thời kỳ Cổ Trung đại',
          zone: zone || 'Khu A',
          description: { vi: `Hiện vật di sản quý giá: ${titleVi}` }
        }).then(() => {
          alert('Thêm hiện vật thành công! / Created successfully!');
          this.render(container);
          if (this.onRefresh) this.onRefresh();
        });
      };
    }
  }
}
