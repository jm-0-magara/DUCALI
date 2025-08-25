export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any[];
  resource_type?: 'image' | 'video' | 'raw';
  allowed_formats?: string[];
  max_file_size?: number;
}

class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
    

  }

  /**
   * Check if Cloudinary is properly configured
   */
  isConfigured(): boolean {
    return !!(this.cloudName && this.uploadPreset);
  }

  /**
   * Upload an image to Cloudinary using client-side upload
   */
  async uploadImage(
    file: File | string,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Check configuration first
      if (!this.isConfigured()) {
        throw new Error('Cloudinary not configured. Please check environment variables: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
      }

      if (typeof file === 'string') {
        throw new Error('URL uploads are not supported in client-side mode');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', options.folder || 'ducali/images');
      
      // Add transformations if specified
      if (options.transformation) {
        formData.append('transformation', JSON.stringify(options.transformation));
      }



      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );



      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        console.error('Cloudinary error response:', errorData);
        throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
      }

      const uploadResult = await response.json();

      return {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
        created_at: uploadResult.created_at,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload a video to Cloudinary using client-side upload
   */
  async uploadVideo(
    file: File | string,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Check configuration first
      if (!this.isConfigured()) {
        throw new Error('Cloudinary not configured. Please check environment variables: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
      }

      if (typeof file === 'string') {
        throw new Error('URL uploads are not supported in client-side mode');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', options.folder || 'ducali/videos');
      
      // Add transformations if specified
      if (options.transformation) {
        formData.append('transformation', JSON.stringify(options.transformation));
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        console.error('Cloudinary video error response:', errorData);
        throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
      }

      const uploadResult = await response.json();

      return {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
        created_at: uploadResult.created_at,
      };
    } catch (error) {
      console.error('Cloudinary video upload error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload video');
    }
  }

  /**
   * Generate optimized image URL with transformations
   */
  getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
      crop?: string;
      gravity?: string;
      blur?: boolean;
    } = {}
  ): string {
    const transformations = [];
    
    if (options.width || options.height) {
      transformations.push(`w_${options.width || 'auto'},h_${options.height || 'auto'}`);
    }
    
    if (options.crop) {
      transformations.push(`c_${options.crop}`);
    }
    
    if (options.gravity) {
      transformations.push(`g_${options.gravity}`);
    }
    
    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    }
    
    if (options.format) {
      transformations.push(`f_${options.format}`);
    }

    if (options.blur) {
      transformations.push('e_blur:1000');
    }
    
    const transformationString = transformations.length > 0 ? transformations.join('/') + '/' : '';
    
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformationString}${publicId}`;
  }

  /**
   * Extract public ID from a Cloudinary URL
   */
  extractPublicIdFromUrl(url: string): string | null {
    try {
      // Match patterns like:
      // https://res.cloudinary.com/de3qsj9qa/image/upload/v1755370149/ducali/images/kj2p6murp0kaxg2ccu6e.jpg
      // https://res.cloudinary.com/de3qsj9qa/image/upload/ducali/images/kj2p6murp0kaxg2ccu6e.jpg
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting public ID from URL:', error);
      return null;
    }
  }

  /**
   * Generate optimized image URL from a full Cloudinary URL
   */
  getOptimizedImageUrlFromUrl(
    url: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
      crop?: string;
      gravity?: string;
      blur?: boolean;
    } = {}
  ): string {
    const publicId = this.extractPublicIdFromUrl(url);
    if (!publicId) {
      console.warn('Could not extract public ID from URL:', url);
      return url; // Return original URL if we can't extract public ID
    }
    return this.getOptimizedImageUrl(publicId, options);
  }

  /**
   * Generate optimized video URL with transformations
   */
  getOptimizedVideoUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
      crop?: string;
      gravity?: string;
    } = {}
  ): string {
    const transformations = [];
    
    if (options.width || options.height) {
      transformations.push(`w_${options.width || 'auto'},h_${options.height || 'auto'}`);
    }
    
    if (options.crop) {
      transformations.push(`c_${options.crop}`);
    }
    
    if (options.gravity) {
      transformations.push(`g_${options.gravity}`);
    }
    
    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    }
    
    if (options.format) {
      transformations.push(`f_${options.format}`);
    }
    
    const transformationString = transformations.length > 0 ? transformations.join('/') + '/' : '';
    
    return `https://res.cloudinary.com/${this.cloudName}/video/upload/${transformationString}${publicId}`;
  }

  /**
   * Generate video thumbnail URL
   */
  getVideoThumbnailUrl(publicId: string, time: string = '00:00:01'): string {
    return `https://res.cloudinary.com/${this.cloudName}/video/upload/so_${time},w_300,h_200,c_fill/${publicId}.jpg`;
  }
}

export const cloudinaryService = new CloudinaryService();
