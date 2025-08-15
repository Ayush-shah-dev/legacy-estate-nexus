
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, User } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  designation: string | null;
  quote: string;
  profile_image: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface TestimonialDialogProps {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Testimonial>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  uploading: boolean;
}

export const TestimonialDialog = ({ 
  testimonial, 
  isOpen,
  onClose,
  onSave, 
  imageFile, 
  setImageFile, 
  uploading 
}: TestimonialDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    quote: '',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        designation: testimonial.designation || '',
        quote: testimonial.quote,
        status: testimonial.status
      });
    } else {
      setFormData({
        name: '',
        designation: '',
        quote: '',
        status: 'draft'
      });
    }
  }, [testimonial]);

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
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {testimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white/5 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="designation" className="text-gray-300">Designation (Optional)</Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="bg-white/5 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="quote" className="text-gray-300">Quote</Label>
            <Textarea
              id="quote"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              required
              rows={4}
              className="bg-white/5 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="profile_image" className="text-gray-300">Profile Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="profile_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-white/5 border-gray-600 text-white"
              />
              <User className="w-5 h-5 text-gray-400" />
            </div>
            {testimonial?.profile_image && !imageFile && (
              <img 
                src={testimonial.profile_image} 
                alt="Current profile image" 
                className="mt-2 w-16 h-16 rounded-full object-cover"
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
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                testimonial ? 'Update Testimonial' : 'Create Testimonial'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
