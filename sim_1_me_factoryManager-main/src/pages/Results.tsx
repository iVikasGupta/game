/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getAllPlayerResults } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Award, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

// Interface for normalized result display
interface NormalizedResult {
  id: string;
  level: number;
  labor: number;
  capital: number;
  output: number;
  profit: number;
  totalCost: number;
  totalRevenue: number;
  totalFixedCost: number;
  totalVariableCost: number;
  averageTotalCost: number;
  averageVariableCost: number;
  averageFixedCost: number;
  marginalCost: number;
  marginalProductLabor: number;
  createdAt: string;
}

export const Results = () => {
  const [results, setResults] = useState<NormalizedResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<NormalizedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');

  // Normalize results from different levels to a common format
  const normalizeResults = (data: Record<string, any[]>): NormalizedResult[] => {
    const allResults: NormalizedResult[] = [];

    // Level 1 results
    if (data.level1 && Array.isArray(data.level1)) {
      data.level1.forEach((r: any) => {
        allResults.push({
          id: r._id,
          level: 1,
          labor: r.labor,
          capital: r.fixedCapital || 10,
          output: r.output,
          profit: r.profit,
          totalCost: r.totalCost,
          totalRevenue: r.totalRevenue,
          totalFixedCost: 0,
          totalVariableCost: r.totalCost,
          averageTotalCost: r.output > 0 ? r.totalCost / r.output : 0,
          averageVariableCost: r.averageVariableCost || 0,
          averageFixedCost: 0,
          marginalCost: r.marginalCost || 0,
          marginalProductLabor: r.marginalProductLabor || 0,
          createdAt: r.createdAt,
        });
      });
    }

    // Level 2 results
    if (data.level2 && Array.isArray(data.level2)) {
      data.level2.forEach((r: any) => {
        allResults.push({
          id: r._id,
          level: 2,
          labor: r.labor,
          capital: r.capital,
          output: r.output,
          profit: r.profit,
          totalCost: r.totalCost,
          totalRevenue: r.totalRevenue,
          totalFixedCost: 0,
          totalVariableCost: r.totalCost,
          averageTotalCost: r.averageCost || 0,
          averageVariableCost: r.averageCost || 0,
          averageFixedCost: 0,
          marginalCost: 0,
          marginalProductLabor: r.mpL || 0,
          createdAt: r.createdAt,
        });
      });
    }

    // Level 3 results
    if (data.level3 && Array.isArray(data.level3)) {
      data.level3.forEach((r: any) => {
        allResults.push({
          id: r._id,
          level: 3,
          labor: r.labor,
          capital: r.capital,
          output: r.output,
          profit: r.profit,
          totalCost: r.totalCost,
          totalRevenue: r.totalRevenue,
          totalFixedCost: 0,
          totalVariableCost: r.totalCost,
          averageTotalCost: r.averageCost || 0,
          averageVariableCost: r.averageCost || 0,
          averageFixedCost: 0,
          marginalCost: 0,
          marginalProductLabor: r.mpL || 0,
          createdAt: r.createdAt,
        });
      });
    }

    // Level 4 results
    if (data.level4 && Array.isArray(data.level4)) {
      data.level4.forEach((r: any) => {
        allResults.push({
          id: r._id,
          level: 4,
          labor: r.labor,
          capital: r.fixedCapital || 20,
          output: r.output,
          profit: r.profit,
          totalCost: r.TC,
          totalRevenue: r.totalRevenue,
          totalFixedCost: r.TFC || 0,
          totalVariableCost: r.TVC || 0,
          averageTotalCost: r.ATC || 0,
          averageVariableCost: r.AVC || 0,
          averageFixedCost: r.AFC || 0,
          marginalCost: r.MC || 0,
          marginalProductLabor: r.mpL || 0,
          createdAt: r.createdAt,
        });
      });
    }

    // Level 5 results
    if (data.level5 && Array.isArray(data.level5)) {
      data.level5.forEach((r: any) => {
        allResults.push({
          id: r._id,
          level: 5,
          labor: r.labor,
          capital: r.capital || 0,
          output: r.output,
          profit: r.profit,
          totalCost: r.TC,
          totalRevenue: r.totalRevenue,
          totalFixedCost: r.TFC || 0,
          totalVariableCost: r.TVC || 0,
          averageTotalCost: r.SRAC || 0,
          averageVariableCost: r.output > 0 ? (r.TVC || 0) / r.output : 0,
          averageFixedCost: r.output > 0 ? (r.TFC || 0) / r.output : 0,
          marginalCost: 0,
          marginalProductLabor: 0,
          createdAt: r.createdAt,
        });
      });
    }

    // Sort by createdAt descending (newest first)
    return allResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        const userData = storedUser ? JSON.parse(storedUser) : null;
        const playerId = userData?.id || userData?._id || 'anonymous';

        console.log('Fetching results for player:', playerId);
        const response = await getAllPlayerResults(playerId);
        console.log('API Response:', response);

        if (response && !response.error) {
          const normalizedResults = normalizeResults(response);
          console.log('Normalized results:', normalizedResults);
          setResults(normalizedResults);
          if (normalizedResults.length > 0) {
            setSelectedResult(normalizedResults[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Filter results by level
  const filteredResults = selectedLevel === 'all'
    ? results
    : results.filter(r => r.level === selectedLevel);

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const generateCostCurveData = () => {
    if (!selectedResult) return [];

    const data = [];
    const maxOutput = selectedResult.output * 1.5;

    for (let q = 10; q <= maxOutput; q += 5) {
      const tfc = selectedResult.totalFixedCost;
      const avcAtActual = selectedResult.averageVariableCost;
      const outputActual = selectedResult.output;

      const tvc = outputActual > 0 ? (avcAtActual * q * q) / outputActual : 0;
      const tc = tfc + tvc;

      const afc = q > 0 ? tfc / q : 0;
      const avc = q > 0 ? tvc / q : 0;
      const atc = q > 0 ? tc / q : 0;

      data.push({
        output: q,
        AFC: afc,
        AVC: avc,
        ATC: atc,
        MC: selectedResult.marginalCost
      });
    }

    return data;
  };

  const costCurveData = selectedResult ? generateCostCurveData() : [];

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading results...</span>
        </div>
      </Layout>
    );
  }

  if (filteredResults.length === 0) {
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Level Results</h1>
            <p className="text-gray-600 mt-1">Detailed performance and cost analysis</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-4 py-2 rounded-lg ${selectedLevel === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg ${selectedLevel === level ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                L{level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {filteredResults.slice(0, 8).map((result) => (
            <button
              key={result.id}
              onClick={() => setSelectedResult(result)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${selectedResult?.id === result.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
            >
              <div className="text-sm font-semibold text-gray-900">
                Level {result.level}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(result.createdAt).toLocaleDateString()}
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
                <div className="text-sm text-gray-600 mt-1">Level {selectedResult.level}</div>
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
                <div className="text-sm text-gray-600 mt-1">Revenue: {formatCurrency(selectedResult.totalRevenue)}</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Avg Total Cost</span>
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  Rs. {selectedResult.averageTotalCost.toFixed(2)}/unit
                </div>
                <div className="text-sm text-gray-600 mt-1">Total: {formatCurrency(selectedResult.totalCost)}</div>
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
                    <span className="font-semibold">{selectedResult.marginalProductLabor.toFixed(4)} units/worker</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Marginal Cost:</span>
                    <span className="font-semibold">Rs. {selectedResult.marginalCost.toFixed(2)}/unit</span>
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
                    {selectedResult.totalFixedCost > 0 && (
                      <tr className="border-b border-gray-100">
                        <td className="py-3">Fixed Cost</td>
                        <td className="text-right font-semibold">{formatCurrency(selectedResult.totalFixedCost)}</td>
                        <td className="text-right">
                          Rs. {selectedResult.averageFixedCost.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Variable Cost</td>
                      <td className="text-right font-semibold">{formatCurrency(selectedResult.totalVariableCost)}</td>
                      <td className="text-right">Rs. {selectedResult.averageVariableCost.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 font-semibold">Total Cost</td>
                      <td className="text-right font-bold">{formatCurrency(selectedResult.totalCost)}</td>
                      <td className="text-right font-bold">Rs. {selectedResult.averageTotalCost.toFixed(2)}</td>
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
                  {selectedResult.totalFixedCost > 0 && (
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
                {selectedResult.marginalProductLabor > 0 && (
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                    <span>MP<sub>L</sub> of {selectedResult.marginalProductLabor.toFixed(2)} shows your marginal productivity level.</span>
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
