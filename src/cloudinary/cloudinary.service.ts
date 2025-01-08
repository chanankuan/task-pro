import { BadRequestException, Injectable } from '@nestjs/common';
import { cloudinary } from 'src/config/cloudinary.config';

@Injectable()
export class CloudinaryService {
  async upload(filePath: string, folderName: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `task_pro/${folderName}`, // Optional: Specify folder in Cloudinary
      });

      // Return the Cloudinary URL
      return result.secure_url;
    } catch (error) {
      throw new BadRequestException(
        'Failed to upload to Cloudinary: ' + error.message,
      );
    }
  }

  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException(
        'Failed to upload to Cloudinary: ' + error.message,
      );
    }
  }
}
