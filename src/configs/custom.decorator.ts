import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common'

export const ResponseMessageKey = 'ResponseMessageKey'
export const ResponseMessage = (message: string) => SetMetadata(ResponseMessageKey, message)

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);