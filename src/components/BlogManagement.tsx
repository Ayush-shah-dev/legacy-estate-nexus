
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Upload, Shield } from 'lucide-react';
import { uploadImageSecurely, validateImageFile, deleteImageSecurely } from '@/utils/secureUpload';

interface Blog {
  id: string;
  title: string;
  short_summary: string;
  content: string;
  featured_image?: string;
  status: 'published' | 'draft';
  published_date?: string;
  created_at: string;
  updated_at: string;
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    short_summary: '',
    content: '',
    featured_image: '',
    status: 'draft' as 'published' | 'draft'
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Basic XSS prevention - remove script tags and dangerous content
    const sanitizedValue = value.replace(/<script[^>]*>.*?<\/script>/gi, '');
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    
    try {
      // Validate file first
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      const result = await uploadImageSecurely(file, 'blogs');
      if (result.success && result.url) {
        setFormData(prev => ({
          ...prev,
          featured_image: result.url
        }));
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim() || formData.title.length < 3) {
      toast({
        title: "Validation Error",
        description: "Title must be at least 3 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.short_summary.trim() || formData.short_summary.length < 10) {
      toast({
        title: "Validation Error",
        description: "Short summary must be at least 10 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.content.trim() || formData.content.length < 50) {
      toast({
        title: "Validation Error",
        description: "Content must be at least 50 characters long",
        variant: "destructive",
      });
      return false;
    }

    // Check for potential XSS in content
    const xssPattern = /<script|javascript:|on\w+=/i;
    if (xssPattern.test(formData.content)) {
      toast({
        title: "Security Error",
        description: "Content contains potentially dangerous scripts",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const blogData = {
        title: formData.title.trim(),
        short_summary: formData.short_summary.trim(),
        content: formData.content.trim(),
        featured_image: formData.featured_image || null,
        status: formData.status,
        ...(formData.status === 'published' && { published_date: new Date().toISOString() })
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog created successfully",
        });
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      short_summary: blog.short_summary,
      content: blog.content,
      featured_image: blog.featured_image || '',
      status: blog.status
    });
  };

  const handleDelete = async (blog: Blog) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      // Delete associated image if exists
      if (blog.featured_image) {
        await deleteImageSecurely(blog.featured_image, 'blogs');
      }

      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blog.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });
      
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      short_summary: '',
      content: '',
      featured_image: '',
      status: 'draft'
    });
    setEditingBlog(null);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                placeholder="Enter blog title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'published' | 'draft') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Summary *</label>
            <Textarea
              placeholder="Brief summary of the blog post"
              value={formData.short_summary}
              onChange={(e) => handleInputChange('short_summary', e.target.value)}
              rows={3}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.short_summary.length}/500</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                disabled={uploadingImage}
              />
              {uploadingImage && <p className="text-sm text-blue-600">Uploading...</p>}
              {formData.featured_image && (
                <div className="mt-2">
                  <img 
                    src={formData.featured_image} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                    className="mt-2"
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <Textarea
              placeholder="Write your blog content here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              maxLength={10000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length}/10000</p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
            </Button>
            {editingBlog && (
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blog List */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Blogs</CardTitle>
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{blog.short_summary}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status}
                      </span>
                      <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
                      {blog.published_date && (
                        <span>Published: {new Date(blog.published_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(blog)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredBlogs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No blogs found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
