import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { getUserResults, dummyResults } from '../data/dummyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Award, CheckCircle, AlertTriangle } from 'lucide-react';

export const Results = () => {
  const { userProfile } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  useEffect(() => {
    const userId = userProfile?.id || 'user-1';
    console.log('Results - User ID:', userId);
    console.log('Results - All dummy results:', dummyResults);
    let userResults = getUserResults(userId);
    console.log('Results - Filtered results:', userResults);

    // Fallback: if no results, use all dummy results for user-1
    if (userResults.length === 0 && userId === 'user-1') {
      console.log('Results - Using fallback: all dummyResults');
      userResults = dummyResults;
    }

    console.log('Results - Final results count:', userResults.length);
    setResults(userResults);
    if (userResults.length > 0) {
      setSelectedResult(userResults[userResults.length - 1]);
    }
  }, [userProfile]);

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const generateCostCurveData = () => {
    if (!selectedResult) return [];

    const data = [];
    const maxOutput = selectedResult.output * 1.5;

    for (let q = 10; q <= maxOutput; q += 5) {
      const tfc = selectedResult.total_fixed_cost;
      const avcAtActual = selectedResult.average_variable_cost;
      const outputActual = selectedResult.output;

      const tvc = (avcAtActual * q * q) / outputActual;
      const tc = tfc + tvc;

      const afc = q > 0 ? tfc / q : 0;
      const avc = q > 0 ? tvc / q : 0;
      const atc = q > 0 ? tc / q : 0;

      data.push({
        output: q,
        AFC: afc,
        AVC: avc,
        ATC: atc,
        MC: selectedResult.marginal_cost
      });
    }

    return data;
  };

  const costCurveData = selectedResult ? generateCostCurveData() : [];

  if (results.length === 0) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">No Results Yet</h3>
            <p className="text-blue-700 mt-1">Submit decisions to see your results here.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Round Results</h1>
          <p className="text-gray-600 mt-1">Detailed performance and cost analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {results.slice(-4).map((result) => (
            <button
              key={result.id}
              onClick={() => setSelectedResult(result)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedResult?.id === result.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="text-sm font-semibold text-gray-900">
                Level {result.rounds?.level} - Round {result.rounds?.round_number}
              </div>
              <div className={`text-lg font-bold mt-1 ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(result.profit)}
              </div>
            </button>
          ))}
        </div>

        {selectedResult && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Output</span>
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{selectedResult.output.toFixed(2)} units</div>
                <div className="text-sm text-gray-600 mt-1">Rank: #{selectedResult.output_rank}</div>
              </div>

              <div className={`rounded-xl shadow-md p-6 ${selectedResult.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Profit</span>
                  {selectedResult.profit >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className={`text-3xl font-bold ${selectedResult.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(selectedResult.profit)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Rank: #{selectedResult.profit_rank}</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Avg Total Cost</span>
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  Rs. {selectedResult.average_total_cost.toFixed(2)}/unit
                </div>
                <div className="text-sm text-gray-600 mt-1">Rank: #{selectedResult.efficiency_rank}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Production Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Labor Used:</span>
                    <span className="font-semibold">{selectedResult.labor} workers</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Capital Used:</span>
                    <span className="font-semibold">{selectedResult.capital} units</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Marginal Product (Labor):</span>
                    <span className="font-semibold">{selectedResult.marginal_product_labor.toFixed(4)} units/worker</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Marginal Cost:</span>
                    <span className="font-semibold">Rs. {selectedResult.marginal_cost.toFixed(2)}/unit</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Breakdown</h2>
                <table className="w-full">
                  <thead className="text-sm text-gray-600 border-b">
                    <tr>
                      <th className="text-left pb-2">Component</th>
                      <th className="text-right pb-2">Total</th>
                      <th className="text-right pb-2">Per Unit</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {selectedResult.total_fixed_cost > 0 && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3">Fixed Cost</td>
                        <td className="text-right font-semibold">{formatCurrency(selectedResult.total_fixed_cost)}</td>
                        <td className="text-right">
                          {selectedResult.average_fixed_cost
                            ? `Rs. ${selectedResult.average_fixed_cost.toFixed(2)}`
                            : '-'}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Variable Cost</td>
                      <td className="text-right font-semibold">{formatCurrency(selectedResult.total_variable_cost)}</td>
                      <td className="text-right">Rs. {selectedResult.average_variable_cost.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 font-semibold">Total Cost</td>
                      <td className="text-right font-bold">{formatCurrency(selectedResult.total_cost)}</td>
                      <td className="text-right font-bold">Rs. {selectedResult.average_total_cost.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Curves</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={costCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="output" label={{ value: 'Output (Q)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Cost (Rs.)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ATC" stroke="#00AA55" strokeWidth={2} name="ATC" />
                  <Line type="monotone" dataKey="AVC" stroke="#E26B0A" strokeWidth={2} name="AVC" />
                  <Line type="monotone" dataKey="MC" stroke="#DD3333" strokeWidth={2} name="MC" />
                  {selectedResult.total_fixed_cost > 0 && (
                    <Line type="monotone" dataKey="AFC" stroke="#4472C4" strokeWidth={2} name="AFC" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Learning Insights
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                {selectedResult.profit >= 0 ? (
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                    <span>Positive profit achieved - excellent cost management!</span>
                  </p>
                ) : (
                  <p className="flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-yellow-600" />
                    <span>Negative profit - review input levels for better cost efficiency.</span>
                  </p>
                )}
                <p className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                  <span>MP<sub>L</sub> of {selectedResult.marginal_product_labor.toFixed(2)} shows your marginal productivity level.</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
