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
}