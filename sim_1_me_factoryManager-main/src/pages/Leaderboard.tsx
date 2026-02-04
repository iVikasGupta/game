import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { getMyGroupLeaderboard } from '../utils/api';
import { Trophy, Medal, Award, TrendingUp, Users, AlertCircle } from 'lucide-react';

type SortBy = 'profit' | 'efficiency' | 'output';

interface LeaderboardPlayer {
  playerId: string;
  name: string;
  email: string;
  totalProfit: number;
  totalOutput: number;
  totalCost: number;
  totalRevenue: number;
  submissions: number;
  avgCostPerUnit: number;
  efficiencyScore: number;
  rank: number;
}

interface GroupInfo {
  _id: string;
  name: string;
  sessionId: string;
  locked: boolean;
  maxPlayers: number;
  playerCount: number;
}

export const Leaderboard = () => {
  const [sortBy, setSortBy] = useState<SortBy>('profit');
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroupLeaderboard();
  }, []);

  const fetchGroupLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('Please login to view your group leaderboard');
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user._id || user.id;
      
      if (!userId) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const data = await getMyGroupLeaderboard(userId);
      
      if (data.message) {
        setError(data.message);
      } else {
        setGroupInfo(data.group);
        setLeaderboard(data.leaderboard || []);
        setCurrentUserId(data.currentUserId);
      }
    } catch (err) {
      setError('Failed to fetch leaderboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSortedData = () => {
    const data = [...leaderboard];
    switch (sortBy) {
      case 'profit':
        return data.sort((a, b) => b.totalProfit - a.totalProfit);
      case 'efficiency':
        return data.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
      case 'output':
        return data.sort((a, b) => b.totalOutput - a.totalOutput);
      default:
        return data;
    }
  };

  const sortedData = getSortedData();
  
  const formatCurrency = (amount: number) => {
    return `Rs. ${(amount / 100000).toFixed(2)}L`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    } else if (rank === 2) {
      return <Medal className="w-6 h-6 text-gray-400" />;
    } else if (rank === 3) {
      return <Medal className="w-6 h-6 text-orange-600" />;
    }
    return <span className="text-gray-600 font-semibold">#{rank}</span>;
  };

  const isCurrentUser = (playerId: string) => {
    return playerId === currentUserId;
  };

  const getCurrentUserRank = () => {
    const user = sortedData.find(p => p.playerId === currentUserId);
    return user?.rank || 0;
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8 max-w-6xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">No Group Assigned</h3>
                <p className="text-yellow-700 mt-1">{error}</p>
                <p className="text-yellow-600 text-sm mt-2">
                  Please contact your administrator to be assigned to a group.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Group Leaderboard</h1>
              {groupInfo && (
                <p className="text-gray-600 mt-1">
                  {groupInfo.name} • {groupInfo.playerCount} players
                  {groupInfo.locked && <span className="ml-2 text-green-600">🔒 Locked</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {sortedData.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">No Results Yet</h3>
                <p className="text-blue-700 mt-1">
                  No one in your group has submitted any decisions yet. Be the first to play!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {sortedData.slice(0, 3).map((player, index) => (
                <div
                  key={player.playerId}
                  className={`rounded-xl shadow-lg p-6 ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400'
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400'
                  } ${isCurrentUser(player.playerId) ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-gray-600">
                      {index === 0 ? '🥇 1st Place' : index === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
                    </div>
                    {getRankBadge(index + 1)}
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {player.name}
                    {isCurrentUser(player.playerId) && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">You</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{player.submissions} submissions</div>
                  <div className={`text-2xl font-bold ${player.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(player.totalProfit)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total Profit</div>
                </div>
              ))}
            </div>

            {/* Full Leaderboard Table */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Rankings</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('profit')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === 'profit'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Profit
                  </button>
                  <button
                    onClick={() => setSortBy('efficiency')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === 'efficiency'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Award className="w-4 h-4 inline mr-1" />
                    Efficiency
                  </button>
                  <button
                    onClick={() => setSortBy('output')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortBy === 'output'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Trophy className="w-4 h-4 inline mr-1" />
                    Output
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Player</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Submissions</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Profit</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Cost/Unit</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Output</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedData.map((player, index) => (
                      <tr
                        key={player.playerId}
                        className={`hover:bg-gray-50 ${
                          isCurrentUser(player.playerId) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center">
                            {getRankBadge(index + 1)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-900">{player.name}</div>
                          {isCurrentUser(player.playerId) && (
                            <div className="text-xs text-blue-600 font-medium">You</div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-600">
                          {player.submissions}
                        </td>
                        <td className={`px-4 py-4 text-sm text-right font-semibold ${
                          player.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(player.totalProfit)}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          Rs. {player.avgCostPerUnit.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          {player.totalOutput.toFixed(0)} units
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            player.efficiencyScore >= 70
                              ? 'bg-green-100 text-green-800'
                              : player.efficiencyScore >= 50
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {player.efficiencyScore.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Your Performance Card */}
            {currentUserId && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Performance</h3>
                <p className="text-blue-800 text-sm">
                  You're currently ranked <strong>#{getCurrentUserRank()}</strong> in your group "{groupInfo?.name}".
                  {' '}
                  {getCurrentUserRank() === 1 ? (
                    <span className="font-semibold text-green-700">🏆 Excellent work! You're leading!</span>
                  ) : getCurrentUserRank() <= 3 ? (
                    <span className="font-semibold text-blue-700">Great job! You're in the top 3!</span>
                  ) : (
                    <span>Keep optimizing your decisions to climb the rankings!</span>
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
