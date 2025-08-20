import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import PropertiesDatabase from "./pages/PropertiesDatabase";
import Legacy from "./pages/Legacy";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="properties" element={<Properties />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="blog/:slug" element={<BlogDetail />} />
                <Route path="blogs/:id" element={<BlogPost />} />
                <Route path="contact" element={<Contact />} />
                <Route path="auth" element={<Auth />} />
                <Route 
                  path="admin-dashboard" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="client-dashboard" 
                  element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="properties-database" element={<PropertiesDatabase />} />
                <Route path="legacy" element={<Legacy />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
