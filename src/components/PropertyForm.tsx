import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Upload, Plus, Trash2, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  location: z.string().min(1, "Location is required"),
  property_type: z.string().min(1, "Property type is required"),
  bedrooms: z.string().min(1, "Detail 1 is required"),
  bathrooms: z.string().min(1, "Detail 2 is required"),
  area_sqft: z.string().min(1, "Area is required"), // Changed to string
  status: z.string().min(1, "Status is required"),
  featured: z.boolean(),
  image_url: z.string().optional(),
  additional_images: z.array(z.string()).optional(),
});

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
  additional_images?: string[];
}

interface PropertyFormProps {
  property?: Property;
  onClose: () => void;
  onSave: () => void;
}

const PropertyForm = ({ property, onClose, onSave }: PropertyFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    property?.additional_images || []
  );
  const [showImageGallery, setShowImageGallery] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      price: property?.price || "",
      location: property?.location || "",
      property_type: property?.property_type || "",
      bedrooms: property?.bedrooms || "",
      bathrooms: property?.bathrooms || "",
      area_sqft: property?.area_sqft ? property.area_sqft.toString() : "", // Convert to string
      status: property?.status || "available",
      featured: property?.featured || false,
      image_url: property?.image_url || "",
      additional_images: property?.additional_images || [],
    },
  });

  const watchPropertyType = form.watch("property_type");
  const isCommercial = watchPropertyType === "commercial";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const submitData = {
        ...values,
        area_sqft: parseInt(values.area_sqft) || 0, // Convert back to number for database
        additional_images: additionalImages,
      };

      if (property?.id) {
        const { error } = await supabase
          .from('properties')
          .update(submitData)
          .eq('id', property.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert(submitData);

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
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      form.setValue('image_url', publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `additional_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setAdditionalImages(prev => [...prev, ...uploadedUrls]);

      toast({
        title: "Success",
        description: `${files.length} images uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload some images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addImageUrlField = () => {
    setAdditionalImages(prev => [...prev, ""]);
  };

  const updateImageUrl = (index: number, url: string) => {
    setAdditionalImages(prev => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
  };

  const removeImageUrl = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const getFieldLabel = (field: string) => {
    if (!isCommercial) {
      return field === 'bedrooms' ? 'Bedrooms' : 'Bathrooms';
    }
    return field === 'bedrooms' ? 'Space Details' : 'Additional Info';
  };

  const getFieldPlaceholder = (field: string) => {
    if (!isCommercial) {
      return field === 'bedrooms' 
        ? 'e.g., 3 BHK, Studio, or 2+1' 
        : 'e.g., 2, 2.5, or Common';
    }
    return field === 'bedrooms' 
      ? 'e.g., Office Space, Conference Room, Retail Floor' 
      : 'e.g., Parking Available, 24/7 Security, AC';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-100">
            {property ? 'Edit Property' : 'Add New Property'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageGallery(!showImageGallery)}
              className="text-gray-400 hover:text-white"
            >
              <Eye className="w-4 h-4 mr-1" />
              Gallery
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Property title"
                          {...field}
                          className="bg-black/20 border-blue-500/20 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Property Type */}
                <FormField
                  control={form.control}
                  name="property_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-blue-500/20 text-white">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g., ₹50,00,000 or Negotiable"
                          {...field}
                          className="bg-black/20 border-blue-500/20 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Property location"
                          {...field}
                          className="bg-black/20 border-blue-500/20 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Dynamic Field 1 */}
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">{getFieldLabel('bedrooms')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={getFieldPlaceholder('bedrooms')}
                          {...field}
                          className="bg-black/20 border-blue-500/20 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Dynamic Field 2 */}
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">{getFieldLabel('bathrooms')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={getFieldPlaceholder('bathrooms')}
                          {...field}
                          className="bg-black/20 border-blue-500/20 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Area - Now text input */}
                <FormField
                  control={form.control}
                  name="area_sqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">Area</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g., 1200 sqft, 500 sq.m, 2500 sq yards"
                          {...field}
                          className="bg-black/20 border-blue-500/20 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-100">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-blue-500/20 text-white">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-100">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Property description"
                        {...field}
                        className="bg-black/20 border-blue-500/20 text-white min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Main Image Upload */}
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-100">Main Property Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="bg-black/20 border-blue-500/20 text-white"
                        />
                        {field.value && (
                          <img
                            src={field.value}
                            alt="Property"
                            className="w-32 h-32 object-cover rounded"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Enhanced Photo Gallery Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-blue-100">Photo Gallery</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageUrlField}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    disabled={uploading}
                    className="bg-black/20 border-blue-500/20 text-white"
                  />
                  
                  {/* Image Gallery Grid */}
                  {showImageGallery && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/10 rounded-lg">
                      {form.watch('image_url') && (
                        <div className="relative">
                          <img
                            src={form.watch('image_url')}
                            alt="Main"
                            className="w-full h-20 object-cover rounded"
                          />
                          <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                            Main
                          </div>
                        </div>
                      )}
                      {additionalImages.filter(Boolean).map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImageUrl(index)}
                            className="absolute top-1 right-1 w-6 h-6 p-0 border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {additionalImages.map((imageUrl, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="bg-black/20 border-blue-500/20 text-white flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImageUrl(index)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={`Additional ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-blue-500/20 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-blue-100">
                        Featured Property
                      </FormLabel>
                      <div className="text-sm text-gray-400">
                        This property will be highlighted on the homepage
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-500 text-gray-300 hover:bg-gray-500/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={uploading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {property ? 'Update Property' : 'Create Property'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;
