import { useState } from 'react';
import { goalService } from '../services/goalService';

export const useDeleteGoal = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteGoal = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await goalService.delete(id);
        } catch (err: unknown) {
             if (err instanceof Error) {
                setError(err.message);
             } else {
                 setError('Error al eliminar la meta');
             }
             throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteGoal, loading, error };
};
