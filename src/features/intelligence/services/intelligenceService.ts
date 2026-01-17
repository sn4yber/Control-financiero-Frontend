import { apiClient } from '../../../core/api/client';

export interface ExpensePrediction {
  category: string;
  predictedAmount: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface FinancialRecommendation {
  id: string;
  type: 'saving' | 'investment' | 'spending_cut';
  title: string;
  description: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
}

export const intelligenceService = {
  // Obtener predicción de gastos para el próximo mes
  getExpensePredictions: async (): Promise<ExpensePrediction[]> => {
    try {
      const response = await apiClient.get<ExpensePrediction[]>('/inteligencia/prediccion-gastos');
      return response.data;
    } catch (error) {
      console.warn('API Predicciones falló, usando datos mock para demostración');
      return [
        { category: 'Alimentación', predictedAmount: 450000, confidence: 0.85, trend: 'stable' },
        { category: 'Transporte', predictedAmount: 180000, confidence: 0.92, trend: 'up' },
        { category: 'Ocio', predictedAmount: 120000, confidence: 0.65, trend: 'down' }
      ];
    }
  },

  // Obtener recomendaciones financieras personalizadas basadas en IA
  getRecommendations: async (): Promise<FinancialRecommendation[]> => {
    try {
      const response = await apiClient.get<FinancialRecommendation[]>('/inteligencia/recomendaciones');
      return response.data;
    } catch (error) {
      console.warn('API Recomendaciones falló, usando datos mock para demostración');
      return [
        {
          id: '1',
          type: 'spending_cut',
          title: 'Gasto elevado en Transporte',
          description: 'Tus gastos en transporte han subido un 15% respecto al mes pasado. Considera usar rutas alternativas.',
          potentialSavings: 50000,
          priority: 'medium'
        },
        {
          id: '2',
          type: 'saving',
          title: 'Oportunidad de Ahorro',
          description: 'Si reduces tus gastos hormiga en un 10%, podrías alcanzar tu meta de "Vacaciones" 1 mes antes.',
          potentialSavings: 120000,
          priority: 'high'
        }
      ];
    }
  },

  // Analizar un gasto específico (ej. antes de hacer una compra grande)
  analyzeExpense: async (amount: number, category: string, description: string) => {
    try {
      const response = await apiClient.post('/inteligencia/analisis-gasto', {
        amount,
        category,
        description
      });
      return response.data;
    } catch (e) {
      console.warn('Endpoint análisis no disponible, mockeando...');
       throw e; // Dejar que el componente maneje el mock o manejarlo aquí
    }
  },
  
  // Analizar viabilidad de una meta
  analyzeGoal: async (amount: number, date: string, name: string) => {
    // Simulación de endpoint
    console.log(`Analizando meta: ${name}`); // Use name to avoid unused var
    return new Promise<{ message: string; severity: 'info' | 'warning' | 'danger' | 'success' }>((resolve) => {
      setTimeout(() => {
        const today = new Date();
        const targetDate = new Date(date);
        const months = (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (months <= 0) {
           resolve({ message: '⚠️ La fecha objetivo debe ser futura.', severity: 'danger' });
           return;
        }

        const monthlySaving = amount / months;
        
        if (monthlySaving > 2000000) {
          resolve({ 
            message: `⚠️ Necesitarías ahorrar ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(monthlySaving)} mensuales. ¿Es realista?`, 
            severity: 'warning' 
          });
        } else if (monthlySaving < 50000) {
           resolve({ 
            message: '✅ Meta muy alcanzable. Podrías aumentar el monto.', 
            severity: 'success' 
          });
        } else {
           resolve({ 
            message: `ℹ️ Sugerencia: Ahorra aprox ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(monthlySaving)}/mes.`, 
            severity: 'info' 
          });
        }
      }, 1500);
    });
  },

  analyzeSavings: async (amount: number, goalName: string) => {
    return new Promise<{ message: string; severity: 'info' | 'warning' | 'danger' | 'success' }>((resolve) => {
      setTimeout(() => {
        if (amount > 500000) {
           resolve({ message: `🚀 ¡Excelente aporte para "${goalName}"! Estás acelerando tu progreso significativamente.`, severity: 'success' });
        } else if (amount < 10000) {
           resolve({ message: '💡 Todo suma, pero intenta aumentar un poco tus aportes cuando puedas.', severity: 'info' });
        } else {
           resolve({ message: '✅ Buen hábito de ahorro constante.', severity: 'success' });
        }
      }, 1000);
    });
  }
};
