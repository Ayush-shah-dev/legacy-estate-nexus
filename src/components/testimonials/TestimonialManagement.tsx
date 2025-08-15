
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TestimonialDialog } from "./TestimonialDialog";
import { TestimonialDeleteDialog } from "./TestimonialDeleteDialog";
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Shield
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
  const { isAdmin, loading: authLoading } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchTestimonials();
    } else if (!authLoading && !isAdmin) {
      setLoading(false);
    }
  }, [isAdmin, authLoading]);

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

  const handleDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });

      fetchTestimonials();
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
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

  // Show access denied if not admin
  if (!authLoading && !isAdmin) {
    return (
      <Card className="bg-black/20 border-red-500/20 backdrop-blur-xl">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Shield className="w-16 h-16 text-red-400 mx-auto" />
            <h3 className="text-xl font-semibold text-red-400">Access Denied</h3>
            <p className="text-gray-400">You need admin privileges to access testimonial management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
            <Button 
              onClick={() => {
                setEditingTestimonial(null);
                setImageFile(null);
                setIsDialogOpen(true);
              }}
              className="bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
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
                        onClick={() => {
                          setTestimonialToDelete(testimonial);
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
        </CardContent>
      </Card>

      <TestimonialDialog
        testimonial={editingTestimonial}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTestimonial(null);
          setImageFile(null);
        }}
        onSave={handleSaveTestimonial}
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploading={uploading}
      />

      <TestimonialDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTestimonialToDelete(null);
        }}
        onConfirm={handleDeleteTestimonial}
        testimonialName={testimonialToDelete?.name || ''}
      />
    </>
  );
};

export default TestimonialManagement;
