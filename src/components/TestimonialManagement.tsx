
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
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Upload,
  User
} from "lucide-react";

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

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
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
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('testimonials')
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

  const handleSaveTestimonial = async (testimonialData: Partial<Testimonial>) => {
    try {
      let imageUrl = testimonialData.profile_image;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) return;
      }

      const testimonialPayload = {
        ...testimonialData,
        profile_image: imageUrl,
        updated_at: new Date().toISOString()
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialPayload)
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialPayload]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      fetchTestimonials();
      setIsDialogOpen(false);
      setEditingTestimonial(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (testimonial.designation && testimonial.designation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-black/20 border-purple-500/20 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-purple-100 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
              Testimonial Management ({testimonials.length})
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create and manage client testimonials
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingTestimonial(null);
                  setImageFile(null);
                }}
                className="bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <TestimonialDialog
              testimonial={editingTestimonial}
              onSave={handleSaveTestimonial}
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
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-white/5 border-gray-600 text-white"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Designation</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.map((testimonial) => (
              <TableRow key={testimonial.id} className="border-gray-700 hover:bg-white/5">
                <TableCell className="text-white font-medium">{testimonial.name}</TableCell>
                <TableCell className="text-gray-400">{testimonial.designation || '-'}</TableCell>
                <TableCell>
                  <Badge variant={testimonial.status === 'published' ? "default" : "secondary"}>
                    {testimonial.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTestimonial(testimonial);
                        setIsDialogOpen(true);
                      }}
                      className="text-purple-400 hover:bg-purple-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
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
      </CardContent>
    </Card>
  );
};

const TestimonialDialog = ({ 
  testimonial, 
  onSave, 
  imageFile, 
  setImageFile, 
  uploading 
}: {
  testimonial: Testimonial | null;
  onSave: (data: Partial<Testimonial>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  uploading: boolean;
}) => {
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

  return (
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
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
  );
};

export default TestimonialManagement;
