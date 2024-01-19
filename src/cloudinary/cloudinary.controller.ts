import { Controller, HttpStatus, ParseFilePipeBuilder, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Public } from 'src/configs/custom.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload')
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile(
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
        // return file
        const folder = req.headers['folder']
        return this.cloudinaryService.uploadFile(file, folder);
    }
}
