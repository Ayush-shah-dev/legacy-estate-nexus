
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

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

interface BlogDialogProps {
  blog: Blog | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Blog>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  uploading: boolean;
}

export const BlogDialog = ({ 
  blog, 
  isOpen,
  onClose,
  onSave, 
  imageFile, 
  setImageFile, 
  uploading 
}: BlogDialogProps) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Basic file validation
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
    }
    
    setImageFile(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                onChange={handleFileChange}
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
              type="button"
              variant="outline"
              onClick={onClose}
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
                blog ? 'Update Blog' : 'Create Blog'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
