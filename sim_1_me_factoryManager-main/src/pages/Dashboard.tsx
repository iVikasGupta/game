import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getUserDashboardData } from '../utils/api';
import { DollarSign, TrendingUp, Package, Award, Factory, Users, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardStats {
  totalProfit: number;
  totalOutput: number;
  totalCost: number;
  totalRevenue: number;
  submissions: number;
  avgCostPerUnit: number;
  levelsCompleted: number;
  rank: number | null;
}

interface GroupInfo {
  _id: string;
  name: string;
  playerCount: number;
  locked: boolean;
}

interface ResultItem {
  _id: string;
  level: number;
  labor: number;
  capital?: number;
  output: number;
  totalCost: number;
  totalRevenue: number;
  profit: number;
  createdAt: string;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

export const Dashboard = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('Please login to view your dashboard');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      const userId = userData._id || userData.id;

      if (!userId) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const data = await getUserDashboardData(userId);

      if (data.message && !data.user) {
        setError(data.message);
      } else {
        setUser(data.user);
        setGroup(data.group);
        setStats(data.stats);
        setResults(data.recentResults || []);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const chartData = results.map((result) => ({
    round: `L${result.level}`,
    profit: result.profit,
    output: result.output,
    avgCost: result.totalCost && result.output ? result.totalCost / result.output : 0
  })).reverse();

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">Dashboard Unavailable</h3>
                <p className="text-yellow-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-600">Welcome back - {user?.name}</p>
            {group && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Users className="w-4 h-4 mr-1" />
                {group.name}
                {stats?.rank && ` • Rank #${stats.rank}`}
              </span>
            )}
          </div>
        </div>

        {!stats || stats.submissions === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <div className="flex items-center">
              <Factory className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Welcome to Factory Manager!</h3>
                <p className="text-blue-700 mt-1">
                  You haven't submitted any decisions yet. Go to "Submit Decision" to start playing and see your results here.
                </p>
                {group && (
                  <p className="text-blue-600 text-sm mt-2">
                    You're in <strong>{group.name}</strong> with {group.playerCount} players.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Profit</p>
                    <p className={`text-2xl font-bold mt-1 ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stats.totalProfit)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Over {stats.submissions} submissions
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
                    <p className="text-sm font-medium text-gray-600">Group Rank</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.rank ? `#${stats.rank}` : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {group ? `in ${group.name}` : 'Not in a group'}
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
                      {stats.totalOutput.toFixed(0)} units
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {(stats.totalOutput / stats.submissions).toFixed(1)}/ Level
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
                      Rs. {stats.avgCostPerUnit.toFixed(0)}
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

            {chartData.length > 0 && (
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
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Submissions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"> Level</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Labor</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Capital</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Output</th>
                      <th className="px-10 py-3 text-right text-sm font-semibold text-gray-700">Cost</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Revenue</th>
                      <th className="px-8 py-3 text-right text-sm font-semibold text-gray-700">Profit</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Date</th>
                      {/* <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">User</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          No submissions yet
                        </td>
                      </tr>
                    ) : (
                      results.map((result) => (
                        <tr key={result._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                              ${result.level === 1 ? 'bg-blue-100 text-blue-800' :
                                result.level === 2 ? 'bg-green-100 text-green-800' :
                                  result.level === 3 ? 'bg-yellow-100 text-yellow-800' :
                                    result.level === 4 ? 'bg-orange-100 text-orange-800' :
                                      'bg-red-100 text-red-800'}`}>
                              Level {result.level}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-right text-gray-900">{result.labor}</td>
                          <td className="px-7 py-3 text-sm text-right text-gray-900">{result.capital || '-'}</td>
                          <td className="px-5 py-3 text-sm text-right text-gray-900">{result.output?.toFixed(1)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(result.totalCost || 0)}</td>
                          <td className="px-3 py-3 text-sm text-right text-gray-900">{formatCurrency(result.totalRevenue || 0)}</td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(result.profit || 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-500">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </td>
                          {/* <td className="px-4 py-3 text-sm text-right text-gray-900">{ }</td> */}

                        </tr>
                      ))
                    )}
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
