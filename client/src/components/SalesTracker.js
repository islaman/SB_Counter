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

  const handleSale = (sku, increment) => {
    setSales(prev => ({
      ...prev,
      [sku]: Math.max(0, (prev[sku] || 0) + increment)
    }));
  };


  const fetchSales = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales`);
      if (!response.ok) {
        throw new Error('Error al obtener las ventas');
      }
  
      const data = await response.json();
      console.log('Ventas obtenidas:', data);
      // Aquí puedes actualizar el estado de `salesRecords` con los datos obtenidos
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };
  
  // Llama a esta función dentro de un useEffect para ejecutarla al cargar el componente
  React.useEffect(() => {
    fetchSales();
  }, []);
  

  const handleAddAmount = async (company, sku, amount, type) => {
    try {
      const sale = { company, sku, amount, type }; // Datos a enviar al backend
      const response = await fetch(`${API_BASE_URL}/api/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale),
      });
  
      if (!response.ok) {
        throw new Error('Error al guardar la venta');
      }
      
      const progress = calculateCompanyProgress(company, data);
      const data = await response.json();
      console.log('Venta guardada:', data);
    } catch (error) {
      console.error('Error al guardar la venta:', error);
    }
  };
  

  const handleRemoveRecord = (company, index) => {
    setSalesRecords(prev => {
      const newRecords = { ...prev };
      const amount = newRecords[company][index].amount;
      newRecords[company] = newRecords[company].filter((_, i) => i !== index);
      
      // Actualizar el monto total
      setSalesAmount(prev => ({
        ...prev,
        [company]: prev[company] - amount
      }));
      
      return newRecords;
    });
  };

  const resetSales = () => {
    setSales({});
    setSalesAmount({});
    setSalesRecords({});
    setShowResetConfirm(false);
  };

  const calculateCompanyProgress = (company, data) => {
    const total = data.products.reduce((acc, product) => {
      const productSales = sales[product.sku] || 0;
      return acc + productSales;
    }, 0);
  
    const percentage = (total / data.meta) * 100;
  
    return { total, percentage };
  };
  
  // Mostrar correctamente unidades o montos
  <div>
    Total: {data.type === 'amount' ? 
      `$${progress.total.toLocaleString()}` : 
      `${progress.total} unidades`}
  </div>
  


  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-100 border-green-500';
    if (percentage >= 75) return 'bg-yellow-100 border-yellow-500';
    return 'bg-white border-gray-200';
  };

  return (
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
          const progress = calculateCompanyProgress(company, data);
          const progressClass = getProgressColor(progress.percentage);
          
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
                        progress.total}
                      <span className="text-sm ml-2">
                        ({progress.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    {data.premio > 0 && (
                      <div className="text-sm text-green-600">
                        Premio base: ${data.premio.toLocaleString()}
                      </div>
                    )}
                    {data.sobrecumplimiento && progress.percentage >= 100 && (
                      <div className="mt-2 text-sm">
                        {data.sobrecumplimiento.map((nivel, index) => (
                          <div key={index} className="flex items-center gap-1 text-violet-600">
                            <Trophy className="w-4 h-4" />
                            {nivel.descripcion}: ${nivel.premio.toLocaleString()}
                          </div>
                        ))}
                      </div>
                    )}
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
                          onClick={handleAddAmount}
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
                          {salesRecords[company]?.map((record, index) => (
                            <div key={index} className="flex justify-between items-center px-4 py-2">
                              <span className="text-sm text-gray-600">
                                {new Date(record.timestamp).toLocaleString()}
                              </span>
                              <span className="font-medium">
                                ${record.amount.toLocaleString()}
                              </span>
                              <button
                                onClick={() => handleRemoveRecord(company, index)}
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
                              onClick={() => handleSale(data.products[0].sku, -1)}
                              disabled={!sales[data.products[0].sku]}
                              className="p-1 rounded-full hover:bg-red-100 disabled:opacity-50"
                            >
                              <MinusCircle className="w-8 h-8 text-red-500" />
                            </button>
                            <button
                              onClick={() => handleSale(data.products[0].sku, 1)}
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
  );
};

export default SalesTracker;