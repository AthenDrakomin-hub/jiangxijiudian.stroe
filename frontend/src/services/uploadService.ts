import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param bucketName - The name of the storage bucket (default: 'images')
 * @returns The public URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (file: File, bucketName: string = 'images'): Promise<string | null> => {
  try {
    // Generate a unique filename with timestamp
    const fileName = `${Date.now()}-${file.name}`;
    
    // Upload the file to the specified bucket
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};

/**
 * Deletes a file from Supabase Storage
 * @param filePath - The path of the file to delete in the bucket
 * @param bucketName - The name of the storage bucket (default: 'images')
 * @returns True if deletion was successful, false otherwise
 */
export const deleteFile = async (filePath: string, bucketName: string = 'images'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

/**
 * Lists files in a Supabase Storage bucket
 * @param bucketName - The name of the storage bucket (default: 'images')
 * @returns Array of file objects
 */
export const listFiles = async (bucketName: string = 'images') => {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
};

export default supabase;