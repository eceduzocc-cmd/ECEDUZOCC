
/**
 * SERVICIO DE CONEXIÓN INSTITUCIONAL (GOOGLE APPS SCRIPT)
 * --------------------------------------------------------
 */

export const gasService = {
  getAppUrl(): string {
    return localStorage.getItem('edupro_gas_url') || '';
  },

  isConfigured(): boolean {
    const url = this.getAppUrl();
    return url.startsWith('https://script.google.com/macros/s/') && url.endsWith('/exec');
  },

  /**
   * Envía datos y mide la latencia de respuesta.
   */
  async syncToCloud(db: any): Promise<{ success: boolean; latency: number }> {
    const url = this.getAppUrl();
    if (!this.isConfigured()) return { success: false, latency: 0 };

    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); 

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', data: db, timestamp: new Date().toISOString() }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const end = Date.now();
      
      // Registrar evento en el log local para el Dashboard
      this.logEvent('Sincronización Exitosa', 'POST');
      
      return { success: true, latency: end - start };
    } catch (error) {
      this.logEvent('Fallo de Conexión', 'ERROR');
      return { success: false, latency: 0 };
    }
  },

  async loadFromCloud(): Promise<any | null> {
    const url = this.getAppUrl();
    if (!this.isConfigured()) return null;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) return null;
      const text = await response.text();
      this.logEvent('Descarga de Datos', 'GET');
      return text ? JSON.parse(text) : null;
    } catch (error) {
      return null;
    }
  },

  logEvent(action: string, type: string) {
    const logs = JSON.parse(localStorage.getItem('edupro_sync_logs') || '[]');
    const newLog = {
      id: Date.now(),
      action,
      type,
      time: new Date().toLocaleTimeString(),
      status: type === 'ERROR' ? 'failed' : 'success'
    };
    localStorage.setItem('edupro_sync_logs', JSON.stringify([newLog, ...logs].slice(0, 5)));
  }
};
