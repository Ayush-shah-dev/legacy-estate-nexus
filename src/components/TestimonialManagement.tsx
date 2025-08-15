
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
import { Plus, Edit, Trash2, Star, Upload } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  designation: string | null;
  quote: string;
  profile_image: string | null;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    quote: "",
    status: "draft" as 'published' | 'draft'
  });

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
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = editingTestimonial?.profile_image || null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) return;
      }

      const testimonialData = {
        ...formData,
        designation: formData.designation || null,
        profile_image: imageUrl
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
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

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation || "",
      quote: testimonial.quote,
      status: testimonial.status
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      designation: "",
      quote: "",
      status: "draft"
    });
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Card className="bg-black/20 border-purple-500/20 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-purple-100 flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-400" />
              Testimonial Management ({testimonials.length})
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage customer testimonials and reviews
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-purple-500/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-purple-100">
                  {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingTestimonial ? 'Update testimonial details' : 'Add a new testimonial'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="designation" className="text-gray-300">Designation (Optional)</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="bg-slate-800 border-gray-600 text-white"
                    placeholder="e.g., CEO, Business Owner"
                  />
                </div>

                <div>
                  <Label htmlFor="quote" className="text-gray-300">Quote/Testimonial</Label>
                  <Textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="bg-slate-800 border-gray-600 text-white"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image" className="text-gray-300">Profile Image (Optional)</Label>
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
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {uploading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      editingTestimonial ? 'Update' : 'Create'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Designation</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Created</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id} className="border-gray-700 hover:bg-white/5">
                <TableCell className="text-white font-medium">{testimonial.name}</TableCell>
                <TableCell className="text-gray-300">{testimonial.designation || '-'}</TableCell>
                <TableCell>
                  <Badge variant={testimonial.status === 'published' ? "default" : "secondary"}>
                    {testimonial.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  {new Date(testimonial.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(testimonial)}
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(testimonial.id)}
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

        {testimonials.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No testimonials found. Create your first testimonial!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialManagement;
