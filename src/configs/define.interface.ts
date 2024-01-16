import { Subjects } from "src/casl/casl-ability.factory/casl-ability.factory";

export interface IUser {
    _id: string;
    email: string;
    role: string;
}
export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
    Rating = 'Rating',
    LikeOrDislike = 'LikeOrDisLike'
}

export interface PolicyHandler {
    action: Action,
    subject: Subjects
}