import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { getUserResults, getCurrentPlayer, dummyResults } from '../data/dummyData';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export const Analytics = () => {
  const { userProfile } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    const userId = userProfile?.id || 'user-1';
    console.log('Analytics - User ID:', userId);
    console.log('Analytics - All dummy results:', dummyResults);
    let userResults = getUserResults(userId);
    console.log('Analytics - Filtered results:', userResults);

    // Fallback: if no results, use all dummy results for user-1
    if (userResults.length === 0 && userId === 'user-1') {
      console.log('Analytics - Using fallback: all dummyResults');
      userResults = dummyResults;
    }

    console.log('Analytics - Final results count:', userResults.length);
    setResults(userResults);
    const currentPlayer = getCurrentPlayer(userId);
    setPlayer(currentPlayer);
  }, [userProfile]);

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const profitByRound = results.map((r, idx) => ({
    round: `R${idx + 1}`,
    profit: r.profit,
    efficiency: r.efficiency_rank
  }));

  const efficiencyTrend = results.map((r, idx) => ({
    round: `R${idx + 1}`,
    avgCost: r.average_total_cost,
    marginalCost: r.marginal_cost
  }));

  const laborProductivity = results.map((r, idx) => ({
    round: `R${idx + 1}`,
    labor: r.labor,
    output: r.output,
    productivity: r.output / r.labor
  }));

  const profitableRounds = results.filter(r => r.profit >= 0).length;
  const unprofitableRounds = results.filter(r => r.profit < 0).length;

  const pieData = [
    { name: 'Profitable', value: profitableRounds, color: '#00AA55' },
    { name: 'Loss', value: unprofitableRounds, color: '#DD3333' }
  ];

  const bestRound = results.reduce((best, current) =>
    current.profit > (best?.profit || -Infinity) ? current : best
  , results[0]);

  const worstRound = results.reduce((worst, current) =>
    current.profit < (worst?.profit || Infinity) ? current : worst
  , results[0]);

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
                  <span className="text-sm font-medium text-gray-600">Rounds Completed</span>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{results.length}</div>
                <div className="text-sm text-gray-500 mt-1">Total rounds</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Success Rate</span>
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {((profitableRounds / results.length) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">{profitableRounds} profitable rounds</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Best Round</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(bestRound?.profit || 0)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Round {results.indexOf(bestRound) + 1}</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Worst Round</span>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(worstRound?.profit || 0)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Round {results.indexOf(worstRound) + 1}</div>
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
                  <p>You've completed {results.length} rounds with a {((profitableRounds / results.length) * 100).toFixed(0)}% success rate.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Cost Management</p>
                  <p>Average cost per unit: Rs. {player?.average_cost_per_unit.toFixed(0)}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Production Efficiency</p>
                  <p>Total output produced: {player?.total_output.toFixed(0)} units</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Financial Performance</p>
                  <p>Cumulative profit: {formatCurrency(player?.cumulative_profit || 0)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
