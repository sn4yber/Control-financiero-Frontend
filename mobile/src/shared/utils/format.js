// Utilidades de formateo (misma lógica que la versión web)

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (default: 'COP')
 * @returns {string} - Cantidad formateada
 */
export const formatCurrency = (amount, currency = 'COP') => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea una fecha
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato deseado
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, format = 'short') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('es-MX');
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor a formatear
 * @returns {string} - Porcentaje formateado
 */
export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

/**
 * Abrevia números grandes
 * @param {number} num - Número a abreviar
 * @returns {string} - Número abreviado
 */
export const abbreviateNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
