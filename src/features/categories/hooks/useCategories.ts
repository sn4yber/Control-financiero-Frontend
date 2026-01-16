import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category, CategoryType } from '../../../core/types/domain';

export const useCategories = (type?: CategoryType) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAll(type);
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
  }, [type]);

  const refreshCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll(type);
      setCategories(data);
    } catch (err) {
      console.warn('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refreshCategories };
};
