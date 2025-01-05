import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { PlusCircle, MinusCircle, Trophy } from 'lucide-react';

const API_BASE_URL = 'https://sb-counter-backend.onrender.com'


const SalesTracker = () => {
  const [sales, setSales] = useState({});
  const [salesAmount, setSalesAmount] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [salesRecords, setSalesRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const companies = {
    'ALPES MASIVO': {
      products: [{ sku: '182-AM', name: 'Productos Alpes Masivo' }],
      meta: 7,
      type: 'units',
      premio: 0
    },
    'EUROFARMA': {
      products: [
        { sku: '2105005', name: 'AMINOXINE PLUS X 60' },
        { sku: '2105008', name: 'BETA - COMPLEX' },
        { sku: '2107507', name: 'LACTOFLORA CAP. X 30' },
        { sku: '2107514', name: 'LACTOFLORA SACHET X 10' },
        { sku: '583215', name: 'MI VIT D X 10 ML' },
        { sku: '2355026', name: 'MIVIT C NAR 1000mg X10COM.EF.' },
        { sku: '2107512', name: 'MOVINOL 600mg X60CAP.BLANDAS' },
        { sku: '2350288', name: 'VITABRAL X60CAP.BLANDAS' }
      ],
      meta: 63,
      type: 'units',
      premio: 30000,
      sobrecumplimiento: [
        { nivel: 1, premio: 70000, descripcion: '1er Sobrecumplimiento' },
        { nivel: 2, premio: 40000, descripcion: '2do Sobrecumplimiento' },
        { nivel: 3, premio: 20000, descripcion: '3er Sobrecumplimiento' }
      ]
    },
    'GENOMMA': {
      products: [
        { sku: '577199', name: 'X-RAY X60COM.' },
        { sku: '583061', name: 'X-RAY COLAGENO SPORT X60COM.' },
        { sku: '584860', name: 'XRAY PIÑA POLVO X30SACHET' },
        { sku: '587421', name: 'XRAY X30COM.REC' },
        { sku: '558053', name: 'QG BIOTIC FLORA X 30CAP' },
        { sku: '558054', name: 'QG BIOTIC COMPLETE MENTA X30COM.MAST' },
        { sku: '558055', name: 'QG BIOTIC GUMMIES X60' }
      ],
      meta: 23,
      type: 'units',
      premio: 35000
    },
    'HALEON': {
      products: [
        { sku: '576418', name: 'CENTRUM MUJER X30COM.REC' },
        { sku: '576421', name: 'CENTRUM HOMBRE X30COM.REC' },
        { sku: '583031', name: 'CENTRUM MINI x 30com' }
      ],
      meta: 13,
      type: 'units',
      premio: 30000
    },
    'MEDCELL': {
      products: [
        { sku: 'MIX-MEDCELL', name: 'TODO EL MIX V&S MEDCELL' }
      ],
      meta: 3,
      type: 'units',
      premio: 40000,
      sobrecumplimiento: [
        { 
          nivel: 1, 
          premio: 100000, 
          descripcion: '10 locales con mejor sobrecumplimiento MEDCELL' 
        }
      ]
    },
    'SANITAS': {
      products: [
        { sku: '587816', name: 'PROFLORA SUSP. X10BOT.' },
        { sku: '587906', name: 'LACTOBASAN 9000 FCC LACTASA X60COM.' },
        { sku: '587907', name: 'PROBACILUS GOTAS PROBIOTICAS X5ml' }
      ],
      meta: 3,
      type: 'units',
      premio: 50000
    },
    'VANDES': {
      products: [
        { sku: '1183015', name: 'VANDES MAX X60CAP' },
        { sku: '1183016', name: 'VANDES PIEL X30SOB' },
        { sku: '587158', name: 'VANDES AOX' }
      ],
      meta: 3,
      type: 'units',
      premio: 30000
    },
    'WINKLER': {
      products: [
        { sku: '588538', name: 'WHEY PRO WIN CHOCOLATE SUIZO X1KG' },
        { sku: '588539', name: 'GEL BOOST SABOR NARANJA X1SOB' },
        { sku: '588540', name: 'KREATOR PRE ENTRENAMITO X600g' },
        { sku: '588542', name: 'PROTE DETOX BERRIES X500ml' },
        { sku: '588543', name: 'CREATINE MONOHIDRATE X300g' },
        { sku: '588545', name: 'CHRONOS CAFEINA 250mg X120CAP.' },
        { sku: '588799', name: 'ISO WIN CHOCOLATE X1kg' }
      ],
      meta: 98514,
      type: 'amount',
      premio: 30000,
      sobrecumplimiento: [
        { nivel: 1, premio: 50000, descripcion: '1er Sobrecumplimiento' },
        { nivel: 2, premio: 30000, descripcion: '2do Sobrecumplimiento' },
        { nivel: 3, premio: 20000, descripcion: '3er Sobrecumplimiento' }
      ]
    }
  };

  const handleSale = async (company, sku, increment) => {
    try {
      const sale = {
        company,
        sku,
        amount: increment,
        type: 'units',
        timestamp: new Date().toISOString()
      };
  
      await fetchWithRetry(`${API_BASE_URL}/api/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });
  
      setSales(prev => ({
        ...prev,
        [sku]: Math.max(0, (prev[sku] || 0) + increment)
      }));
  
      await fetchSales();
    } catch (err) {
      setError('Error al guardar venta: ' + err.message);
      console.error('Error saving sale:', err);
    }
  };


  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  };



  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  };
  
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetchWithRetry(`${API_BASE_URL}/api/sales`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      // Process the sales data
      const processedSales = {};
      const processedAmounts = {};
      
      // Group sales by company and calculate totals
      data.forEach(sale => {
        if (!processedSales[sale.company]) {
          processedSales[sale.company] = [];
        }
        processedSales[sale.company].push(sale);
        
        if (companies[sale.company]?.type === 'amount') {
          processedAmounts[sale.company] = (processedAmounts[sale.company] || 0) + sale.amount;
        }
      });
  
      setSalesRecords(processedSales);
      setSalesAmount(processedAmounts);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
React.useEffect(() => {
  const initializeApp = async () => {
    setLoading(true);
    try {
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        setError('No se pudo establecer conexión con el servidor. Por favor, intente más tarde.');
        return;
      }
      await fetchSales();
    } catch (err) {
      setError('Error al inicializar la aplicación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  initializeApp();
}, []);
  
  const calculateCompanyProgress = (company, data) => {
    const total = data.products.reduce((acc, product) => {
      const productSales = sales[product.sku] || 0;
      return acc + productSales;
    }, 0);
  
    const percentage = (total / data.meta) * 100;
    return { total, percentage };
  };
  
  
  const handleAddAmount = async (company, sku, amount) => {
    try {
      if (!amount || amount <= 0) return;

      const sale = {
        company,
        sku,
        amount: Number(amount),
        type: 'amount',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/api/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });

      if (!response.ok) {
        throw new Error('Failed to save amount');
      }

      // Clear input and refresh data
      setNewAmount('');
      await fetchSales();
    } catch (err) {
      setError('Error saving amount: ' + err.message);
      console.error('Error saving amount:', err);
    }
  };
  
  
  const handleRemoveRecord = async (company, record) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/${record._id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete sale record');
      }
  
      await fetchSales();
    } catch (err) {
      setError('Error deleting record: ' + err.message);
      console.error('Error deleting record:', err);
    }
  };

  const resetSales = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/reset`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to reset sales');
      }

      // Reset local state
      setSales({});
      setSalesAmount({});
      setSalesRecords({});
      setShowResetConfirm(false);
      
      // Refresh data
      await fetchSales();
    } catch (err) {
      setError('Error resetting sales: ' + err.message);
      console.error('Error resetting sales:', err);
    }
  };
 


  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-100 border-green-500';
    if (percentage >= 75) return 'bg-yellow-100 border-yellow-500';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="space-y-6 p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading sales data...</div>
      ) : (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registro de Ventas en Tiempo Real - Metas SKU 182</h2>
        <button 
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        >
          Reiniciar Contadores
        </button>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4">
            <h3 className="text-lg font-bold mb-4">¿Confirmar reinicio?</h3>
            <p className="mb-4">Esta acción eliminará todos los registros de ventas.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={resetSales}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirmar Reinicio
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(companies).map(([company, data]) => {
  const progress = calculateCompanyProgress(company, data); // Calcula progress aquí
  const progressClass = getProgressColor(progress.percentage); // Calcula la clase de progreso

          return (
            <Card key={company} className={`border-2 ${progressClass}`}>
            <CardHeader className="border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">{company}</CardTitle>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Meta SKU 182: {data.type === 'amount' ? 
                      `$${data.meta.toLocaleString()}` : 
                      `${data.meta} unidades`}
                  </div>
                  <div className="text-lg font-bold">
                    Total: {data.type === 'amount' ? 
                      `$${progress.total.toLocaleString()}` : 
                      `${progress.total} unidades`}
                    <span className="text-sm ml-2">
                      ({progress.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
              <CardContent>
                <div className="py-3">
                  {data.type === 'amount' ? (
                    <div className="w-full space-y-4">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-medium">
                            Ingrese monto de venta
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Ingrese monto..."
                            className="w-full px-3 py-2 border rounded-lg"
                            value={newAmount || ''}
                            onChange={(e) => setNewAmount(e.target.value ? Number(e.target.value) : '')}
                          />
                        </div>
                        <button
                          onClick={() => handleAddAmount(company, 'MIX-' + company, Number(newAmount))}
                          disabled={!newAmount}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Agregar Venta
                        </button>
                      </div>

                      <div className="rounded-lg border">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                          <h3 className="font-medium">Registro de Ventas</h3>
                        </div>
                        <div className="divide-y max-h-60 overflow-auto">
                        {salesRecords[company]?.map((record) => (
  <div key={record._id} className="flex justify-between items-center px-4 py-2">
    <span className="text-sm text-gray-600">
      {new Date(record.timestamp).toLocaleString()}
    </span>
    <span className="font-medium">
      ${record.amount.toLocaleString()}
    </span>
    <button
      onClick={() => handleRemoveRecord(company, record)}
      className="text-red-500 hover:text-red-700"
    >
      <MinusCircle className="w-5 h-5" />
    </button>
  </div>
))}
                          {(!salesRecords[company] || salesRecords[company].length === 0) && (
                            <div className="px-4 py-3 text-center text-gray-500">
                              No hay ventas registradas
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
                          <span className="font-medium">Total Acumulado:</span>
                          <span className="text-lg font-bold">
                            ${(salesAmount[company] || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Productos incluidos:
                        <ul className="mt-2 space-y-1">
                          {data.products.map(product => (
                            <li key={product.sku}>{product.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
               ) : data.products.length === 1 ? (
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{data.products[0].name}</div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold w-12 text-center">
                        {sales[data.products[0].sku] || 0}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSale(company, data.products[0].sku, -1)}  // Fixed line
                          disabled={!sales[data.products[0].sku]}
                          className="p-1 rounded-full hover:bg-red-100 disabled:opacity-50"
                        >
                          <MinusCircle className="w-8 h-8 text-red-500" />
                        </button>
                        <button
                          onClick={() => handleSale(company, data.products[0].sku, 1)}  // Fixed line
                          className="p-1 rounded-full hover:bg-green-100"
                        >
                          <PlusCircle className="w-8 h-8 text-green-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                  ) : (
                    <div className="space-y-4">
                      {data.products.map((product) => (
                        <div key={product.sku} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-xl font-bold w-12 text-center">
                              {sales[product.sku] || 0}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSale(product.sku, -1)}
                                disabled={!sales[product.sku]}
                                className="p-1 rounded-full hover:bg-red-100 disabled:opacity-50"
                              >
                                <MinusCircle className="w-8 h-8 text-red-500" />
                              </button>
                              <button
                                onClick={() => handleSale(product.sku, 1)}
                                className="p-1 rounded-full hover:bg-green-100"
                              >
                                <PlusCircle className="w-8 h-8 text-green-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
    )}
    </div>
  );
  {error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-between items-center">
      <span>{error}</span>
      <button 
        onClick={() => fetchSales()} 
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Reintentar Conexión
      </button>
    </div>
  )}
};

export default SalesTracker;