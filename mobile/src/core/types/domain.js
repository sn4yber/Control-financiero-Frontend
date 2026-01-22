// Definiciones de tipos basadas en el modelo de dominio DDD del Backend
// JavaScript version (no TypeScript en React Native básico)

// Enums como constantes
export const IncomeType = {
  MONTHLY: 'MONTHLY',
  BIWEEKLY: 'BIWEEKLY',
  WEEKLY: 'WEEKLY',
  PROJECT_BASED: 'PROJECT_BASED',
  VARIABLE: 'VARIABLE',
};

export const CategoryType = {
  EXPENSE: 'EXPENSE',
  SAVINGS: 'SAVINGS',
  INVESTMENT: 'INVESTMENT',
  DEBT: 'DEBT',
};

export const IncomeSourceType = {
  SALARY: 'SALARY',
  FREELANCE: 'FREELANCE',
  LOAN: 'LOAN',
  SCHOLARSHIP: 'SCHOLARSHIP',
  SUBSIDY: 'SUBSIDY',
  INVESTMENT: 'INVESTMENT',
  OTHER: 'OTHER',
};

export const GoalPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const GoalStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  PAUSED: 'PAUSED',
};

export const MovementType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  SAVINGS: 'SAVINGS',
  LOAN: 'LOAN',
  TRANSFER: 'TRANSFER',
};
