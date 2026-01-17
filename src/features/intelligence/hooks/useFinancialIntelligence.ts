import { useState, useEffect, useCallback } from 'react';
import { intelligenceService, type ExpensePrediction, type FinancialRecommendation } from '../services/intelligenceService';

export const useFinancialIntelligence = () => {
  const [predictions, setPredictions] = useState<ExpensePrediction[]>([]);
  const [recommendations, setRecommendations] = useState<FinancialRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntelligence = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch in parallel
      const [preds, recs] = await Promise.all([
        intelligenceService.getExpensePredictions(),
        intelligenceService.getRecommendations()
      ]);
      setPredictions(preds);
      setRecommendations(recs);
    } catch (err) {
      console.error('Error fetching intelligence data:', err);
      setError('No se pudo cargar la inteligencia financiera');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntelligence();
  }, [fetchIntelligence]);

  const analyzeSpecificExpense = async (amount: number, category: string, description: string) => {
    return await intelligenceService.analyzeExpense(amount, category, description);
  };

  return { 
    predictions, 
    recommendations, 
    analyzeSpecificExpense,
    loading, 
    error,
    refetch: fetchIntelligence
  };
};
