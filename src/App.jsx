import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/hooks/useAuth";
import AdminRoutes from "@/routes/AdminRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AdminRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
