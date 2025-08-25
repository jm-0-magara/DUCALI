import { storage } from './firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  StorageReference
} from 'firebase/storage';

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  downloadURL?: string;
  error?: string;
}

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  path?: string;
  fileName?: string;
  onProgress?: (progress: UploadProgress) => void;
}

class UploadService {
  private defaultMaxSize = 5 * 1024 * 1024; // 5MB
  private defaultAllowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];

  // Upload profile picture
  async uploadProfilePicture(
    file: File, 
    userId: string, 
    options: UploadOptions = {}
  ): Promise<string> {
    const {
      maxSize = this.defaultMaxSize,
      allowedTypes = this.defaultAllowedTypes,
      onProgress
    } = options;

    // Validate file
    this.validateFile(file, maxSize, allowedTypes);

    try {
      // Create unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-${userId}-${Date.now()}.${fileExtension}`;
      const filePath = `profile-pictures/${fileName}`;
      
      // Create storage reference
      if (!storage) throw new Error('Storage not initialized');
      const storageRef = ref(storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Report progress
      if (onProgress) {
        onProgress({
          progress: 100,
          status: 'completed',
          downloadURL
        });
      }

      return downloadURL;
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      
      if (onProgress) {
        onProgress({
          progress: 0,
          status: 'error',
          error: error.message || 'Upload failed'
        });
      }
      
      throw new Error(error.message || 'Failed to upload profile picture');
    }
  }

  // Upload portfolio image
  async uploadPortfolioImage(
    file: File,
    userId: string,
    options: UploadOptions = {}
  ): Promise<string> {
    const {
      maxSize = this.defaultMaxSize,
      allowedTypes = this.defaultAllowedTypes,
      onProgress
    } = options;

    // Validate file
    this.validateFile(file, maxSize, allowedTypes);

    try {
      // Create unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `portfolio-${userId}-${Date.now()}.${fileExtension}`;
      const filePath = `portfolio-images/${fileName}`;
      
      // Create storage reference
      if (!storage) throw new Error('Storage not initialized');
      const storageRef = ref(storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Report progress
      if (onProgress) {
        onProgress({
          progress: 100,
          status: 'completed',
          downloadURL
        });
      }

      return downloadURL;
    } catch (error: any) {
      console.error('Portfolio image upload error:', error);
      
      if (onProgress) {
        onProgress({
          progress: 0,
          status: 'error',
          error: error.message || 'Upload failed'
        });
      }
      
      throw new Error(error.message || 'Failed to upload portfolio image');
    }
  }

  // Upload general file
  async uploadFile(
    file: File,
    path: string,
    options: UploadOptions = {}
  ): Promise<string> {
    const {
      maxSize = this.defaultMaxSize,
      allowedTypes = this.defaultAllowedTypes,
      fileName,
      onProgress
    } = options;

    // Validate file
    this.validateFile(file, maxSize, allowedTypes);

    try {
      // Create filename
      const finalFileName = fileName || `${Date.now()}-${file.name}`;
      const filePath = `${path}/${finalFileName}`;
      
      // Create storage reference
      if (!storage) throw new Error('Storage not initialized');
      const storageRef = ref(storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Report progress
      if (onProgress) {
        onProgress({
          progress: 100,
          status: 'completed',
          downloadURL
        });
      }

      return downloadURL;
    } catch (error: any) {
      console.error('File upload error:', error);
      
      if (onProgress) {
        onProgress({
          progress: 0,
          status: 'error',
          error: error.message || 'Upload failed'
        });
      }
      
      throw new Error(error.message || 'Failed to upload file');
    }
  }

  // Delete file
  async deleteFile(filePath: string): Promise<void> {
    try {
      if (!storage) throw new Error('Storage not initialized');
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error: any) {
      console.error('File deletion error:', error);
      throw new Error(error.message || 'Failed to delete file');
    }
  }

  // Delete profile picture
  async deleteProfilePicture(userId: string): Promise<void> {
    try {
      if (!storage) throw new Error('Storage not initialized');
      const profilePicturesRef = ref(storage, 'profile-pictures');
      const result = await listAll(profilePicturesRef);
      
      // Find and delete user's profile picture
      const userProfilePicture = result.items.find(item => 
        item.name.includes(`profile-${userId}-`)
      );
      
      if (userProfilePicture) {
        await deleteObject(userProfilePicture);
      }
    } catch (error: any) {
      console.error('Profile picture deletion error:', error);
      throw new Error(error.message || 'Failed to delete profile picture');
    }
  }

  // Validate file
  private validateFile(file: File, maxSize: number, allowedTypes: string[]): void {
    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.formatBytes(maxSize)}`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  // Format bytes to human readable format
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file extension from filename
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Check if file is an image
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  // Generate preview URL for image files
  generatePreviewURL(file: File): string {
    if (!this.isImageFile(file)) {
      throw new Error('File is not an image');
    }
    return URL.createObjectURL(file);
  }

  // Revoke preview URL to free memory
  revokePreviewURL(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const uploadService = new UploadService();
