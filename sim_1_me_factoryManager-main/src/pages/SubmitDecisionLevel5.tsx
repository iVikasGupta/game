import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Calculator, TrendingUp, CheckCircle, Lock, Trophy } from 'lucide-react';
import { submitLevel5Decision, checkSubmissionStatus } from '../utils/api';

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

export const SubmitDecisionLevel5 = () => {
  const [plantSize, setPlantSize] = useState<'S' | 'M' | 'L'>('S');
  const [labor, setLabor] = useState<number>(20);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [previousResult, setPreviousResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    checkExistingSubmission();
  }, [navigate]);

  const checkExistingSubmission = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const userData = JSON.parse(storedUser);
      const playerId = userData._id || userData.id;

      if (!playerId) return;

      const status = await checkSubmissionStatus(playerId);
      if (status.level5?.submitted) {
        setAlreadySubmitted(true);
        setPreviousResult(status.level5.result);
      }
    } catch (error) {
      console.error('Error checking submission status:', error);
    } finally {
      setLoading(false);
    }
  };

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
  let optimalPlantAtOutput = '';
  if (Math.abs(LRAC - sracSmall) < 0.001) {
    optimalPlantAtOutput = 'Small';
  } else if (Math.abs(LRAC - sracMedium) < 0.001) {
    optimalPlantAtOutput = 'Medium';
  } else {
    optimalPlantAtOutput = 'Large';
  }
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
  let MES = '';
  if (Math.abs(LRAC - sracSmall) < 0.001) MES = '< 150 units';
  else if (Math.abs(LRAC - sracMedium) < 0.001) MES = '150-400 units';
  else MES = '> 400 units';

  // Economies of scale
  let scaleStatus = '';
  if (SRAC > LRAC) scaleStatus = 'Not at Minimum Efficient Scale (MES)';
  else scaleStatus = 'At MES (Efficient Scale)';

  // Calculate minimum labor needed for selected plant to reach recommended output range
  const minLaborForOptimal = (() => {
    // Determine the minimum output for the selected plant's optimal range
    let minOutput = 0;
    if (selectedPlant.label === 'Small') minOutput = 100; // Aim for low end of "< 150"
    else if (selectedPlant.label === 'Medium') minOutput = 200; // Aim for low end of "150-400"
    else minOutput = 450; // Aim for low end of "> 400"

    // Q = 5 * L^0.5 * K^0.5
    // L = (Q / (5 * K^0.5))^2
    const k = selectedPlant.K;
    const minL = Math.pow(minOutput / (A * Math.pow(k, beta)), 2 / alpha);
    return Math.ceil(minL);
  })();

  // Format helpers
  const formatCurrency = (amount: number) => `Rs. ${(amount / 100000).toFixed(2)}L`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent resubmission
    if (alreadySubmitted) {
      alert('You have already submitted for this level!');
      return;
    }

    setSubmitted(true);

    try {
      const storedUser = localStorage.getItem('user');
      const userData = storedUser ? JSON.parse(storedUser) : null;

      const result = await submitLevel5Decision({
        playerId: userData?._id || userData?.id || 'anonymous',
        sessionId: 'session-1',
        plantSize,
        labor,
        wageRate,
        rentalRate,
        outputPrice,
        A,
        alpha,
        beta,
      });

      // Check if submission was blocked due to existing submission
      if (result.alreadySubmitted) {
        setAlreadySubmitted(true);
        setPreviousResult(result.result || result);
        alert('You have already submitted for this level!');
        return;
      }

      // All levels completed - navigate to leaderboard
      setTimeout(() => {
        setSubmitted(false);
        navigate('/leaderboard');
      }, 2000);
    } catch (error: unknown) {
      console.error('Error submitting decision:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { alreadySubmitted?: boolean } } };
        if (axiosError.response?.data?.alreadySubmitted) {
          setAlreadySubmitted(true);
          alert('You have already submitted for this level!');
        }
      }
      setSubmitted(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Already submitted state - show completion message
  if (alreadySubmitted && previousResult) {
    return (
      <Layout>
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Level 5 - Already Submitted</h1>
            <p className="text-gray-600 mt-2">You have completed all levels!</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-yellow-600 mr-2" />
              <h2 className="text-xl font-bold text-yellow-800">Submission Locked</h2>
            </div>
            <p className="text-yellow-700">
              You have already submitted your decision for Level 5. Each player can only submit once per level.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Previous Submission</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Plant Size</p>
                <p className="text-xl font-bold text-gray-900">{previousResult.plantSize as string || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Labor (L)</p>
                <p className="text-xl font-bold text-gray-900">{previousResult.labor as number || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Output</p>
                <p className="text-xl font-bold text-gray-900">{(previousResult.output as number)?.toFixed(2) || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(previousResult.totalCost as number || 0)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(previousResult.totalRevenue as number || 0)}</p>
              </div>
              <div className={`p-4 rounded-lg ${(previousResult.profit as number) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600">Profit</p>
                <p className={`text-xl font-bold ${(previousResult.profit as number) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(previousResult.profit as number || 0)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
          >
            View Leaderboard →
          </button>
        </div>
      </Layout>
    );
  }

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
                  max="150"
                  step="1"
                  value={labor}
                  onChange={(e) => setLabor(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                  <span>125</span>
                  <span>150</span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={alreadySubmitted}
                  className={`w-full font-semibold py-4 rounded-lg transition-colors text-lg ${alreadySubmitted
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {alreadySubmitted ? 'Already Submitted' : 'Submit Decision'}
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
                  <div className="flex justify-between text-sm mb-3">
                    <span>Output Range:</span>
                    <span className="font-semibold">{outputRange}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span>Recommended Plant Size:</span>
                    <span className={`font-semibold ${isOptimal ? 'text-green-700' : 'text-orange-700'}`}>{optimalPlant}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Your Selection:</span>
                    <span className="font-semibold text-blue-700">{selectedPlant.label}</span>
                  </div>
                  <div className={`mt-2 p-2 rounded text-xs ${isOptimal ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {isOptimal ? '✓ You selected the optimal plant size!' : `⚠ Your ${selectedPlant.label} plant needs L ≥ ${minLaborForOptimal} for recommended output`}
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
