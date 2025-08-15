
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Upload,
  Image as ImageIcon
} from "lucide-react";

interface Blog {
  id: string;
  title: string;
  short_summary: string;
  content: string;
  featured_image: string | null;
  status: 'draft' | 'published';
  published_date: string | null;
  created_at: string;
  updated_at: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const blogsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
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
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blogs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blogs')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBlog = async (blogData: Partial<Blog>) => {
    try {
      let imageUrl = blogData.featured_image;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) return;
      }

      const blogPayload = {
        ...blogData,
        featured_image: imageUrl,
        published_date: blogData.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogPayload)
          .eq('id', editingBlog.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogPayload]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog created successfully",
        });
      }

      fetchBlogs();
      setIsDialogOpen(false);
      setEditingBlog(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

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

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.short_summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-black/20 border-blue-500/20 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-100 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Blog Management ({blogs.length})
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create and manage blog posts
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingBlog(null);
                  setImageFile(null);
                }}
                className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Blog
              </Button>
            </DialogTrigger>
            <BlogDialog
              blog={editingBlog}
              onSave={handleSaveBlog}
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploading={uploading}
            />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-white/5 border-gray-600 text-white"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Title</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Published Date</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBlogs.map((blog) => (
              <TableRow key={blog.id} className="border-gray-700 hover:bg-white/5">
                <TableCell className="text-white font-medium">{blog.title}</TableCell>
                <TableCell>
                  <Badge variant={blog.status === 'published' ? "default" : "secondary"}>
                    {blog.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">
                  {blog.published_date ? new Date(blog.published_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingBlog(blog);
                        setIsDialogOpen(true);
                      }}
                      className="text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-gray-600 text-gray-300"
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-600 text-gray-300"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BlogDialog = ({ 
  blog, 
  onSave, 
  imageFile, 
  setImageFile, 
  uploading 
}: {
  blog: Blog | null;
  onSave: (data: Partial<Blog>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  uploading: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    short_summary: '',
    content: '',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        short_summary: blog.short_summary,
        content: blog.content,
        status: blog.status
      });
    } else {
      setFormData({
        title: '',
        short_summary: '',
        content: '',
        status: 'draft'
      });
    }
  }, [blog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">
          {blog ? 'Edit Blog' : 'Create New Blog'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-gray-300">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="bg-white/5 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="short_summary" className="text-gray-300">Short Summary</Label>
          <Textarea
            id="short_summary"
            value={formData.short_summary}
            onChange={(e) => setFormData({ ...formData, short_summary: e.target.value })}
            required
            rows={3}
            className="bg-white/5 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="content" className="text-gray-300">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={8}
            className="bg-white/5 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="featured_image" className="text-gray-300">Featured Image</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="featured_image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="bg-white/5 border-gray-600 text-white"
            />
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
          {blog?.featured_image && !imageFile && (
            <img 
              src={blog.featured_image} 
              alt="Current featured image" 
              className="mt-2 w-32 h-20 object-cover rounded"
            />
          )}
        </div>

        <div>
          <Label htmlFor="status" className="text-gray-300">Status</Label>
          <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData({ ...formData, status: value })}>
            <SelectTrigger className="bg-white/5 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={uploading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              blog ? 'Update Blog' : 'Create Blog'
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default BlogManagement;
