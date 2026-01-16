import { apiClient } from '../../../core/api/client';
import type { FinancialMovement, MovementType } from '../../../core/types/domain';

export interface CreateMovementDTO {
  tipoMovimiento: MovementType;
  monto: number;
  descripcion: string;
  fechaMovimiento: string; // YYYY-MM-DD
  categoriaId?: number | null;
  fuenteIngresoId?: number | null;
  metaId?: number | null;
  esRecurrente: boolean;
  patronRecurrencia?: string | null;
  notas?: string;
}

interface MovementFilters {
  tipo?: MovementType;
  fechaInicio?: string;
  fechaFin?: string;
  categoriaId?: number;
}

export const movementService = {
  create: async (data: CreateMovementDTO): Promise<FinancialMovement> => {
    const response = await apiClient.post<FinancialMovement>('/movimientos', data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/movimientos/${id}`);
  },
  getAll: async (filters: MovementFilters = {}): Promise<FinancialMovement[]> => {
    // Axios params automatically handles object to query string
    const response = await apiClient.get<FinancialMovement[]>('/movimientos', {
      params: filters
    });
    return response.data;
  }
};
