
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft, Share2, BookOpen, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          navigate('/404');
          return;
        }
        throw error;
      }
      
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .neq('slug', slug)
        .order('published_date', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedBlogs(data || []);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

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

  const handleShare = async () => {
    const url = window.location.href;
    const title = blog?.title || 'Real Estate Blog Post';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The blog link has been copied to your clipboard.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-brand-classic-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-brand-grey">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 text-brand-grey mx-auto" />
          <h1 className="text-2xl font-semibold text-primary">Blog post not found</h1>
          <p className="text-brand-grey">The blog post you're looking for doesn't exist.</p>
          <Link to="/blogs">
            <Button className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="border-b border-brand-soft-gold/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/blogs">
            <Button variant="ghost" className="text-brand-classic-gold hover:text-brand-soft-gold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Badge className="bg-brand-classic-gold text-primary">
              Real Estate
            </Badge>
            <div className="flex items-center text-sm text-brand-grey space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(blog.published_date)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {calculateReadTime(blog.content)} min read
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-brand-grey mb-6 leading-relaxed">
            {blog.short_summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-brand-grey">
                <User className="w-4 h-4 mr-2" />
                <span>Real Estate Expert</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        {blog.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-luxury">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
              loading="lazy"
            />
          </div>
        )}

        <Separator className="mb-8" />

        {/* Article Content */}
        <div className="prose prose-lg prose-gray max-w-none">
          <div 
            className="text-brand-grey leading-relaxed space-y-6"
            style={{ 
              lineHeight: '1.8',
              fontSize: '1.125rem'
            }}
          >
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-brand-classic-gold/10 to-brand-soft-gold/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Ready to Explore Mumbai's Real Estate Market?
          </h3>
          <p className="text-brand-grey mb-6">
            Get expert guidance and personalized recommendations for your property needs.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
              Get In Touch
            </Button>
          </Link>
        </div>
      </article>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="bg-secondary/20 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog.id} to={`/blog/${relatedBlog.slug}`} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-luxury transition-all duration-300">
                    {relatedBlog.featured_image ? (
                      <img
                        src={relatedBlog.featured_image}
                        alt={relatedBlog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-brand-classic-gold/20 to-brand-maroon/20 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-brand-classic-gold" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-brand-classic-gold transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-brand-grey text-sm line-clamp-3">
                        {relatedBlog.short_summary}
                      </p>
                      <div className="flex items-center text-xs text-brand-grey mt-4">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(relatedBlog.published_date)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
