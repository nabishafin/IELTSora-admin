import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Overview from "@/pages/Overview";
import Users from "@/pages/Users";
import UserDetails from "@/pages/UserDetails";
import StudyPlanManagement from "@/pages/StudyPlanManagement";
import DayManagement from "@/pages/DayManagement";
import CambridgeManagement from "@/pages/CambridgeManagement";
import TestManagement from "@/pages/TestManagement";
import QuestionManagement from "@/pages/QuestionManagement";
import MockTestManagement from "@/pages/MockTestManagement";
import ModuleManagement from "@/pages/ModuleManagement";
import HomepageManagement from "@/pages/HomepageManagement";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Navigate to="/" replace />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="study-plan" element={<StudyPlanManagement />} />
        <Route path="study-plan/:day" element={<DayManagement />} />
        <Route path="cambridge" element={<CambridgeManagement />} />
        <Route path="cambridge/:bookId/test/:testNo" element={<TestManagement />} />
        <Route path="questions" element={<QuestionManagement />} />
        <Route path="mock-tests" element={<MockTestManagement />} />
        <Route path="modules" element={<ModuleManagement />} />
        <Route path="homepage" element={<HomepageManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
