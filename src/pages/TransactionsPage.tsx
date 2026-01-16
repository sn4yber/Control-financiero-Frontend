import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovements } from '../features/movements/hooks/useMovements';
import { useDeleteMovement } from '../features/movements/hooks/useDeleteMovement';
import { CreateTransactionModal } from '../features/movements/components/CreateTransactionModal';
import { ArrowUpCircle, ArrowDownCircle, Search, Filter, Plus, Calendar, Loader2, Trash2, Download } from 'lucide-react';
import type { MovementType } from '../core/types/domain';

export const TransactionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [filterType, setFilterType] = useState<MovementType | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { movements, loading, error, refetch } = useMovements({ 
    filters: { tipo: filterType } 
  });
  
  const filteredMovements = useMemo(() => {
    if (!searchQuery) return movements;
    const lowerQuery = searchQuery.toLowerCase();
    return movements.filter(m => 
      m.descripcion.toLowerCase().includes(lowerQuery) ||
      m.categoriaNombre?.toLowerCase().includes(lowerQuery) ||
      m.fuenteIngresoNombre?.toLowerCase().includes(lowerQuery) ||
      m.metaNombre?.toLowerCase().includes(lowerQuery) ||
      m.monto.toString().includes(lowerQuery)
    );
  }, [movements, searchQuery]);
  
  const { deleteMovement, loading: deleting } = useDeleteMovement();

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        await deleteMovement(id);
        await refetch();
      } catch (error: any) {
        console.error('Error deleting movement:', error);
        
        let errorMessage = 'Hubo un error al eliminar el movimiento.';
        
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            if (error.response.status === 409) {
                errorMessage = 'No se puede eliminar este movimiento porque está vinculado a una Meta u otro registro. Elimina primero la vinculación.';
            } else if (error.response.status === 500) {
                errorMessage = 'Error interno del servidor (500). Por favor intente más tarde.';
            } else if (error.response.status === 404) {
                errorMessage = 'El movimiento ya no existe o ya fue eliminado.';
            } else if (error.response.status === 403) {
                 errorMessage = 'No tienes permiso para eliminar este movimiento.';
            }
        } else if (error.request) {
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        }

        alert(errorMessage);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportCSV = () => {
    if (movements.length === 0) return;

    // Headers
    const headers = ['ID', 'Descripción', 'Tipo', 'Monto', 'Fecha', 'Categoría/Fuente', 'Estado'];
    
    // Rows
    const rows = movements.map(m => [
      m.id,
      `"${m.descripcion}"`, // Escape quotes
      m.tipoMovimiento,
      m.monto,
      m.fechaMovimiento,
      `"${m.categoriaNombre || m.fuenteIngresoNombre || 'Sin categoría'}"`,
      'Completado'
    ]);

    const csvContent = [
      headers.join(','), 
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'movimientos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimientos</h1>
          <p className="text-gray-500 mt-1">Gestiona tus ingresos y gastos.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-900/20"
          >
            <Plus size={20} />
            <span>Nuevo Movimiento</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="flex p-1 bg-gray-100/80 rounded-lg">
          <button 
            onClick={() => setFilterType(undefined)}
            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!filterType ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilterType('INCOME')}
            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filterType === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Ingresos
          </button>
          <button 
            onClick={() => setFilterType('EXPENSE')}
            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filterType === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Gastos
          </button>
        </div>

        <div className="flex-1 flex gap-2">
           <div className="relative flex-1">
             <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Buscar movimiento..." 
               value={searchQuery}
               onChange={(e) => setSearchParams(prev => {
                 const newParams = new URLSearchParams(prev);
                 if (e.target.value) {
                    newParams.set('search', e.target.value);
                 } else {
                    newParams.delete('search');
                 }
                 return newParams;
               })}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-50 rounded-lg text-sm transition-all outline-none"
             />
           </div>
           
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200">
             <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : error ? (
           <div className="h-96 flex flex-col items-center justify-center text-red-500 p-8 text-center">
             <p className="font-medium">Ocurrió un error al cargar los movimientos</p>
             <p className="text-sm mt-1 text-red-400">{error}</p>
             <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">Reintentar</button>
           </div>
        ) : filteredMovements.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Calendar size={32} className="opacity-50" />
            </div>
            <p className="font-medium text-gray-900">No se encontraron movimientos</p>
            <p className="text-sm mt-1 mb-4">{searchQuery ? 'Intenta con otros términos de búsqueda' : 'Comienza registrando tus ingresos y gastos'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
             {filteredMovements.map((movement) => (
               <div key={movement.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 group">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                   movement.tipoMovimiento === 'INCOME' 
                     ? 'bg-green-100 text-green-600' 
                     : movement.tipoMovimiento === 'EXPENSE' 
                       ? 'bg-red-100 text-red-600' 
                       : 'bg-blue-100 text-blue-600'
                 }`}>
                   {movement.tipoMovimiento === 'INCOME' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-1">
                     <p className="font-medium text-gray-900 truncate pr-2">{movement.descripcion}</p>
                     <div className="flex items-center gap-4">
                        <span className={`font-bold whitespace-nowrap ${
                            movement.tipoMovimiento === 'INCOME' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                            {movement.tipoMovimiento === 'INCOME' ? '+' : '-'} {formatCurrency(movement.monto)}
                        </span>
                        <button 
                            onClick={() => handleDelete(movement.id)}
                            disabled={deleting}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Eliminar movimiento"
                        >
                            <Trash2 size={16} />
                        </button>
                     </div>
                   </div>
                   <div className="flex justify-between items-center text-xs text-gray-500">
                     <div className="flex items-center gap-2">
                        <span>{formatDate(movement.fechaMovimiento)}</span>
                        {movement.categoriaNombre && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 font-medium">
                            {movement.categoriaNombre}
                          </span>
                        )}
                        {movement.fuenteIngresoNombre && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 font-medium">
                            {movement.fuenteIngresoNombre}
                          </span>
                        )}
                     </div>
                     {movement.esRecurrente && (
                        <span className="flex items-center gap-1 text-primary-600">
                           Recurrente
                        </span>
                     )}
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      <CreateTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
