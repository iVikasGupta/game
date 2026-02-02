import { Link } from 'react-router-dom';
import { Factory, TrendingUp, Users, Award, BookOpen, BarChart3 } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Factory className="w-20 h-20 text-orange-500" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Factory Manager</h1>
          <p className="text-2xl text-blue-200 mb-8">Master Production Economics Through Interactive Learning</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Student Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <TrendingUp className="w-12 h-12 mb-4 text-orange-400" />
            <h3 className="text-xl font-bold mb-2">Learn Cost Curves</h3>
            <p className="text-blue-200">
              Master fixed, variable, marginal, and average costs through hands-on production decisions.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <Factory className="w-12 h-12 mb-4 text-orange-400" />
            <h3 className="text-xl font-bold mb-2">Manage Real Factory</h3>
            <p className="text-blue-200">
              Make production decisions, hire workers, allocate capital, and maximize profit.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <BarChart3 className="w-12 h-12 mb-4 text-orange-400" />
            <h3 className="text-xl font-bold mb-2">5 Progressive Levels</h3>
            <p className="text-blue-200">
              From single-input production to long-run plant size decisions and economies of scale.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Concepts You'll Master</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Production Theory</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Production Functions (Single & Multi-Input)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Marginal & Average Product</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Diminishing Returns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Returns to Scale (IRS, CRS, DRS)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Isoquants & Isocosts</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Cost Theory</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Short-Run vs Long-Run Costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Fixed, Variable & Total Costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Average & Marginal Cost Curves</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Cost Minimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Economies of Scale</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Join Session</h3>
              <p className="text-blue-200">Instructor creates session and you join with your cohort</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Make Decisions</h3>
              <p className="text-blue-200">Choose labor and capital inputs to maximize profit</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">See Results</h3>
              <p className="text-blue-200">View output, costs, and profit with detailed analytics</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Learn & Improve</h3>
              <p className="text-blue-200">Use insights to refine strategy in next round</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-blue-200 text-lg mb-4">Ready to master production economics?</p>
          <Link
            to="/register"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-12 py-4 rounded-lg text-xl transition-colors inline-block"
          >
            Create Account Now
          </Link>
        </div>
      </div>
    </div>
  );
};
