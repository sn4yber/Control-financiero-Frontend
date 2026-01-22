// services/keepAlive.service.ts
const API_URL = 'https://api-control-financiero.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutos

class KeepAliveService {
  private intervalId: number | null = null;

  /**
   * 🔥 Inicia el keep-alive automático
   * Llama a /api/ping cada 10 minutos
   */
  start() {
    if (this.intervalId) return; // Ya está corriendo

    console.log('🔥 Keep-Alive iniciado');
    
    // Primera llamada inmediata
    this.ping();

    // Luego cada 10 minutos
    this.intervalId = window.setInterval(() => {
      this.ping();
    }, PING_INTERVAL);
  }

  /**
   * 🛑 Detiene el keep-alive
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Keep-Alive detenido');
    }
  }

  /**
   * 💚 Hace ping al servidor
   */
  private async ping() {
    try {
      const response = await fetch(`${API_URL}/api/ping`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Ping exitoso:', data.uptime_seconds, 'segundos activo');
      }
    } catch (error) {
      console.warn('⚠️ Ping falló (probablemente cold start):', error);
    }
  }
}

export const keepAliveService = new KeepAliveService();
