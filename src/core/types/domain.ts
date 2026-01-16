// Definiciones de tipos basadas en el modelo de dominio DDD del Backend

// Enums
export type IncomeType = 'MONTHLY' | 'BIWEEKLY' | 'WEEKLY' | 'PROJECT_BASED' | 'VARIABLE';
export type CategoryType = 'EXPENSE' | 'SAVINGS' | 'INVESTMENT' | 'DEBT';
export type IncomeSourceType = 'SALARY' | 'FREELANCE' | 'LOAN' | 'SCHOLARSHIP' | 'SUBSIDY' | 'INVESTMENT' | 'OTHER';
export type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
export type MovementType = 'INCOME' | 'EXPENSE' | 'SAVINGS' | 'LOAN' | 'TRANSFER';

// Entities
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string; // Corregido: según API es 'fullName', no 'nombreCompleto'
  active: boolean; // Corregido: según API es 'active', no 'estado'
  createdAt?: string;
}

export interface FinancialContext {
  id: number;
  usuarioId: number;
  tipoIngreso: IncomeType;
  tieneIngresoVariable: boolean;
  porcentajeAhorroDeseado: number;
  periodoAnalisis: string; // Mensual, etc.
  codigoMoneda: string;
}

export interface Category {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  tipo: CategoryType;
  activa: boolean;
}

export interface IncomeSource {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion: string;
  tipo: IncomeSourceType;
  esIngresoReal: boolean;
  activa: boolean;
}

export interface FinancialGoal {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion: string;
  montoObjetivo: number;
  montoActual: number;
  fechaObjetivo: string; // ISO Date String
  prioridad: GoalPriority;
  estado: GoalStatus;
}

export interface FinancialMovement {
  id: number;
  usuarioId: number;
  tipoMovimiento: MovementType;
  monto: number;
  descripcion: string;
  fechaMovimiento: string; // ISO Date String
  
  // Relations (API returns flattened names)
  categoriaId?: number;
  categoriaNombre?: string;
  
  fuenteIngresoId?: number;
  fuenteIngresoNombre?: string;
  
  metaId?: number;
  metaNombre?: string;

  esRecurrente: boolean;
  patronRecurrencia?: string;
  notas?: string;
}
