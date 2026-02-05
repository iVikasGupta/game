import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SubmitDecision } from './pages/SubmitDecision';
import { Results } from './pages/Results';
import { Analytics } from './pages/Analytics';
import { CostCurves } from './pages/CostCurves';
import { Leaderboard } from './pages/Leaderboard';
import { Guide } from './pages/Guide';
import { SubmitDecisionLevel2 } from './pages/SubmitDecisionLevel2';
import { SubmitDecisionLevel3 } from './pages/SubmitDecisionLevel3';
import { SubmitDecisionLevel4 } from './pages/SubmitDecisionLevel4';
import { SubmitDecisionLevel5 } from './pages/SubmitDecisionLevel5';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/submit-decision" element={<PrivateRoute><SubmitDecision /></PrivateRoute>} />
      <Route path="/submit-decision-level2" element={<PrivateRoute><SubmitDecisionLevel2 /></PrivateRoute>} />
      <Route path="/submit-decision-level3" element={<PrivateRoute><SubmitDecisionLevel3 /></PrivateRoute>} />
      <Route path="/submit-decision-level4" element={<PrivateRoute><SubmitDecisionLevel4 /></PrivateRoute>} />
      <Route path="/submit-decision-level5" element={<PrivateRoute><SubmitDecisionLevel5 /></PrivateRoute>} />
      <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/cost-curves" element={<PrivateRoute><CostCurves /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
      <Route path="/guide" element={<Guide />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
