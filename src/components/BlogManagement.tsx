
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, FileText, Upload } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  short_summary: string;
  content: string;
  featured_image: string | null;
  status: 'published' | 'draft';
  published_date: string;
  created_at: string;
  updated_at: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    short_summary: "",
    content: "",
    status: "draft" as 'published' | 'draft'
  });

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
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = editingBlog?.featured_image || null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) return;
      }

      const blogData = {
        ...formData,
        featured_image: imageUrl,
        published_date: formData.status === 'published' ? new Date().toISOString() : null
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

      setDialogOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
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

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      short_summary: blog.short_summary,
      content: blog.content,
      status: blog.status
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      short_summary: "",
      content: "",
      status: "draft"
    });
    setImageFile(null);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
              Manage blog posts and articles
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-blue-500/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-blue-100">
                  {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingBlog ? 'Update blog details' : 'Add a new blog post'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="short_summary" className="text-gray-300">Short Summary</Label>
                  <Textarea
                    id="short_summary"
                    value={formData.short_summary}
                    onChange={(e) => setFormData({ ...formData, short_summary: e.target.value })}
                    className="bg-slate-800 border-gray-600 text-white"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-gray-300">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-slate-800 border-gray-600 text-white"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image" className="text-gray-300">Featured Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="bg-slate-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-gray-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'published' | 'draft') => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-slate-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-gray-600">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
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
                      editingBlog ? 'Update' : 'Create'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search blogs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-gray-600 text-white"
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
            {filteredBlogs.map((blog) => (
              <TableRow key={blog.id} className="border-gray-700 hover:bg-white/5">
                <TableCell className="text-white font-medium">{blog.title}</TableCell>
                <TableCell>
                  <Badge variant={blog.status === 'published' ? "default" : "secondary"}>
                    {blog.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  {blog.published_date ? new Date(blog.published_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(blog)}
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(blog.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? 'No blogs found matching your search.' : 'No blogs found. Create your first blog post!'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogManagement;
