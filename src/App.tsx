
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Legacy from "./pages/Legacy";
import Properties from "./pages/Properties";
import PropertiesDatabase from "./pages/PropertiesDatabase";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import NotFound from "./pages/NotFound";
import { useVisitorTracking } from "./hooks/useVisitorTracking";

const queryClient = new QueryClient();

const AppWithTracking = () => {
  useVisitorTracking();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="legacy" element={<Legacy />} />
          <Route path="properties" element={<Properties />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:id" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/client-dashboard" 
          element={
            <ProtectedRoute requireAdmin={false}>
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppWithTracking />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
