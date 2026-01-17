import { useState } from 'react';
import { reportsService } from '../services/reportsService';

export const useExportReports = () => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPDF = async (filters: { startDate?: string; endDate?: string } = {}) => {
    try {
      setExporting(true);
      setError(null);
      const blob = await reportsService.exportTransactionsPDF(filters);
      
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_transacciones_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error(err);
      setError('Error al exportar PDF');
    } finally {
      setExporting(false);
    }
  };

  const downloadExcel = async (filters: { startDate?: string; endDate?: string } = {}) => {
    try {
      setExporting(true);
      setError(null);
      const blob = await reportsService.exportTransactionsExcel(filters);
      
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_transacciones_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error(err);
      setError('Error al exportar Excel');
    } finally {
      setExporting(false);
    }
  };

  return { downloadPDF, downloadExcel, exporting, error };
};
