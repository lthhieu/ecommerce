import { AppAbility } from "src/casl/casl-ability.factory/casl-ability.factory";

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

interface IPolicyHandler {
    handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;