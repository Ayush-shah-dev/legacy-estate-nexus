
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 2048; // pixels

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  // Check if it's actually an image by trying to create an image element
  return new Promise<{ valid: boolean; error?: string }>((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Check dimensions
      if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
        resolve({ valid: false, error: `Image dimensions must be less than ${MAX_IMAGE_DIMENSION}px` });
      } else {
        resolve({ valid: true });
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: 'Invalid image file' });
    };
    
    img.src = url;
  }) as any;
};

export const sanitizeFileName = (fileName: string): string => {
  // Remove any potentially dangerous characters and normalize
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100); // Limit length
};

export const uploadImageSecurely = async (
  file: File,
  bucket: 'blogs' | 'testimonials',
  folder?: string
): Promise<UploadResult> => {
  try {
    // Validate file
    const validation = await validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate secure filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const sanitizedName = sanitizeFileName(file.name.split('.')[0]);
    
    const fileName = folder 
      ? `${folder}/${timestamp}_${randomString}_${sanitizedName}.${fileExtension}`
      : `${timestamp}_${randomString}_${sanitizedName}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload image' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
};

export const deleteImageSecurely = async (
  url: string,
  bucket: 'blogs' | 'testimonials'
): Promise<boolean> => {
  try {
    // Extract path from URL
    const urlParts = url.split('/');
    const path = urlParts[urlParts.length - 1];
    
    if (!path) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    return !error;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
