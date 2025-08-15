
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  short_summary: string;
  content: string;
  featured_image: string | null;
  status: 'published' | 'draft';
  published_date: string;
  created_at: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.short_summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-brand-classic-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Real Estate Insights & News
          </h1>
          <p className="text-xl text-brand-grey max-w-3xl mx-auto">
            Stay updated with the latest trends, market insights, and expert advice from Regal Estate Consultants.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-grey w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden hover:shadow-luxury transition-all duration-300">
                {blog.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-brand-grey mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(blog.published_date).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="border-brand-classic-gold/50 text-brand-classic-gold">
                      Article
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-brand-grey mb-4 line-clamp-3">
                    {blog.short_summary}
                  </p>
                  
                  <Link to={`/blog/${blog.id}`}>
                    <Button 
                      variant="outline" 
                      className="w-full border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-brand-grey mb-4">
              {searchTerm ? 'No articles found matching your search.' : 'No articles published yet.'}
            </div>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
                className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
