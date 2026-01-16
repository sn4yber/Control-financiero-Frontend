import { useState } from 'react';
import { movementService } from '../services/movementService';

export const useDeleteMovement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteMovement = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await movementService.delete(id);
        } catch (err: unknown) {
             if (err instanceof Error) {
                setError(err.message);
             } else {
                 setError('Error al eliminar el movimiento');
             }
             throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteMovement, loading, error };
};
