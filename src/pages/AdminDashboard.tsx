import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  FileText, 
  Home, 
  Star, 
  TrendingUp, 
  Eye, 
  Clock, 
  Globe,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import PropertyManagement from "@/components/PropertyManagement";
import BlogManagement from "@/components/BlogManagement";
import TestimonialManagement from "@/components/TestimonialManagement";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  phone_verified: boolean;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  status: string;
  featured: boolean;
  image_url: string;
  created_at: string;
}

interface Review {
  id: string;
  name: string;
  review_text: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

interface VisitorStats {
  total_visitors: number;
  unique_visitors: number;
  avg_time_spent: number;
  total_page_views: number;
  bounce_rate: number;
}

interface DailyStats {
  date: string;
  visitors: number;
  page_views: number;
  avg_time: number;
}

interface PageStats {
  page_path: string;
  views: number;
  avg_time: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const AdminDashboard = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [pageStats, setPageStats] = useState<PageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsResult, propertiesResult, reviewsResult] = await Promise.all([
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false })
      ]);

      if (contactsResult.error) throw contactsResult.error;
      if (propertiesResult.error) throw propertiesResult.error;
      if (reviewsResult.error) throw reviewsResult.error;

      setContactSubmissions(contactsResult.data || []);
      setProperties(propertiesResult.data || []);
      setReviews(reviewsResult.data || []);
      
      await fetchVisitorStats();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitorStats = async () => {
    try {
      // Get overall visitor stats
      const { data: visitors } = await supabase
        .from('visitors')
        .select('session_id, time_spent_seconds, created_at');

      const { data: pageViews } = await supabase
        .from('page_views')
        .select('visitor_session_id, page_path, time_spent_seconds, created_at');

      if (visitors && pageViews) {
        const uniqueVisitors = new Set(visitors.map(v => v.session_id)).size;
        const totalVisitors = visitors.length;
        const avgTimeSpent = visitors.reduce((acc, v) => acc + (v.time_spent_seconds || 0), 0) / visitors.length;
        const totalPageViews = pageViews.length;
        
        // Calculate bounce rate (visitors with only 1 page view)
        const sessionPageCounts = pageViews.reduce((acc, pv) => {
          acc[pv.visitor_session_id] = (acc[pv.visitor_session_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const bounces = Object.values(sessionPageCounts).filter(count => count === 1).length;
        const bounceRate = uniqueVisitors > 0 ? (bounces / uniqueVisitors) * 100 : 0;

        setVisitorStats({
          total_visitors: totalVisitors,
          unique_visitors: uniqueVisitors,
          avg_time_spent: Math.round(avgTimeSpent),
          total_page_views: totalPageViews,
          bounce_rate: Math.round(bounceRate)
        });

        // Get daily stats for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const dailyData = last7Days.map(date => {
          const dayVisitors = visitors.filter(v => v.created_at.startsWith(date));
          const dayPageViews = pageViews.filter(pv => pv.created_at.startsWith(date));
          const avgTime = dayVisitors.length > 0 
            ? dayVisitors.reduce((acc, v) => acc + (v.time_spent_seconds || 0), 0) / dayVisitors.length 
            : 0;

          return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            visitors: dayVisitors.length,
            page_views: dayPageViews.length,
            avg_time: Math.round(avgTime)
          };
        });

        setDailyStats(dailyData);

        // Get page stats
        const pageData = pageViews.reduce((acc, pv) => {
          if (!acc[pv.page_path]) {
            acc[pv.page_path] = { views: 0, total_time: 0 };
          }
          acc[pv.page_path].views++;
          acc[pv.page_path].total_time += pv.time_spent_seconds || 0;
          return acc;
        }, {} as Record<string, { views: number; total_time: number }>);

        const pageStatsData = Object.entries(pageData).map(([path, data]) => ({
          page_path: path,
          views: data.views,
          avg_time: Math.round(data.total_time / data.views)
        })).sort((a, b) => b.views - a.views);

        setPageStats(pageStatsData);
      }
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
    }
  };

  const toggleReviewApproval = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ approved })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Review ${approved ? 'approved' : 'unapproved'} successfully`,
      });

      // Update local state
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, approved } : review
      ));
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Futuristic Header */}
      <div className="border-b border-blue-500/20 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Real-time analytics and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline" 
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
              >
                Back to Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview Cards */}
        {visitorStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/20 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{visitorStats.total_visitors}</div>
                <div className="flex items-center text-xs text-green-400">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  <span>Live tracking</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/20 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Unique Visitors</CardTitle>
                <Eye className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{visitorStats.unique_visitors}</div>
                <div className="flex items-center text-xs text-purple-400">
                  <Globe className="w-3 h-3 mr-1" />
                  <span>Sessions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-500/20 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-100">Avg Time Spent</CardTitle>
                <Clock className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatDuration(visitorStats.avg_time_spent)}</div>
                <div className="flex items-center text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Engagement</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/20 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-100">Page Views</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{visitorStats.total_page_views}</div>
                <div className="flex items-center text-xs text-orange-400">
                  <Activity className="w-3 h-3 mr-1" />
                  <span>Total views</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-500/20 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-100">Bounce Rate</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{visitorStats.bounce_rate}%</div>
                <div className="flex items-center text-xs text-red-400">
                  <PieChart className="w-3 h-3 mr-1" />
                  <span>Single page</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="bg-black/20 border border-blue-500/20 backdrop-blur-xl">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Contact Submissions
            </TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Properties
            </TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Blogs
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Visitors Chart */}
              <Card className="bg-black/20 border-blue-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-blue-100 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                    Daily Visitors (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid #3b82f6',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="visitors" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Page Views Chart */}
              <Card className="bg-black/20 border-purple-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                    Page Views by Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid #8b5cf6',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Bar dataKey="page_views" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Page Stats Table */}
            <Card className="bg-black/20 border-emerald-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-emerald-100 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-emerald-400" />
                  Top Pages by Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Page</TableHead>
                      <TableHead className="text-gray-300">Views</TableHead>
                      <TableHead className="text-gray-300">Avg Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageStats.slice(0, 10).map((page, index) => (
                      <TableRow key={index} className="border-gray-700 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{page.page_path}</TableCell>
                        <TableCell className="text-emerald-400">{page.views}</TableCell>
                        <TableCell className="text-blue-400">{formatDuration(page.avg_time)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="bg-black/20 border-blue-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-blue-100 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-400" />
                  Contact Submissions ({contactSubmissions.length})
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Recent inquiries from potential clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Phone</TableHead>
                      <TableHead className="text-gray-300">Verified</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubmissions.map((submission) => (
                      <TableRow key={submission.id} className="border-gray-700 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{submission.name}</TableCell>
                        <TableCell className="text-gray-300">{submission.email}</TableCell>
                        <TableCell className="text-gray-300">{submission.phone}</TableCell>
                        <TableCell>
                          <Badge variant={submission.phone_verified ? "default" : "secondary"}>
                            {submission.phone_verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <PropertyManagement />
          </TabsContent>

          <TabsContent value="blogs">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="bg-black/20 border-yellow-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-yellow-100 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Reviews ({reviews.length})
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customer feedback and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Rating</TableHead>
                      <TableHead className="text-gray-300">Review</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id} className="border-gray-700 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{review.name}</TableCell>
                        <TableCell className="text-yellow-400">
                          {"★".repeat(review.rating || 0)}{"☆".repeat(5 - (review.rating || 0))}
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          {review.review_text}
                        </TableCell>
                        <TableCell>
                          <Badge variant={review.approved ? "default" : "secondary"}>
                            {review.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={review.approved ? "secondary" : "default"}
                            onClick={() => toggleReviewApproval(review.id, !review.approved)}
                            className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
                          >
                            {review.approved ? "Unapprove" : "Approve"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
