import React, { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const PropertyFormDataSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  property_type: z.string().min(1, {
    message: "Please select a property type.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  area_sqft: z.string().optional(),
  project_details: z.string().optional(),
  youtube_url: z.string().optional(),
  imageFiles: z.array(z.instanceof(File))
    .max(5, "You can upload up to 5 images.")
    .optional(),
  existingImageUrls: z.array(z.string()).optional(),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("available").optional(),
});

interface PropertyFormProps {
  property?: any;
  onSave: () => void;
  onCancel: () => void;
}

type PropertyFormData = z.infer<typeof PropertyFormDataSchema>;

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSave, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const { toast } = useToast();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(PropertyFormDataSchema),
    defaultValues: {
      title: "",
      description: "",
      property_type: "",
      location: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      area_sqft: "",
      project_details: "",
      youtube_url: "",
      existingImageUrls: [],
      featured: false,
      status: "available",
    },
    mode: "onChange",
  });

  // Reset form and state when property prop changes
  useEffect(() => {
    const getExistingImages = (prop: any) => {
      if (!prop) return [];
      const existingImages = [];
      if (prop.image_url) existingImages.push(prop.image_url);
      if (prop.additional_images) existingImages.push(...prop.additional_images);
      return existingImages;
    };

    const existingImages = getExistingImages(property);
    
    // Reset form with new values
    form.reset({
      title: property?.title || "",
      description: property?.description || "",
      property_type: property?.property_type || "",
      location: property?.location || "",
      price: property?.price?.toString() || "",
      bedrooms: property?.bedrooms || "",
      bathrooms: property?.bathrooms || "",
      area_sqft: property?.area_sqft || "",
      project_details: property?.project_details || "",
      youtube_url: property?.youtube_url || "",
      existingImageUrls: existingImages,
      featured: property?.featured || false,
      status: property?.status || "available",
    });

    // Reset image state
    setImageUrls(existingImages);
    setFiles([]);
  }, [property, form]);

  const handleBulletKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    const getLineStart = (pos: number) => {
      const idx = value.lastIndexOf('\n', Math.max(0, pos - 1));
      return idx === -1 ? 0 : idx + 1;
    };

    // Convert dash/star to bullet at line start when pressing space
    if (e.key === ' ') {
      const lineStart = getLineStart(selectionStart);
      const current = value.slice(lineStart, selectionStart);
      if (current === '-' || current === '*') {
        e.preventDefault();
        const newValue = value.slice(0, lineStart) + '• ' + value.slice(selectionStart);
        form.setValue('project_details', newValue, { shouldDirty: true });
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = lineStart + 2;
        });
      }
      return;
    }

    // Continue bullet on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = getLineStart(selectionStart);
      const currentLine = value.slice(lineStart, selectionStart);
      let bullet = '• ';
      const trimmed = currentLine.trimStart();
      if (trimmed.startsWith('• ')) bullet = '• ';
      else if (trimmed.startsWith('- ')) bullet = '- ';
      else if (trimmed.startsWith('* ')) bullet = '* ';

      const insert = '\n' + bullet;
      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);
      const newValue = before + insert + after;
      form.setValue('project_details', newValue, { shouldDirty: true });
      requestAnimationFrame(() => {
        const pos = before.length + insert.length;
        textarea.selectionStart = textarea.selectionEnd = pos;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
  
    if (newFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "You can only upload a maximum of 5 files.",
        variant: "destructive",
      });
      return;
    }
  
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > 5) {
      toast({
        title: "Too many files",
        description: "You can only upload a maximum of 5 files in total.",
        variant: "destructive",
      });
      return;
    }
  
    newFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `File ${file.name} exceeds the maximum file size of 5MB.`,
          variant: "destructive",
        });
        return;
      }
  
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `File ${file.name} is not a valid image type. Only JPEG, JPG, PNG, and WEBP are allowed.`,
          variant: "destructive",
        });
        return;
      }
    });
  
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    const updatedUrls = imageUrls.filter(imageUrl => imageUrl !== url);
    setImageUrls(updatedUrls);
    form.setValue("existingImageUrls", updatedUrls);
  };

  const handleSubmit = async (data: PropertyFormData) => {
    setIsUploading(true);
    try {
      const imageUploads = files.map(async (file) => {
        const uniqueId = Date.now();
        const storagePath = `properties/${uniqueId}-${file.name}`;
        const { error } = await supabase.storage
          .from('property-images')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Image Upload Failed",
            description: `Failed to upload ${file.name}. Please try again.`,
            variant: "destructive",
          });
          return null;
        }

        const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(storagePath);
        return urlData.publicUrl;
      });

      const uploadedImageUrls = (await Promise.all(imageUploads)).filter(url => url !== null) as string[];
      const allImageUrls = [...(data.existingImageUrls || []), ...uploadedImageUrls];

      const propertyData = {
        title: data.title,
        description: data.description,
        property_type: data.property_type,
        location: data.location,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area_sqft: data.area_sqft,
        project_details: data.project_details,
        youtube_url: data.youtube_url,
        featured: data.featured,
        status: data.status,
        image_url: allImageUrls[0] || null,
        additional_images: allImageUrls.slice(1),
      };

      if (property) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id);

        if (error) {
          throw error;
        }
        toast({
          title: "Property Updated",
          description: "Property has been updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) {
          throw error;
        }

        toast({
          title: "Property Added",
          description: "Property has been added successfully!",
        });
      }

      onSave();
    } catch (error: any) {
      console.error("Error during submission:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{property ? 'Edit Property' : 'Add New Property'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Property Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief property description..."
                        className="min-h-[80px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
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

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Property Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 50L, 2.5Cr, Negotiable"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {form.watch('property_type') !== 'commercial' && (
                  <>
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2 BHK, Studio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2, 1.5, 3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="area_sqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 850 sqft, 5 acres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="project_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features & Amenities</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="List key features and amenities (use • for bullet points)..."
                        className="min-h-[100px] resize-y"
                        onKeyDown={handleBulletKeyDown}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtube_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.trim();
                          
                          // If user enters a YouTube URL without protocol, add https://
                          if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                            if (value.startsWith('youtube.com') || value.startsWith('www.youtube.com') || 
                                value.startsWith('youtu.be') || value.startsWith('www.youtu.be')) {
                              value = 'https://' + value;
                            }
                          }
                          
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageFiles"
                render={() => (
                  <FormItem>
                    <FormLabel>Property Images</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-3">
                        <label
                          htmlFor="image-upload"
                          className="relative flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted hover:bg-accent"
                        >
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={handleImageChange}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </label>
                        {files.map((file, index) => (
                          <div key={index} className="relative w-32 h-32">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="object-cover w-full h-full rounded-md"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-background/80 text-destructive hover:bg-background"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative w-32 h-32">
                            <img
                              src={url}
                              alt={`Property Image ${index}`}
                              className="object-cover w-full h-full rounded-md"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-1 right-1 bg-background/80 text-destructive hover:bg-background"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload up to 5 images. Max size: 5MB each.
                    </p>
                  </FormItem>
                )}
              />

              {/* Featured and Status */}
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium">
                        Featured Property
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : property ? 'Update Property' : 'Add Property'}
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