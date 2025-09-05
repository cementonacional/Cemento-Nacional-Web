'use client';

import { useState, useEffect } from 'react';
import { IPurchase } from '@/lib/models';

interface PurchaseStats {
  totalRevenue: number;
  totalPurchases: number;
  averageOrderValue: number;
  paidPurchases: number;
  pendingPurchases: number;
  failedPurchases: number;
}

interface PurchaseAdminProps {
  isAuthenticated: boolean;
}

export default function PurchaseAdmin({ isAuthenticated }: PurchaseAdminProps) {
  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  const [stats, setStats] = useState<PurchaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    customerEmail: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Cargar compras
  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });
      
      const response = await fetch(`/api/purchases?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPurchases(data.data.purchases);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
      } else {
        setError(data.error || 'Error cargando compras');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Cargar compras al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      loadPurchases();
    }
  }, [isAuthenticated, pagination.page, filters]);

  // Manejar cambio de filtros
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-brand-black mb-4">
          Administración de Compras
        </h2>
        <p className="text-gray-600">
          Inicia sesión para ver las compras de los usuarios.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand-black mb-6">
        Administración de Compras
      </h2>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-lg">
            <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
            <p className="text-2xl font-bold text-brand-red">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-lg">
            <h3 className="text-sm font-medium text-gray-600">Total Compras</h3>
            <p className="text-2xl font-bold text-brand-black">
              {stats.totalPurchases}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-lg">
            <h3 className="text-sm font-medium text-gray-600">Valor Promedio</h3>
            <p className="text-2xl font-bold text-brand-gold">
              {formatCurrency(stats.averageOrderValue)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-lg">
            <h3 className="text-sm font-medium text-gray-600">Pagadas</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.paidPurchases}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border-2 border-brand-black shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-brand-black mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-brand-red"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="failed">Fallido</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email del Cliente
            </label>
            <input
              type="email"
              value={filters.customerEmail}
              onChange={(e) => handleFilterChange('customerEmail', e.target.value)}
              placeholder="buscar@email.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-brand-red"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto Mínimo
            </label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              placeholder="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Lista de compras */}
      <div className="bg-white rounded-lg border-2 border-brand-black shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-brand-black">
            Compras ({pagination.total})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando compras...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadPurchases}
              className="mt-2 px-4 py-2 bg-brand-red text-white rounded-md hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No se encontraron compras</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {purchase.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {purchase.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {purchase.productName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {purchase.productDescription}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.quantity}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(purchase.totalAmount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.paymentStatus)}`}>
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(purchase.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} resultados
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm bg-brand-red text-white rounded-md">
                {pagination.page}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
