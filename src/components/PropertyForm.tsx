
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface Property {
  id?: string;
  title: string;
  description: string;
  price: string;
  location: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  area_sqft: number;
  status: string;
  featured: boolean;
  image_url: string;
}

interface PropertyFormProps {
  property?: Property;
  onClose: () => void;
  onSave: () => void;
}

const PropertyForm = ({ property, onClose, onSave }: PropertyFormProps) => {
  const [formData, setFormData] = useState<Property>({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || "",
    location: property?.location || "",
    property_type: property?.property_type || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    area_sqft: property?.area_sqft || 0,
    status: property?.status || "available",
    featured: property?.featured || false,
    image_url: property?.image_url || "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (property?.id) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(formData)
          .eq('id', property.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        // Create new property
        const { error } = await supabase
          .from('properties')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property created successfully",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-blue-500/20 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-100">
            {property ? 'Edit Property' : 'Add New Property'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-blue-100">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-black/20 border-blue-500/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-blue-100">Price</Label>
                <Input
                  id="price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="bg-black/20 border-blue-500/20 text-white"
                  placeholder="e.g., ₹2.5 Cr, $500K, Contact for Price"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-100">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-black/20 border-blue-500/20 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-blue-100">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-black/20 border-blue-500/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property_type" className="text-blue-100">Property Type</Label>
                <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                  <SelectTrigger className="bg-black/20 border-blue-500/20 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-blue-100">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="text"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className="bg-black/20 border-blue-500/20 text-white"
                  placeholder="e.g., 2, 3BHK, Studio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-blue-100">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="text"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className="bg-black/20 border-blue-500/20 text-white"
                  placeholder="e.g., 2, 2.5, Multiple"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_sqft" className="text-blue-100">Area (sq ft)</Label>
                <Input
                  id="area_sqft"
                  type="number"
                  value={formData.area_sqft}
                  onChange={(e) => handleInputChange('area_sqft', parseInt(e.target.value))}
                  className="bg-black/20 border-blue-500/20 text-white"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-blue-100">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-black/20 border-blue-500/20 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-blue-100">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className="bg-black/20 border-blue-500/20 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured" className="text-blue-100">Featured Property</Label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-500 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;
