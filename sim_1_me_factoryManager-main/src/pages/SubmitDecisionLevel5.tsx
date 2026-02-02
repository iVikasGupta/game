import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Calculator, TrendingUp, CheckCircle } from 'lucide-react';

// Plant size options
const plantOptions = [
  { label: 'Small', value: 'S', K: 10, fixedCost: 1000000, bestFor: '< 150 units' },
  { label: 'Medium', value: 'M', K: 25, fixedCost: 2500000, bestFor: '150-400 units' },
  { label: 'Large', value: 'L', K: 50, fixedCost: 5000000, bestFor: '> 400 units' },
];

// Parameters
const A = 5;
const alpha = 0.5;
const beta = 0.5;
const outputPrice = 30000;
const wageRate = 50000;
const rentalRate = 100000; // for reference only
const plantSwitchingCost = 10000000;

export const SubmitDecisionLevel5 = () => {
  const [plantSize, setPlantSize] = useState<'S' | 'M' | 'L'>('S');
  const [labor, setLabor] = useState<number>(20);
  const [submitted, setSubmitted] = useState(false);

  // Get selected plant
  const selectedPlant = plantOptions.find((p) => p.value === plantSize)!;
  const K = selectedPlant.K;
  const TFC = selectedPlant.fixedCost;

  // Output
  const output = A * Math.pow(labor, alpha) * Math.pow(K, beta);

  // Output range check & optimal plant
  let outputRange = '';
  let optimalPlant = '';
  if (output < 150) {
    outputRange = '< 150 units';
    optimalPlant = 'Small';
  } else if (output <= 400) {
    outputRange = '150-400 units';
    optimalPlant = 'Medium';
  } else {
    outputRange = '> 400 units';
    optimalPlant = 'Large';
  }
  const isOptimal = selectedPlant.label === optimalPlant;

  // Short-run cost for chosen plant
  const TVC = wageRate * labor;
  const TC = TFC + TVC;
  const SRAC = output > 0 ? TC / output : 0;

  // Short-run cost for all plants (for LRAC)
  const sracSmall = (() => {
    const k = plantOptions[0].K;
    const tfc = plantOptions[0].fixedCost;
    const q = A * Math.pow(labor, alpha) * Math.pow(k, beta);
    const tvc = wageRate * labor;
    const tc = tfc + tvc;
    return q > 0 ? tc / q : 0;
  })();
  const sracMedium = (() => {
    const k = plantOptions[1].K;
    const tfc = plantOptions[1].fixedCost;
    const q = A * Math.pow(labor, alpha) * Math.pow(k, beta);
    const tvc = wageRate * labor;
    const tc = tfc + tvc;
    return q > 0 ? tc / q : 0;
  })();
  const sracLarge = (() => {
    const k = plantOptions[2].K;
    const tfc = plantOptions[2].fixedCost;
    const q = A * Math.pow(labor, alpha) * Math.pow(k, beta);
    const tvc = wageRate * labor;
    const tc = tfc + tvc;
    return q > 0 ? tc / q : 0;
  })();
  const LRAC = Math.min(sracSmall, sracMedium, sracLarge);
  const optimalPlantAtOutput =
    LRAC === sracSmall ? 'Small' : LRAC === sracMedium ? 'Medium' : 'Large';
  const costDiff = SRAC - LRAC;

  // Revenue & profit
  const totalRevenue = output * outputPrice;
  const profit = totalRevenue - TC;
  // Potential profit with optimal plant
  let optimalTC = 0;
  if (optimalPlantAtOutput === 'Small') {
    optimalTC = plantOptions[0].fixedCost + wageRate * labor;
  } else if (optimalPlantAtOutput === 'Medium') {
    optimalTC = plantOptions[1].fixedCost + wageRate * labor;
  } else {
    optimalTC = plantOptions[2].fixedCost + wageRate * labor;
  }
  const optimalProfit = totalRevenue - optimalTC;
  const profitLost = optimalProfit - profit;

  // MES (Minimum Efficient Scale)
  // For Cobb-Douglas with constant returns, MES is at the lowest LRAC (here, at the output where LRAC is minimized)
  // We'll just show the output range for MES for each plant
  let MES = '';
  if (LRAC === sracSmall) MES = '< 150 units';
  else if (LRAC === sracMedium) MES = '150-400 units';
  else MES = '> 400 units';

  // Economies of scale
  let scaleStatus = '';
  if (SRAC > LRAC) scaleStatus = 'Not at Minimum Efficient Scale (MES)';
  else scaleStatus = 'At MES (Efficient Scale)';

  // Format helpers
  const formatCurrency = (amount: number) => `Rs. ${(amount / 100000).toFixed(2)}L`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    // TODO: Auto-navigate to next level (if any)
  };

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900"> Level 5</h1>
        </div>

        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Decision submitted successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Plant & Labor Choice</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plant Size:</label>
                <div className="flex gap-4">
                  {plantOptions.map((opt) => (
                    <label key={opt.value} className={`px-4 py-2 rounded-lg border cursor-pointer ${plantSize === opt.value ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                      <input
                        type="radio"
                        name="plantSize"
                        value={opt.value}
                        checked={plantSize === opt.value}
                        onChange={() => setPlantSize(opt.value as 'S' | 'M' | 'L')}
                        className="mr-2"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">Switching plant size costs Rs. 1 Cr (one-time)</div>
              </div>
              <div>
                <label htmlFor="labor" className="block text-sm font-semibold text-gray-700 mb-2">
                  Labor (L): {labor}
                </label>
                <input
                  id="labor"
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={labor}
                  onChange={(e) => setLabor(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>25</span>
                  <span>50</span>
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
                  <span>Rental Rate (ref):</span>
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Output Range:</span>
                    <span className="font-semibold">{outputRange}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Optimal Plant for Output:</span>
                    <span className={`font-semibold ${isOptimal ? 'text-green-700' : 'text-orange-700'}`}>{optimalPlant}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Total Cost</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(TC)}</p>
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
                    <span>SRAC (Current):</span>
                    <span className="font-semibold">Rs. {SRAC.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SRAC (Small):</span>
                    <span className="font-semibold">Rs. {sracSmall.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SRAC (Medium):</span>
                    <span className="font-semibold">Rs. {sracMedium.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SRAC (Large):</span>
                    <span className="font-semibold">Rs. {sracLarge.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>LRAC (Min SRAC):</span>
                    <span className="font-semibold text-blue-700">Rs. {LRAC.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Optimal Plant at Output:</span>
                    <span className="font-semibold">{optimalPlantAtOutput}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost of Current vs Optimal:</span>
                    <span className={`font-semibold ${costDiff > 0 ? 'text-orange-700' : 'text-green-700'}`}>{costDiff > 0 ? '+' : ''}{costDiff.toFixed(2)}/unit</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-l-4 border-orange-500">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-900">MES & Scale Analysis</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-800">MES Output Range:</span>
                  <span className="font-bold text-orange-900">{MES}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Your Output vs MES:</span>
                  <span className="font-bold text-orange-900">{outputRange === MES ? 'At MES' : 'Not at MES'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Scale Status:</span>
                  <span className="font-bold text-orange-900">{scaleStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Profit Lost (vs Optimal):</span>
                  <span className="font-bold text-orange-900">{formatCurrency(profitLost)}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 mt-4">
              <h4 className="text-md font-bold mb-2">Rankings (Demo)</h4>
              <div className="text-sm text-gray-600">Output Rank: <span className="font-semibold">-</span></div>
              <div className="text-sm text-gray-600">Profit Rank: <span className="font-semibold">-</span></div>
              <div className="text-sm text-gray-600">Efficiency Rank (LRAC): <span className="font-semibold">-</span></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitDecisionLevel5;
