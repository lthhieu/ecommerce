// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File, folder: any): Promise<CloudinaryResponse> {
        if (!folder) folder = 'default'
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: `ecommerce/${folder}`
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            },)

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}
