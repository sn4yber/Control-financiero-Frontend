import { apiClient } from '../../../core/api/client';

export const reportsService = {
  // Descargar reporte de transacciones en PDF
  exportTransactionsPDF: async (filters = {}) => {
    const response = await apiClient.get('/reportes/transacciones/pdf', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Descargar reporte de transacciones en Excel
  exportTransactionsExcel: async (filters = {}) => {
    const response = await apiClient.get('/reportes/transacciones/excel', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Obtener reporte financiero mensual completo (JSON)
  getMonthlyReport: async (year, month) => {
    const response = await apiClient.get('/reportes/mensual', {
      params: { year, month }
    });
    return response.data;
  }
};
