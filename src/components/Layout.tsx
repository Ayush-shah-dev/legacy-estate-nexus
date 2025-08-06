
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <main>
          <Outlet />
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  );
};

export default Layout;
