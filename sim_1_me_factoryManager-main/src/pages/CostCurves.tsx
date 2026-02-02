import { useState } from 'react';
import { Layout } from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calculator } from 'lucide-react';

export const CostCurves = () => {
  const [outputPrice, setOutputPrice] = useState(20000);
  const [wageRate, setWageRate] = useState(50000);
  const [fixedCapital, setFixedCapital] = useState(10);
  const [rentalRate, setRentalRate] = useState(100000);

  const generateCostCurves = () => {
    const data = [];
    const maxLabor = 50;

    for (let L = 1; L <= maxLabor; L++) {
      const Q = 10 * Math.sqrt(L);

      const TFC = rentalRate * fixedCapital;
      const TVC = wageRate * L;
      const TC = TFC + TVC;

      const AFC = Q > 0 ? TFC / Q : 0;
      const AVC = Q > 0 ? TVC / Q : 0;
      const ATC = Q > 0 ? TC / Q : 0;

      const MP_L = 5 / Math.sqrt(L);
      const MC = wageRate / MP_L;

      const revenue = Q * outputPrice;
      const profit = revenue - TC;

      data.push({
        labor: L,
        output: Q,
        TFC,
        TVC,
        TC,
        AFC,
        AVC,
        ATC,
        MC,
        revenue,
        profit
      });
    }

    return data;
  };

  const data = generateCostCurves();

  const optimalLabor = Math.pow((5 * outputPrice) / wageRate, 2);
  const optimalOutput = 10 * Math.sqrt(optimalLabor);

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cost Curves Viewer</h1>
          <p className="text-gray-600 mt-1">Interactive production function and cost curve analyzer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calculator className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Parameters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Output Price: Rs. {outputPrice.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={outputPrice}
                  onChange={(e) => setOutputPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wage Rate: Rs. {wageRate.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="20000"
                  max="100000"
                  step="5000"
                  value={wageRate}
                  onChange={(e) => setWageRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fixed Capital: {fixedCapital} units
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={fixedCapital}
                  onChange={(e) => setFixedCapital(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rental Rate: Rs. {rentalRate.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="50000"
                  max="200000"
                  step="10000"
                  value={rentalRate}
                  onChange={(e) => setRentalRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Production Function</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-mono text-center text-blue-900 mb-2">Q = 10√L</p>
                <p className="text-xs text-center text-blue-700">K = {fixedCapital} (fixed)</p>
              </div>
            </div>

            <div className="mt-4 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-green-900 mb-2">Optimal Production</h3>
              <div className="text-xs text-green-800 space-y-1">
                <p>Optimal Labor: <span className="font-bold">{optimalLabor.toFixed(1)} workers</span></p>
                <p>Optimal Output: <span className="font-bold">{optimalOutput.toFixed(1)} units</span></p>
                <p className="text-xs mt-2 italic">Where P × MP<sub>L</sub> = w</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Average Cost Curves</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="output" label={{ value: 'Output (Q)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Cost (Rs.)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="AFC" stroke="#4472C4" strokeWidth={2} name="AFC" />
                  <Line type="monotone" dataKey="AVC" stroke="#E26B0A" strokeWidth={2} name="AVC" />
                  <Line type="monotone" dataKey="ATC" stroke="#00AA55" strokeWidth={2} name="ATC" />
                  <Line type="monotone" dataKey="MC" stroke="#DD3333" strokeWidth={2} name="MC" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost Curves</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="output" label={{ value: 'Output (Q)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Cost (Rs.)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="TFC" stroke="#4472C4" strokeWidth={2} name="Total Fixed Cost" />
                  <Line type="monotone" dataKey="TVC" stroke="#E26B0A" strokeWidth={2} name="Total Variable Cost" />
                  <Line type="monotone" dataKey="TC" stroke="#1F4E78" strokeWidth={3} name="Total Cost" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profit Curve</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="labor" label={{ value: 'Labor (L)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Profit (Rs.)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#00AA55" strokeWidth={3} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Key Observations
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• <strong>MC curve intersects AVC and ATC</strong> at their minimum points</p>
                <p>• <strong>AFC continuously declines</strong> as output increases (spreading fixed costs)</p>
                <p>• <strong>AVC is U-shaped</strong> due to diminishing marginal returns</p>
                <p>• <strong>Profit is maximized</strong> where marginal revenue equals marginal cost</p>
                <p>• <strong>With these parameters</strong>, optimal labor is {optimalLabor.toFixed(1)} workers producing {optimalOutput.toFixed(1)} units</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
