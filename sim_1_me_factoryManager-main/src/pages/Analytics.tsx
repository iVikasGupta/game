/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getAllPlayerResults } from '../utils/api';
import { TrendingUp, TrendingDown, Target, Award, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

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
  averageTotalCost: number;
  marginalCost: number;
  createdAt: string;
}

export const Analytics = () => {
  const [results, setResults] = useState<NormalizedResult[]>([]);
  const [loading, setLoading] = useState(true);

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
          averageTotalCost: r.output > 0 ? r.totalCost / r.output : 0,
          marginalCost: r.marginalCost || 0,
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
          averageTotalCost: r.averageCost || 0,
          marginalCost: 0,
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
          averageTotalCost: r.averageCost || 0,
          marginalCost: 0,
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
          averageTotalCost: r.ATC || 0,
          marginalCost: r.MC || 0,
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
          averageTotalCost: r.SRAC || 0,
          marginalCost: 0,
          createdAt: r.createdAt,
        });
      });
    }

    // Sort by createdAt ascending (oldest first for trend analysis)
    return allResults.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const userData = storedUser ? JSON.parse(storedUser) : null;
        const playerId = userData?.id || userData?._id || 'anonymous';

        console.log('Analytics - Fetching results for player:', playerId);
        const response = await getAllPlayerResults(playerId);
        console.log('Analytics - API Response:', response);

        if (response && !response.error) {
          const normalizedResults = normalizeResults(response);
          console.log('Analytics - Normalized results:', normalizedResults);
          setResults(normalizedResults);
        }
      } catch (error) {
        console.error('Analytics - Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const profitByRound = results.map((r, idx) => ({
    round: `L${r.level}-${idx + 1}`,
    profit: r.profit,
    level: r.level
  }));

  const efficiencyTrend = results.map((r, idx) => ({
    round: `L${r.level}-${idx + 1}`,
    avgCost: r.averageTotalCost,
    marginalCost: r.marginalCost
  }));

  const laborProductivity = results.map((r, idx) => ({
    round: `L${r.level}-${idx + 1}`,
    labor: r.labor,
    output: r.output,
    productivity: r.labor > 0 ? r.output / r.labor : 0
  }));

  const profitableRounds = results.filter(r => r.profit >= 0).length;
  const unprofitableRounds = results.filter(r => r.profit < 0).length;

  const pieData = [
    { name: 'Profitable', value: profitableRounds, color: '#00AA55' },
    { name: 'Loss', value: unprofitableRounds, color: '#DD3333' }
  ];

  const bestRound = results.length > 0 ? results.reduce((best, current) =>
    current.profit > (best?.profit || -Infinity) ? current : best
    , results[0]) : null;

  const worstRound = results.length > 0 ? results.reduce((worst, current) =>
    current.profit < (worst?.profit || Infinity) ? current : worst
    , results[0]) : null;

  // Calculate totals
  const totalOutput = results.reduce((sum, r) => sum + r.output, 0);
  const totalProfit = results.reduce((sum, r) => sum + r.profit, 0);
  const avgCostPerUnit = results.length > 0
    ? results.reduce((sum, r) => sum + r.averageTotalCost, 0) / results.length
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed performance metrics and trends</p>
        </div>

        {results.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <p className="text-blue-700">No data available yet. Complete some rounds to see analytics.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Level Completed</span>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{results.length}</div>
                <div className="text-sm text-gray-500 mt-1">Total Level</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Success Rate</span>
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {((profitableRounds / results.length) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">{profitableRounds} profitable Level</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Best Level</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(bestRound?.profit || 0)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {bestRound ? `Level ${results.indexOf(bestRound) + 1}` : 'N/A'}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Worst Level</span>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(worstRound?.profit || 0)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {worstRound ? `Level ${results.indexOf(worstRound) + 1}` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profit Trend Analysis</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitByRound}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="profit" fill="#4472C4" name="Profit (Rs.)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Efficiency Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={efficiencyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgCost" stroke="#00AA55" strokeWidth={2} name="Avg Total Cost" />
                    <Line type="monotone" dataKey="marginalCost" stroke="#E26B0A" strokeWidth={2} name="Marginal Cost" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Labor Productivity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={laborProductivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="productivity" stroke="#4472C4" strokeWidth={2} name="Output per Worker" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profit Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <p className="font-semibold mb-1">Learning Progress</p>
                  <p>You've completed {results.length} levels with a {((profitableRounds / results.length) * 100).toFixed(0)}% success rate.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Cost Management</p>
                  <p>Average cost per unit: Rs. {avgCostPerUnit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Production Efficiency</p>
                  <p>Total output produced: {totalOutput.toFixed(0)} units</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Financial Performance</p>
                  <p>Cumulative profit: {formatCurrency(totalProfit)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
