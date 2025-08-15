
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw error;
        }
        return;
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.short_summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Blog post URL has been copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-brand-classic-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Blog Post Not Found</h1>
            <p className="text-brand-grey mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link to="/blogs">
              <Button className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/blogs">
            <Button 
              variant="outline" 
              className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        {/* Featured Image */}
        {blog.featured_image && (
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-8">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-brand-grey mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(blog.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <Badge variant="outline" className="border-brand-classic-gold/50 text-brand-classic-gold">
              Article
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {blog.title}
          </h1>
          
          <p className="text-xl text-brand-grey mb-6">
            {blog.short_summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-sm text-brand-grey">
              Published by Regal Estate Consultants
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-brand-classic-gold/50 text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div 
            className="text-brand-grey leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-brand-classic-gold/10 rounded-lg border border-brand-classic-gold/20">
          <h3 className="text-xl font-semibold text-primary mb-3">
            Ready to explore premium real estate opportunities?
          </h3>
          <p className="text-brand-grey mb-4">
            Connect with our experts at Regal Estate Consultants for personalized guidance and exclusive property insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/contact">
              <Button className="bg-brand-classic-gold text-primary hover:bg-brand-soft-gold">
                Get in Touch
              </Button>
            </Link>
            <Link to="/properties">
              <Button 
                variant="outline" 
                className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary"
              >
                View Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
