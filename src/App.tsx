
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Properties from "./pages/Properties";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:id" element={<BlogPost />} />
              </Route>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
