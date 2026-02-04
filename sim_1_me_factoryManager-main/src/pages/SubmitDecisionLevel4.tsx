import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Calculator, TrendingDown, CheckCircle, Lock } from 'lucide-react';
import { submitLevel4Decision, checkSubmissionStatus } from '../utils/api';

// Level 4 Parameters
const A = 5;
const alpha = 0.5;
const beta = 0.5;
const K_FIXED = 20;
const outputPrice = 25000;
const wageRate = 60000;
const rentalRate = 120000;
const TFC = rentalRate * K_FIXED;

export const SubmitDecisionLevel4 = () => {
  const [labor, setLabor] = useState<number>(15);
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
      if (status.level4?.submitted) {
        setAlreadySubmitted(true);
        setPreviousResult(status.level4.result);
      }
    } catch (error) {
      console.error('Error checking submission status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Production Calculations
  const output = A * Math.pow(labor, alpha) * Math.pow(K_FIXED, beta);
  const mpL = A * alpha * Math.pow(labor, alpha - 1) * Math.pow(K_FIXED, beta);
  const apL = output / labor;

  // Short-Run Cost Analysis
  const TVC = wageRate * labor;
  const TC = TFC + TVC;
  const AFC = output > 0 ? TFC / output : 0;
  const AVC = output > 0 ? TVC / output : 0;
  const ATC = output > 0 ? TC / output : 0;
  const MC = mpL > 0 ? wageRate / mpL : 0;

  // Revenue & Profit
  const TR = output * outputPrice;
  const profit = TR - TC;

  // Shutdown Decision
  const shutdownRule = outputPrice > AVC ? 'Operate' : 'Shutdown';
  const lossIfOperate = TC > TR ? TC - TR : 0;
  const lossIfShutdown = TFC;
  let bestDecision = '';
  if (outputPrice > AVC) {
    bestDecision = 'Continue Operating';
  } else if (lossIfOperate < lossIfShutdown) {
    bestDecision = 'Continue Operating (smaller loss)';
  } else {
    bestDecision = 'Shutdown';
  }

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

      const result = await submitLevel4Decision({
        playerId: userData?._id || userData?.id || 'anonymous',
        sessionId: 'session-1',
        labor,
        fixedCapital: K_FIXED,
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
      
      setTimeout(() => {
        setSubmitted(false);
        navigate('/submit-decision-level5');
      }, 3000);
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

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
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

  // Already submitted state
  if (alreadySubmitted && previousResult) {
    return (
      <Layout>
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Level 4 - Already Submitted</h1>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-yellow-600 mr-2" />
              <h2 className="text-xl font-bold text-yellow-800">Submission Locked</h2>
            </div>
            <p className="text-yellow-700">
              You have already submitted your decision for Level 4. Each player can only submit once per level.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Previous Submission</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Labor (L)</p>
                <p className="text-xl font-bold text-gray-900">{previousResult.labor as number || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Fixed Capital (K)</p>
                <p className="text-xl font-bold text-gray-900">{previousResult.fixedCapital as number || K_FIXED}</p>
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
            onClick={() => navigate('/submit-decision-level5')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
          >
            Continue to Level 5 →
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Level 4</h1>
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
              <p className="text-2xl font-mono text-center text-blue-900">Q = 5·L^0.5·20^0.5</p>
              <p className="text-sm text-center text-blue-700 mt-2">Short-Run Cobb-Douglas (K fixed at 20)</p>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capital (K):
                </label>
                <input
                  type="text"
                  value={`${K_FIXED} (Fixed)`}
                  disabled
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={alreadySubmitted}
                  className={`w-full font-semibold py-4 rounded-lg transition-colors text-lg ${
                    alreadySubmitted 
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
                  <span>Rental Rate:</span>
                  <span className="font-semibold">Rs. {rentalRate.toLocaleString()}/capital unit</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Fixed Cost (TFC):</span>
                  <span className="font-semibold">{formatCurrency(TFC)}</span>
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
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(TC)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(TR)}</p>
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
                    <span className="text-gray-600">Average Product (AP_L):</span>
                    <span className="font-semibold">{apL.toFixed(4)} units/worker</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">AFC (TFC/Q):</span>
                    <span className="font-semibold">Rs. {AFC.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">AVC (TVC/Q):</span>
                    <span className="font-semibold">Rs. {AVC.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ATC (TC/Q):</span>
                    <span className="font-semibold">Rs. {ATC.toFixed(2)}/unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MC (w/MP_L):</span>
                    <span className="font-semibold">Rs. {MC.toFixed(2)}/unit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-l-4 border-orange-500">
              <div className="flex items-center mb-3">
                <TrendingDown className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-900">Shutdown & Cost Curve Analysis</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-800">Shutdown Rule (P vs AVC):</span>
                  <span className="font-bold text-orange-900">{shutdownRule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Loss if Continue Operating:</span>
                  <span className="font-bold text-orange-900">{formatCurrency(lossIfOperate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Loss if Shutdown:</span>
                  <span className="font-bold text-orange-900">{formatCurrency(lossIfShutdown)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">Best Decision:</span>
                  <span className="font-bold text-orange-900">{bestDecision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">MC vs AVC:</span>
                  <span className="font-bold text-orange-900">{MC > AVC ? 'MC > AVC' : MC < AVC ? 'MC < AVC' : 'MC = AVC'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-800">MC vs ATC:</span>
                  <span className="font-bold text-orange-900">{MC > ATC ? 'MC > ATC' : MC < ATC ? 'MC < ATC' : 'MC = ATC'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
