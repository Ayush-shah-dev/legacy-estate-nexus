
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Search, ArrowRight, FileText } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  short_summary: string;
  content: string;
  featured_image: string | null;
  published_date: string;
  created_at: string;
  slug: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

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

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-brand-classic-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-brand-grey">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-brand-classic-gold mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Real Estate Insights
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Stay informed with the latest trends, market insights, and expert advice from Mumbai's premier real estate consultants.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-brand-grey" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-white border-brand-soft-gold/20"
              />
            </div>
            <div className="text-brand-grey">
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedBlogs.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-brand-grey mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-primary mb-2">No articles found</h3>
              <p className="text-brand-grey">
                {searchTerm ? "Try adjusting your search terms" : "Check back soon for new content"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedBlogs.map((blog) => (
                  <Card key={blog.id} className="overflow-hidden hover:shadow-luxury transition-all duration-300 group">
                    <div className="relative">
                      {blog.featured_image ? (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-brand-classic-gold/20 to-brand-maroon/20 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-brand-classic-gold" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-brand-classic-gold text-primary">
                          Real Estate
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-brand-grey mb-3 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(blog.published_date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {calculateReadTime(blog.content)} min read
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-brand-classic-gold transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-brand-grey mb-4 line-clamp-3">
                        {blog.short_summary}
                      </p>
                      
                      <Link to={`/blog/${blog.slug}`}>
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-brand-classic-gold hover:text-brand-soft-gold group-hover:translate-x-1 transition-all"
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page 
                          ? "bg-brand-classic-gold text-primary" 
                          : "border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-classic-gold">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Stay Updated with Market Insights
          </h2>
          <p className="text-xl text-primary/80 mb-8">
            Get expert real estate advice and market updates delivered to your inbox
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary text-white hover:bg-brand-navy">
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
