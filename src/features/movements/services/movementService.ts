import { apiClient } from '../../../core/api/client';
import type { FinancialMovement, MovementType } from '../../../core/types/domain';

export interface CreateMovementDTO {
  usuarioId: number;
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
  getAllByUserId: async (userId: number, filters: MovementFilters = {}): Promise<FinancialMovement[]> => {
    const params = new URLSearchParams();
    
    if (filters.tipo) params.append('tipo', filters.tipo);
    if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
    if (filters.categoriaId) params.append('categoriaId', filters.categoriaId.toString());

    // Nota: Axios maneja los params automáticamente, pero como el backend espera query params específicos
    // podemos pasarlos como segundo argumento en { params: filters }
    // Sin embargo, para mayor control y seguir la documentación, usaremos el objeto config de axios.
    
    const response = await apiClient.get<FinancialMovement[]>(`/movimientos/usuario/${userId}`, {
      params: filters
    });
    return response.data;
  }
};
