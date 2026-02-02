import { useState } from 'react';
import { Layout } from '../components/Layout';
import { leaderboardData } from '../data/dummyData';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

type SortBy = 'profit' | 'efficiency' | 'output';

export const Leaderboard = () => {
  const [sortBy, setSortBy] = useState<SortBy>('profit');

  const getSortedData = () => {
    const data = [...leaderboardData];
    switch (sortBy) {
      case 'profit':
        return data.sort((a, b) => b.cumulative_profit - a.cumulative_profit);
      case 'efficiency':
        return data.sort((a, b) => b.efficiency_score - a.efficiency_score);
      case 'output':
        return data.sort((a, b) => b.total_output - a.total_output);
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

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">Compare performance across the class</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sortedData.slice(0, 3).map((student, index) => (
            <div
              key={student.student_id}
              className={`rounded-xl shadow-lg p-6 ${
                index === 0
                  ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400'
                  : index === 1
                  ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400'
                  : 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-600">
                  {index === 0 ? '1st Place' : index === 1 ? '2nd Place' : '3rd Place'}
                </div>
                {getRankBadge(index + 1)}
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">{student.name}</div>
              <div className="text-sm text-gray-600 mb-3">{student.student_id}</div>
              <div className={`text-2xl font-bold ${student.cumulative_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(student.cumulative_profit)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Cumulative Profit</div>
            </div>
          ))}
        </div>

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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Profit</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Cost</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Output</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((student, index) => (
                  <tr
                    key={student.student_id}
                    className={`hover:bg-gray-50 ${
                      student.student_id === 'STU001' ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center">
                        {getRankBadge(index + 1)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      {student.student_id === 'STU001' && (
                        <div className="text-xs text-blue-600 font-medium">You</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{student.student_id}</td>
                    <td className={`px-4 py-4 text-sm text-right font-semibold ${
                      student.cumulative_profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(student.cumulative_profit)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-gray-900">
                      Rs. {student.avg_cost.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-gray-900">
                      {student.total_output} units
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        student.efficiency_score >= 90
                          ? 'bg-green-100 text-green-800'
                          : student.efficiency_score >= 70
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.efficiency_score.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Performance</h3>
          <p className="text-blue-800 text-sm">
            You're currently ranked #{leaderboardData.find(s => s.student_id === 'STU001')?.rank} in the class.
            {' '}
            {leaderboardData.find(s => s.student_id === 'STU001')?.rank === 1 ? (
              <span className="font-semibold text-green-700">Excellent work!</span>
            ) : (
              <span>Keep optimizing your decisions to improve your ranking!</span>
            )}
          </p>
        </div>
      </div>
    </Layout>
  );
};
