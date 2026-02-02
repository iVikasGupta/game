import { Layout } from '../components/Layout';
import { BookOpen, AlertCircle } from 'lucide-react';

export const Guide = () => {
  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Strategy Guide</h1>
          <p className="text-gray-600 mt-1">Learn production economics concepts</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              Level 1: Single Input Production
            </h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Production Function</h3>
                <p className="mb-2">In Level 1, you work with a simple production function:</p>
                <div className="bg-blue-50 p-4 rounded-lg font-mono text-center text-xl mb-2">
                  Q = 10√L
                </div>
                <p>Where Q is output and L is labor. Capital is fixed at 10 units.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Diminishing Returns</h3>
                <p className="mb-2">
                  As you hire more workers, each additional worker produces less output than the previous one.
                  This is called diminishing marginal returns.
                </p>
                <p className="mb-2">
                  The marginal product of labor (MP<sub>L</sub>) is calculated as:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-center mb-2">
                  MP<sub>L</sub> = 5/√L
                </div>
                <p>
                  Notice how MP<sub>L</sub> decreases as L increases.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimal Hiring Decision</h3>
                <p className="mb-2">
                  To maximize profit, you should hire workers until the value of their marginal product equals the wage rate:
                </p>
                <div className="bg-green-50 p-4 rounded-lg font-mono text-center mb-2">
                  P × MP<sub>L</sub> = w
                </div>
                <p className="mb-2">
                  Where:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>P = Output price (Rs. per unit)</li>
                  <li>MP<sub>L</sub> = Marginal product of labor</li>
                  <li>w = Wage rate (Rs. per worker)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Calculations</h3>
                <p className="mb-2">
                  Understanding costs is crucial:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Total Variable Cost (TVC)</strong> = w × L</li>
                  <li><strong>Total Fixed Cost (TFC)</strong> = 0 (in Level 1)</li>
                  <li><strong>Total Cost (TC)</strong> = TVC + TFC</li>
                  <li><strong>Average Variable Cost (AVC)</strong> = TVC / Q</li>
                  <li><strong>Marginal Cost (MC)</strong> = w / MP<sub>L</sub></li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Key Strategy Tips
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-blue-800">
                  <li>Use the live calculator to test different labor levels</li>
                  <li>Aim for the optimal labor level suggested in the strategy helper</li>
                  <li>Watch your budget - make sure total cost doesn't exceed available funds</li>
                  <li>Remember: more workers isn't always better due to diminishing returns</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">More Levels Coming Soon</h3>
            <p className="text-gray-600">
              Guides for Level 2 (Two-Input Production), Level 3 (Returns to Scale),
              Level 4 (Short-Run Costs), and Level 5 (Long-Run Costs) will be available as you progress.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
