import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { getCurrentPlayer, getUserResults } from '../data/dummyData';
import { DollarSign, TrendingUp, Package, Award, Factory } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const Dashboard = () => {
  const { userProfile } = useAuth();
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (userProfile) {
      const player = getCurrentPlayer(userProfile.id);
      setCurrentPlayer(player);

      const userResults = getUserResults(userProfile.id);
      setResults(userResults);
    } else {
      const player = getCurrentPlayer('user-1');
      setCurrentPlayer(player);

      const userResults = getUserResults('user-1');
      setResults(userResults);
    }
  }, [userProfile]);

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const chartData = results.map((result, index) => ({
    round: `R${index + 1}`,
    profit: result.profit,
    output: result.output,
    avgCost: result.average_total_cost
  }));

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userProfile?.full_name}</p>
        </div>

        {!currentPlayer ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <div className="flex items-center">
              <Factory className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Welcome to Factory Manager!</h3>
                <p className="text-blue-700 mt-1">
                  You're viewing demo data. Explore all features including decision submission, results analysis, and leaderboard.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Budget</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(currentPlayer.current_budget)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Started with {formatCurrency(currentPlayer.starting_budget)}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cumulative Profit</p>
                    <p className={`text-2xl font-bold mt-1 ${currentPlayer.cumulative_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(currentPlayer.cumulative_profit)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Over {currentPlayer.rounds_completed} rounds
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Output</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {currentPlayer.total_output.toFixed(0)} units
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {(currentPlayer.total_output / currentPlayer.rounds_completed).toFixed(1)}/round
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Cost/Unit</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      Rs. {currentPlayer.average_cost_per_unit.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lower is better
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profit Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="#4472C4" strokeWidth={2} name="Profit (Rs.)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Output & Cost Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="output" stroke="#E26B0A" strokeWidth={2} name="Output" />
                    <Line yAxisId="right" type="monotone" dataKey="avgCost" stroke="#00AA55" strokeWidth={2} name="Avg Cost" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Rounds</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Round</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Level</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Labor</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Output</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Cost</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Revenue</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Profit</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.slice(-8).reverse().map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{result.rounds?.round_number}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Level {result.rounds?.level}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{result.labor}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{result.output.toFixed(1)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(result.total_cost)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(result.total_revenue)}</td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.profit)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            #{result.profit_rank}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
