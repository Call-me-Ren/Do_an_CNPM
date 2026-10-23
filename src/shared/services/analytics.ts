export interface ActiveSession {
  sessionId: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  lang: string;
  currentArtifactId: string | null;
  currentArtifactTitle: string | null;
  lastActive: number;
  startedAt: number;
}

export interface ListenEvent {
  id: string;
  sessionId: string;
  artifactId: string;
  artifactCode: string;
  artifactTitle: string;
  lang: string;
  timestamp: number;
}

const STORAGE_KEY_SESSIONS = 'museum_active_sessions_v1';
const STORAGE_KEY_EVENTS = 'museum_listen_events_v1';

class AnalyticsService {
  private currentSessionId: string = '';
  private heartbeatInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSession();
    }
  }

  private initSession(): void {
    if (typeof window === 'undefined') return;

    // Do not register admin portal users as visitor devices
    if (window.location.pathname.includes('/admin')) {
      return;
    }

    // Always assign a distinct unique sessionId per tab instance in memory.
    // This guarantees duplicating tabs or opening multiple tabs/windows counts as distinct devices.
    this.currentSessionId = `vis_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;

    // Start background presence heartbeat
    this.sendHeartbeat();
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 3000);

    // Clean up presence on page unload
    window.addEventListener('beforeunload', () => {
      this.removeCurrentSession();
    });
  }

  public sendHeartbeat(
    artifactId: string | null = null,
    artifactTitle: string | null = null,
    lang: string = 'vi'
  ): void {
    if (typeof window === 'undefined') return;

    // Do not register admin portal users as visitor devices
    if (window.location.pathname.includes('/admin')) return;

    try {
      if (!this.currentSessionId) {
        this.currentSessionId = `vis_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      }

      const now = Date.now();
      const sessions = this.getActiveSessions();
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
        navigator.userAgent
      );

      const deviceType: 'Mobile' | 'Desktop' | 'Tablet' = isTablet
        ? 'Tablet'
        : isMobile
        ? 'Mobile'
        : 'Desktop';

      const existingIndex = sessions.findIndex((s) => s.sessionId === this.currentSessionId);
      const updatedSession: ActiveSession = {
        sessionId: this.currentSessionId,
        deviceType,
        browser: this.detectBrowserName(),
        lang,
        currentArtifactId: artifactId || (existingIndex !== -1 ? sessions[existingIndex].currentArtifactId : null),
        currentArtifactTitle: artifactTitle || (existingIndex !== -1 ? sessions[existingIndex].currentArtifactTitle : null),
        lastActive: now,
        startedAt: existingIndex !== -1 ? sessions[existingIndex].startedAt : now,
      };

      if (existingIndex !== -1) {
        sessions[existingIndex] = updatedSession;
      } else {
        sessions.push(updatedSession);
      }

      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {
      // Ignore localStorage errors
    }
  }

  public removeCurrentSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const sessions = this.getActiveSessions().filter((s) => s.sessionId !== this.currentSessionId);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {
      // Ignore
    }
  }

  public getActiveSessions(): ActiveSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (!raw) return [];
      const parsed: ActiveSession[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const now = Date.now();
      // Only keep sessions active within the last 15 seconds that are legitimate visitor sessions
      const fresh = parsed.filter(
        (s) =>
          typeof s === 'object' &&
          s !== null &&
          typeof s.lastActive === 'number' &&
          now - s.lastActive < 15000 &&
          typeof s.sessionId === 'string' &&
          !s.sessionId.startsWith('admin_')
      );

      if (fresh.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(fresh));
      }
      return fresh;
    } catch {
      return [];
    }
  }

  public getActiveDevicesCount(): number {
    return this.getActiveSessions().length;
  }

  public trackListen(
    artifactId: string,
    artifactCode: string,
    artifactTitle: string,
    lang: string
  ): void {
    if (typeof window === 'undefined') return;

    try {
      const now = Date.now();
      const events = this.getListenEvents();
      const newEvent: ListenEvent = {
        id: `evt_${now}_${Math.random().toString(36).substring(2, 6)}`,
        sessionId: this.currentSessionId || `vis_${now}`,
        artifactId,
        artifactCode,
        artifactTitle,
        lang: lang || 'vi',
        timestamp: now,
      };

      // Keep recent 2000 events
      events.push(newEvent);
      if (events.length > 2000) {
        events.shift();
      }

      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));

      // Update current heartbeat with this artifact
      this.sendHeartbeat(artifactId, artifactTitle, lang);
    } catch {
      // Ignore
    }
  }

  public getListenEvents(): ListenEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public clearAllEvents(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_EVENTS);
  }

  private detectBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('SamsungBrowser')) return 'Samsung Internet';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    if (userAgent.includes('Edge') || userAgent.includes('Edg')) return 'Microsoft Edge';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Web Browser';
  }
}

export const analyticsService = new AnalyticsService();
