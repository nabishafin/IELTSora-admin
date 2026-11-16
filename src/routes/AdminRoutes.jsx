import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Overview from "@/pages/Overview";
import Users from "@/pages/Users";
import UserDetails from "@/pages/UserDetails";
import Analytics from "@/pages/Analytics";
import QuestionManagement from "@/pages/QuestionManagement";
import MockTestManagement from "@/pages/MockTestManagement";
import ModuleManagement from "@/pages/ModuleManagement";
import StudyPlanManagement from "@/pages/StudyPlanManagement";
import DayManagement from "@/pages/DayManagement";
import CambridgePractice from "@/pages/CambridgePractice";
import CambridgePartEditor from "@/pages/CambridgePartEditor";
import HomepageManagement from "@/pages/HomepageManagement";
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
        <Route path="analytics" element={<Analytics />} />
        <Route path="study-plan" element={<StudyPlanManagement />} />
        <Route path="study-plan/:day" element={<DayManagement />} />
        <Route path="cambridge" element={<CambridgePractice />} />
        <Route path="cambridge/:book/:test/:module/:part" element={<CambridgePartEditor />} />
        <Route path="questions" element={<QuestionManagement />} />
        <Route path="mock-tests" element={<MockTestManagement />} />
        <Route path="modules" element={<ModuleManagement />} />
        <Route path="homepage" element={<HomepageManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
