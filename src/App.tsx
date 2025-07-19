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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="legacy" element={<Legacy />} />
              <Route path="properties" element={<PropertiesDatabase />} />
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
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;