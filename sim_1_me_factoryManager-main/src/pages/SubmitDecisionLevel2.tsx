import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Calculator, TrendingDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Cobb-Douglas parameters for Level 2
const A = 5;
const alpha = 0.5;
const beta = 0.5;
const outputPrice = 20000;
const wageRate = 50000;
const rentalRate = 100000;

export const SubmitDecisionLevel2 = () => {
  const [labor, setLabor] = useState<number>(10);
  const [capital, setCapital] = useState<number>(10);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Restore user from localStorage to prevent logout on navigation
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    }
  }, [navigate]);

  // Cobb-Douglas Output
  const output = A * Math.pow(labor, alpha) * Math.pow(capital, beta);
  // Marginal Products
  const mpL = A * alpha * Math.pow(labor, alpha - 1) * Math.pow(capital, beta);
  const mpK = A * beta * Math.pow(labor, alpha) * Math.pow(capital, beta - 1);
  // MRTS
  const mrts = mpL / mpK;
  // Input Ratio
  const inputRatio = capital / labor;
  // Costs
  const laborCost = wageRate * labor;
  const capitalCost = rentalRate * capital;
  const totalCost = laborCost + capitalCost;
  const averageCost = output > 0 ? totalCost / output : 0;
  // Revenue & Profit
  const totalRevenue = output * outputPrice;
  const profit = totalRevenue - totalCost;
  // Optimality
  const optimalMRTS = wageRate / rentalRate;
  const isOptimal = Math.abs(mrts - optimalMRTS) < 0.01;
  const isocostSlope = -wageRate / rentalRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      navigate('/submit-decision-level3');
    }, 3000);
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Level 2</h1>
        </div>

        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Decision submitted successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Production Function</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-2xl font-mono text-center text-blue-900">Q = 5·L^0.5·K^0.5</p>
              <p className="text-sm text-center text-blue-700 mt-2">Cobb-Douglas Production Function</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="labor" className="block text-sm font-semibold text-gray-700 mb-2">
                  Labor (L): {labor}
                </label>
                <input
                  id="labor"
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={labor}
                  onChange={(e) => setLabor(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <label htmlFor="capital" className="block text-sm font-semibold text-gray-700 mb-2">
                  Capital (K): {capital}
                </label>
                <input
                  id="capital"
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={capital}
                  onChange={(e) => setCapital(parseInt(e.target.value))}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
                >
                  Submit Decision
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Output Price:</span>
                  <span className="font-semibold">Rs. {outputPrice.toLocaleString()}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span>Wage Rate:</span>
                  <span className="font-semibold">Rs. {wageRate.toLocaleString()}/worker</span>
                </div>
                <div className="flex justify-between">
                  <span>Rental Rate:</span>
                  <span className="font-semibold">Rs. {rentalRate.toLocaleString()}/capital unit</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Calculator className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Live Calculator</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Estimated Output</p>
                  <p className="text-3xl font-bold text-blue-900">{output.toFixed(2)} units</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Total Cost</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600">Estimated Profit</p>
                  <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(profit)}</p>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Marginal Product (MP_L):</span>
                    <span className="font-semibold">{mpL.toFixed(4)} units/worker</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Marginal Product (MP_K):</span>
                    <span className="font-semibold">{mpK.toFixed(4)} units/capital</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MRTS (MP_L/MP_K):</span>
                    <span className="font-semibold">{mrts.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Input Ratio (K/L):</span>
                    <span className="font-semibold">{inputRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Cost (AC):</span>
                    <span className="font-semibold">Rs. {averageCost.toFixed(2)}/unit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-l-4 border-orange-500">
              <div className="flex items-center mb-3">
                <TrendingDown className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-900">Strategy Helper</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-800">MRTS:</span>
                  <span className="font-bold text-orange-900">{mrts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Optimal MRTS (w/r):</span>
                  <span className="font-bold text-orange-900">{optimalMRTS.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Isocost Line Slope (-w/r):</span>
                  <span className="font-bold text-orange-900">{isocostSlope.toFixed(2)}</span>
                </div>
                <div className={`mt-3 p-2 rounded ${isOptimal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <p className="text-xs font-semibold">
                    {isOptimal ? 'You are at the optimal input mix!' : 'Consider adjusting L and K to reach optimal MRTS.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
