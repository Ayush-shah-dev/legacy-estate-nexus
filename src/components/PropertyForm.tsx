import React, { useState } from 'react';
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
import { Upload, X, Plus, Bold, Italic, List, Type } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  price: z.number().min(1, {
    message: "Price must be greater than 0.",
  }),
  amenities: z.string().optional(),
  project_details: z.string().optional(),
  imageFiles: z.array(z.instanceof(File))
    .max(5, "You can upload up to 5 images.")
    .optional(),
  existingImageUrls: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false).optional(),
  is_active: z.boolean().default(true).optional(),
});

interface PropertyFormProps {
  property?: any;
  onSave: () => void;
  onCancel: () => void;
}

type PropertyFormData = z.infer<typeof PropertyFormDataSchema>;

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSave, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(property?.image_urls || []);
  const [files, setFiles] = useState<File[]>([]);

  const { toast } = useToast();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(PropertyFormDataSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      property_type: property?.property_type || "",
      location: property?.location || "",
      price: property?.price || 0,
      amenities: property?.amenities || "",
      project_details: property?.project_details || "",
      existingImageUrls: property?.image_urls || [],
      is_featured: property?.is_featured || false,
      is_active: property?.is_active || true,
    },
    mode: "onChange",
  });

  const [showFormatHelp, setShowFormatHelp] = useState(false);

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
    setImageUrls(imageUrls.filter(imageUrl => imageUrl !== url));
    form.setValue("existingImageUrls", imageUrls.filter(imageUrl => imageUrl !== url));
  };

  const formatText = (type: 'bold' | 'italic' | 'bullet') => {
    const textarea = document.querySelector('[name="project_details"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let formattedText = '';
    
    switch (type) {
      case 'bold':
        formattedText = selectedText ? `**${selectedText}**` : '**Bold Text**';
        break;
      case 'italic':
        formattedText = selectedText ? `*${selectedText}*` : '*Italic Text*';
        break;
      case 'bullet':
        if (selectedText) {
          formattedText = selectedText.split('\n').map(line => line.trim() ? `• ${line.trim()}` : line).join('\n');
        } else {
          formattedText = '• Bullet Point';
        }
        break;
    }

    const newValue = beforeText + formattedText + afterText;
    form.setValue('project_details', newValue);
    
    // Set cursor position after formatting
    setTimeout(() => {
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
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

        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${storagePath}`;
        return imageUrl;
      });

      const uploadedImageUrls = (await Promise.all(imageUploads)).filter(url => url !== null) as string[];
      const allImageUrls = [...(data.existingImageUrls || []), ...uploadedImageUrls];

      const propertyData = {
        ...data,
        price: Number(data.price),
        image_urls: allImageUrls,
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
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
                        placeholder="Detailed property description..."
                        className="min-h-[100px] resize-y"
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
                    <FormLabel>Price (INR)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Property Price in INR"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <FormControl>
                      <Input placeholder="List of amenities (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Details with Enhanced Formatting */}
              <FormField
                control={form.control}
                name="project_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Details</FormLabel>
                    <div className="space-y-2">
                      {/* Formatting Toolbar */}
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => formatText('bold')}
                          className="h-8 px-2"
                        >
                          <Bold className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => formatText('italic')}
                          className="h-8 px-2"
                        >
                          <Italic className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => formatText('bullet')}
                          className="h-8 px-2"
                        >
                          <List className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFormatHelp(!showFormatHelp)}
                          className="h-8 px-2 text-muted-foreground"
                        >
                          <Type className="h-3 w-3 mr-1" />
                          Help
                        </Button>
                      </div>
                      
                      {showFormatHelp && (
                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          <p className="font-medium mb-2">Formatting Guide:</p>
                          <ul className="space-y-1">
                            <li>• Use <code>**text**</code> for <strong>bold text</strong></li>
                            <li>• Use <code>*text*</code> for <em>italic text</em></li>
                            <li>• Use <code>• text</code> for bullet points</li>
                            <li>• Select text and click buttons to format automatically</li>
                          </ul>
                        </div>
                      )}
                      
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter detailed project information with amenities, features, and highlights..."
                          className="min-h-[120px] resize-y"
                        />
                      </FormControl>
                    </div>
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
                      Upload up to 5 images. Max size: 5MB each. Accepted types: JPEG, JPG, PNG, WEBP.
                    </p>
                  </FormItem>
                )}
              />

              {/* Featured and Active Status */}
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-5 w-5 border-primary focus:ring-0 focus:ring-offset-0"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        Featured
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-5 w-5 border-primary focus:ring-0 focus:ring-offset-0"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        Active
                      </FormLabel>
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
                  {isUploading ? 'Uploading...' : property ? 'Update Property' : 'Contact Us'}
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
