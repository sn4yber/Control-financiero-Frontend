import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category, CategoryType } from '../../../core/types/domain';

export const useCategories = (userId?: number, type?: CategoryType) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllByUserId(userId, type);
        setCategories(data);
      } catch (err) {
        console.warn('Error fetching categories:', err);
        setCategories([]);
        setError('Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [userId, type]);

  return { categories, loading, error };
};
