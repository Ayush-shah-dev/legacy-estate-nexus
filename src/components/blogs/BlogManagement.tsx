
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BlogDialog } from "./BlogDialog";
import { BlogDeleteDialog } from "./BlogDeleteDialog";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Shield
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
  const { isAdmin, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const blogsPerPage = 10;

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchBlogs();
    } else if (!authLoading && !isAdmin) {
      setLoading(false);
    }
  }, [isAdmin, authLoading]);

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

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });

      fetchBlogs();
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
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

  // Show access denied if not admin
  if (!authLoading && !isAdmin) {
    return (
      <Card className="bg-black/20 border-red-500/20 backdrop-blur-xl">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Shield className="w-16 h-16 text-red-400 mx-auto" />
            <h3 className="text-xl font-semibold text-red-400">Access Denied</h3>
            <p className="text-gray-400">You need admin privileges to access blog management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading || authLoading) {
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
    <>
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
            <Button 
              onClick={() => {
                setEditingBlog(null);
                setImageFile(null);
                setIsDialogOpen(true);
              }}
              className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Blog
            </Button>
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
                        onClick={() => {
                          setBlogToDelete(blog);
                          setDeleteDialogOpen(true);
                        }}
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

      <BlogDialog
        blog={editingBlog}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingBlog(null);
          setImageFile(null);
        }}
        onSave={handleSaveBlog}
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploading={uploading}
      />

      <BlogDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteBlog}
        blogTitle={blogToDelete?.title || ''}
      />
    </>
  );
};

export default BlogManagement;
