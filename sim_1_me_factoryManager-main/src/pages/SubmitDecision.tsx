import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { getCurrentRound } from '../data/dummyData';
import {
  calculateOutputLevel1,
  calculateCostsLevel1,
  calculateOptimalLaborLevel1
} from '../utils/productionFunctions';
import { submitLevel1Decision, checkSubmissionStatus } from '../utils/api';
import { Calculator, TrendingDown, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SubmitDecision = () => {
  const currentRound = getCurrentRound() || {
    id: 'demo-round',
    session_id: 'session-1',
    level: 1,
    round_number: 3,
    production_function: 'single-input' as const,
    param_a: null,
    param_alpha: null,
    param_beta: null,
    fixed_capital: 10,
    output_price: 22000,
    wage_rate: 55000,
    rental_rate: 100000,
    fixed_cost: 0,
    status: 'open' as const,
    deadline: '2024-12-31T23:59:59'
  };
  const [labor, setLabor] = useState<number>(4);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [previousResult, setPreviousResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingSubmission();
  }, []);

  const checkExistingSubmission = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setLoading(false);
        return;
      }
      
      const userData = JSON.parse(storedUser);
      const playerId = userData._id || userData.id;
      
      if (!playerId) {
        setLoading(false);
        return;
      }

      const status = await checkSubmissionStatus(playerId);
      if (status.level1?.submitted) {
        setAlreadySubmitted(true);
        setPreviousResult(status.level1.result);
      }
    } catch (error) {
      console.error('Error checking submission status:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimates = () => {
    if (!currentRound || labor <= 0) {
      return {
        output: 0,
        cost: 0,
        revenue: 0,
        profit: 0,
        mpL: 0,
        avc: 0,
        mc: 0
      };
    }

    const production = calculateOutputLevel1(labor, currentRound.fixed_capital || 10);
    const costs = calculateCostsLevel1(labor, production.output, currentRound.wage_rate);
    const revenue = production.output * currentRound.output_price;
    const profit = revenue - costs.totalCost;

    return {
      output: production.output,
      cost: costs.totalCost,
      revenue,
      profit,
      mpL: costs.marginalProductLabor || 0,
      avc: costs.averageVariableCost || 0,
      mc: costs.marginalCost || 0
    };
  };

  const estimates = calculateEstimates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (alreadySubmitted) {
      alert('You have already submitted for this level!');
      return;
    }

    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const playerId = userData?._id || userData?.id;

      if (!playerId) {
        alert('Please login to submit your decision');
        return;
      }

      // Submit to backend
      const response = await submitLevel1Decision({
        playerId,
        sessionId: currentRound.session_id,
        labor,
        fixedCapital: currentRound.fixed_capital || 10,
        wageRate: currentRound.wage_rate,
        outputPrice: currentRound.output_price,
      });

      if (response.alreadySubmitted) {
        setAlreadySubmitted(true);
        setPreviousResult(response.result);
        alert(response.error);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        navigate('/submit-decision-level2');
      }, 2000);
    } catch (error) {
      console.error('Error submitting decision:', error);
      alert('Failed to submit decision. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const optimalLabor = currentRound
    ? calculateOptimalLaborLevel1(currentRound.output_price, currentRound.wage_rate)
    : null;

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (alreadySubmitted && previousResult) {
    return (
      <Layout>
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Level 1</h1>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-6">
            <div className="flex items-center">
              <Lock className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">Already Submitted</h3>
                <p className="text-yellow-700 mt-1">
                  You have already submitted your decision for Level 1. Only one submission per level is allowed.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Submission</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">Labor</p>
                <p className="text-lg font-bold text-gray-900">{previousResult.labor} workers</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">Output</p>
                <p className="text-lg font-bold text-gray-900">{previousResult.output?.toFixed(2)} units</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">Total Cost</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(previousResult.totalCost || 0)}</p>
              </div>
              <div className={`p-4 rounded-lg ${previousResult.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-xs text-gray-600">Profit</p>
                <p className={`text-lg font-bold ${previousResult.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(previousResult.profit || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/submit-decision-level2')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
            >
              Continue to Level 2 →
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Level 1</h1>
          {/* <p className="text-gray-600 mt-1">Level {currentRound?.level || 1} </p> */}
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
              <p className="text-2xl font-mono text-center text-blue-900">Q = 10√L</p>
              <p className="text-sm text-center text-blue-700 mt-2">Single Input Production Function</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="labor" className="block text-sm font-semibold text-gray-700 mb-2">
                  Labor (Number of Workers): {labor}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capital (Fixed)
                </label>
                <input
                  type="text"
                  value={`${currentRound.fixed_capital || 10} units`}
                  disabled
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                />
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
                  <span className="font-semibold">Rs. {currentRound.output_price.toLocaleString()}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span>Wage Rate:</span>
                  <span className="font-semibold">Rs. {currentRound.wage_rate.toLocaleString()}/worker</span>
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
                  <p className="text-3xl font-bold text-blue-900">{estimates.output.toFixed(2)} units</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Total Cost</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(estimates.cost)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(estimates.revenue)}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${estimates.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm text-gray-600">Estimated Profit</p>
                  <p className={`text-3xl font-bold ${estimates.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(estimates.profit)}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Marginal Product (MP<sub>L</sub>):</span>
                    <span className="font-semibold">{estimates.mpL.toFixed(4)} units/worker</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Variable Cost (AVC):</span>
                    <span className="font-semibold">Rs. {estimates.avc.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Marginal Cost (MC):</span>
                    <span className="font-semibold">Rs. {estimates.mc.toFixed(2)}/unit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-l-4 border-orange-500">
              <div className="flex items-center mb-3">
                <TrendingDown className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-900">Strategy Helper</h3>
              </div>
              {optimalLabor && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-orange-800">Optimal Labor:</span>
                    <span className="font-bold text-orange-900">{optimalLabor.optimalLabor.toFixed(1)} workers</span>
                  </div>
                  <div className="text-orange-700 text-xs mt-3">
                    <p className="font-semibold mb-1">Optimization Rule:</p>
                    <p className="font-mono">{optimalLabor.condition}</p>
                  </div>
                  {labor > 0 && (
                    <div className={`mt-3 p-2 rounded ${Math.abs(labor - optimalLabor.optimalLabor) < 5
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      <p className="text-xs font-semibold">
                        {Math.abs(labor - optimalLabor.optimalLabor) < 5
                          ? 'Near optimal labor level!'
                          : 'Consider adjusting labor closer to optimal'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
