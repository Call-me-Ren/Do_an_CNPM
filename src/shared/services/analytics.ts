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

const STORAGE_KEY_SESSIONS = 'museum_active_sessions_v3';
const STORAGE_KEY_EVENTS = 'museum_listen_events_v3';

// 35 seconds timeout for live devices (heartbeat sent every 10s)
const SESSION_TIMEOUT_MS = 35 * 1000;

// Free public high-availability real-time presence channel
const CLOUD_PRESENCE_URL = 'https://ntfy.sh/wrm_museum_presence_cnpm';
const CLOUD_PRESENCE_WS = 'wss://ntfy.sh/wrm_museum_presence_cnpm/ws';

class AnalyticsService {
  private currentSessionId: string = '';
  private heartbeatInterval: any = null;
  private ws: WebSocket | null = null;
  private reconnectTimeout: any = null;
  private startedAt: number = Date.now();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSession();
    }
  }

  public isAdminPage(): boolean {
    if (typeof window === 'undefined') return false;
    const path = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const href = (window.location.href || '').toLowerCase();
    return (
      path.includes('admin') ||
      hash.includes('admin') ||
      href.includes('admin') ||
      Boolean(localStorage.getItem('admin_token'))
    );
  }

  private initSession(): void {
    if (typeof window === 'undefined') return;

    // Do NOT register admin pages or logged-in admin as visitor devices!
    if (this.isAdminPage()) {
      this.removeCurrentSession();
      this.connectCloudPresence();
      return;
    }

    // Assign a unique session ID per browser tab
    let tabSession = sessionStorage.getItem('museum_visitor_session_id');
    if (!tabSession) {
      tabSession = `vis_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      sessionStorage.setItem('museum_visitor_session_id', tabSession);
    }
    this.currentSessionId = tabSession;
    this.startedAt = Date.now();

    // Start background presence heartbeat (every 10s)
    this.sendHeartbeat();
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 10000);

    // Refresh presence whenever tab becomes visible, focused, or receives user interaction
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.sendHeartbeat();
      }
    });
    window.addEventListener('focus', () => this.sendHeartbeat());

    // Clean up when user closes or leaves tab
    window.addEventListener('beforeunload', () => {
      this.notifyLeave();
    });
    window.addEventListener('pagehide', () => {
      this.notifyLeave();
    });

    // Connect to cloud presence to sync devices across phone, Chrome, Edge
    this.connectCloudPresence();
  }

  private notifyLeave(): void {
    if (typeof window === 'undefined' || !this.currentSessionId || this.isAdminPage()) return;
    this.removeCurrentSession();
    try {
      const payload = JSON.stringify({ type: 'leave', sessionId: this.currentSessionId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(CLOUD_PRESENCE_URL, payload);
      } else {
        fetch(CLOUD_PRESENCE_URL, { method: 'POST', body: payload, keepalive: true }).catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  public sendHeartbeat(
    artifactId: string | null = null,
    artifactTitle: string | null = null,
    lang: string = 'vi'
  ): void {
    if (typeof window === 'undefined') return;

    // Strict guard: Admin pages NEVER send visitor heartbeats!
    if (this.isAdminPage()) {
      this.removeCurrentSession();
      return;
    }

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
        startedAt: existingIndex !== -1 ? sessions[existingIndex].startedAt : this.startedAt,
      };

      if (existingIndex !== -1) {
        sessions[existingIndex] = updatedSession;
      } else {
        sessions.push(updatedSession);
      }

      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));

      // Broadcast heartbeat to Cloud Channel so Admin on PC immediately sees Phone/Chrome!
      this.publishCloudPresence({
        type: 'ping',
        session: updatedSession
      });
    } catch {
      // Ignore localStorage errors
    }
  }

  private publishCloudPresence(msg: any): void {
    try {
      fetch(CLOUD_PRESENCE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  private connectCloudPresence(): void {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      // Poll recent 35s history on load to immediately discover devices already active on phone/other browsers
      fetch(`${CLOUD_PRESENCE_URL}/json?poll=1&since=35s`)
        .then((r) => r.text())
        .then((txt) => {
          if (!txt) return;
          const lines = txt.trim().split('\n');
          lines.forEach((line) => {
            try {
              const parsed = JSON.parse(line);
              if (parsed.message) {
                const inner = JSON.parse(parsed.message);
                this.handleCloudMessage(inner);
              }
            } catch {
              // ignore
            }
          });
        })
        .catch(() => {});

      // Connect WebSocket for instant live real-time push
      const ws = new WebSocket(CLOUD_PRESENCE_WS);
      this.ws = ws;

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.message) {
            const inner = JSON.parse(parsed.message);
            this.handleCloudMessage(inner);
          }
        } catch {
          // ignore
        }
      };

      ws.onclose = () => {
        this.ws = null;
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          this.connectCloudPresence();
        }, 6000);
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch {}
      };
    } catch {
      // ignore
    }
  }

  private handleCloudMessage(msg: any): void {
    if (!msg || typeof msg !== 'object') return;

    if (msg.type === 'ping' && msg.session) {
      const incoming: ActiveSession = msg.session;
      // Do not accept admin as visitor
      if (
        incoming.sessionId.startsWith('admin_') ||
        (incoming.sessionId === this.currentSessionId && this.isAdminPage())
      ) {
        return;
      }

      const sessions = this.getActiveSessions();
      const idx = sessions.findIndex((s) => s.sessionId === incoming.sessionId);
      if (idx !== -1) {
        sessions[idx] = { ...sessions[idx], ...incoming, lastActive: Date.now() };
      } else {
        sessions.push({ ...incoming, lastActive: Date.now() });
      }
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch {}
    } else if (msg.type === 'leave' && msg.sessionId) {
      const sessions = this.getActiveSessions().filter((s) => s.sessionId !== msg.sessionId);
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch {}
    } else if (msg.type === 'listen' && msg.event) {
      const incomingEvent: ListenEvent = msg.event;
      const events = this.getListenEvents();
      if (!events.some((e) => e.id === incomingEvent.id)) {
        events.push(incomingEvent);
        if (events.length > 2000) events.shift();
        try {
          localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
        } catch {}
      }
    }
  }

  public removeCurrentSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const sessions = this.getActiveSessions().filter(
        (s) => s.sessionId !== this.currentSessionId && !s.sessionId.startsWith('admin_')
      );
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
      // Keep devices that pinged within SESSION_TIMEOUT_MS (35s)
      const fresh = parsed.filter(
        (s) =>
          typeof s === 'object' &&
          s !== null &&
          typeof s.lastActive === 'number' &&
          now - s.lastActive < SESSION_TIMEOUT_MS &&
          typeof s.sessionId === 'string' &&
          !s.sessionId.startsWith('admin_') &&
          (!this.isAdminPage() || s.sessionId !== this.currentSessionId)
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

      events.push(newEvent);
      if (events.length > 2000) {
        events.shift();
      }

      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));

      // Broadcast listen event to Cloud Channel in real time
      this.publishCloudPresence({
        type: 'listen',
        event: newEvent
      });

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
