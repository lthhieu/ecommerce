import { Controller, HttpStatus, ParseFilePipeBuilder, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { UPLOAD_FILES } from 'src/configs/response.constants';
import { CheckPolicies, ResponseMessage } from 'src/configs/custom.decorator';
import { Action } from 'src/configs/define.interface';
import { UploadSubject } from 'src/configs/define.class';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload-images')
    @CheckPolicies({ action: Action.Upload, subject: UploadSubject })
    @ResponseMessage(UPLOAD_FILES)
    @UseInterceptors(FilesInterceptor('files', 5))
    async uploadImages(@UploadedFiles(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /^image\/(gif|png|jpeg|tiff|webp)$/i
            })
            .addMaxSizeValidator({
                maxSize: 1024 * 10
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            }),
    ) files: Array<Express.Multer.File>, @Req() req: Request) {
        const folder = req.headers['folder']
        return {
            images: await Promise.all(files.map(async (file) => {
                const fileResponse = await this.cloudinaryService.uploadFile(file, folder);
                return fileResponse.secure_url;
            }))
        }
    }

    @Post('upload-image')
    @CheckPolicies({ action: Action.Upload, subject: UploadSubject })
    @ResponseMessage(UPLOAD_FILES)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                // /^text\/plain$|^image\/(gif|png|jpeg|tiff|webp)$/i
                fileType: /^image\/(gif|png|jpeg|tiff|webp)$/i
            })
            .addMaxSizeValidator({ // in bytes: 1024bytes = 1kb
                maxSize: 1024 * 10 // 10kb
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                // exceptionFactory(error) {
                //     if (error.includes('size'))
                //         throw new UnprocessableEntityException('Size lớn hơn 10KB rồi', { cause: new Error(), description: 'Unprocessable Entity' });
                //     else
                //         throw new UnprocessableEntityException('Định dạng ảnh mới được', { cause: new Error(), description: 'Unprocessable Entity' });
                // },
            }),
    ) file: Express.Multer.File, @Req() req: Request) {
        const folder = req.headers['folder']
        const response = await this.cloudinaryService.uploadFile(file, folder)
        return response.secure_url
    }
}
