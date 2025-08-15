
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Shield,
  LogOut,
  Home,
  Star,
  PenTool
} from "lucide-react";
import PropertyManagement from "@/components/PropertyManagement";
import BlogManagement from "@/components/BlogManagement";
import TestimonialManagement from "@/components/TestimonialManagement";

export default function AdminDashboard() {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalContacts: 0,
    totalBlogs: 0,
    totalTestimonials: 0,
    totalVisitors: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    // Security check: redirect if not authenticated or not admin
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin, loading, navigate, toast]);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      
      const [
        propertiesResult,
        contactsResult,
        blogsResult,
        testimonialsResult,
        visitorsResult
      ] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('visitors').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalProperties: propertiesResult.count || 0,
        totalContacts: contactsResult.count || 0,
        totalBlogs: blogsResult.count || 0,
        totalTestimonials: testimonialsResult.count || 0,
        totalVisitors: visitorsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!user || !isAdmin) {
    return null;
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Home,
      description: "Active property listings"
    },
    {
      title: "Contact Submissions",
      value: stats.totalContacts,
      icon: MessageSquare,
      description: "Customer inquiries"
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs,
      icon: PenTool,
      description: "Published articles"
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: Star,
      description: "Customer reviews"
    },
    {
      title: "Site Visitors",
      value: stats.totalVisitors,
      icon: Users,
      description: "Total unique visitors"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>View Site</span>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center space-x-2">
              <PenTool className="h-4 w-4" />
              <span>Blogs</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Testimonials</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Property Management</span>
                </CardTitle>
                <CardDescription>
                  Manage property listings, add new properties, and update existing ones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5" />
                  <span>Blog Management</span>
                </CardTitle>
                <CardDescription>
                  Create, edit, and manage blog posts. All posts are secured and validated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlogManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Testimonial Management</span>
                </CardTitle>
                <CardDescription>
                  Manage customer testimonials and reviews with secure image uploads.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestimonialManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Security Notice</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This dashboard is protected with Row Level Security (RLS) and requires admin authentication. 
                  All file uploads are validated and sanitized. Session timeout is enforced for security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
