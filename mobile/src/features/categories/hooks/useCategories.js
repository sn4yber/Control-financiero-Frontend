import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = (tipo) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll(tipo);
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [tipo]);

  return { categories, loading, error, refetch: fetchCategories };
};
