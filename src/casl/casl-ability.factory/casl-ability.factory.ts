import { Injectable } from "@nestjs/common";
import { Action, IUser } from "src/configs/define.interface";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { FORBIDDEN_CREATE_PRODUCT, FORBIDDEN_DELETE_MYSELF, FORBIDDEN_DELETE_PRODUCT, FORBIDDEN_DELETE_USER, FORBIDDEN_READ_BY_ID, FORBIDDEN_READ_USERS, FORBIDDEN_UPDATE, FORBIDDEN_UPDATE_PRODUCT } from "src/configs/response.constants";
import { ProductSubject, UserSubject } from "src/configs/define.class";
export type Subjects = InferSubjects<typeof UserSubject> |
    InferSubjects<typeof ProductSubject> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: IUser) {

        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        if (user.role === 'ADMIN') {
            can(Action.Manage, 'all'); // read-write access to everything
            cannot(Action.Delete, UserSubject, { _id: { $eq: user._id } }).because(FORBIDDEN_DELETE_MYSELF)
        } else {
            cannot(Action.Read, UserSubject).because(FORBIDDEN_READ_USERS);
            cannot(Action.Delete, UserSubject).because(FORBIDDEN_DELETE_USER);
            cannot(Action.Update, UserSubject).because(FORBIDDEN_UPDATE);
            can(Action.Update, UserSubject, { _id: { $eq: user._id } });
            cannot(Action.Read, UserSubject).because(FORBIDDEN_READ_BY_ID);
            can(Action.Read, UserSubject, { _id: { $eq: user._id } });
            //product
            cannot(Action.Create, ProductSubject).because(FORBIDDEN_CREATE_PRODUCT);
            cannot(Action.Update, ProductSubject).because(FORBIDDEN_UPDATE_PRODUCT);
            cannot(Action.Delete, ProductSubject).because(FORBIDDEN_DELETE_PRODUCT);
            can(Action.Rating, ProductSubject);
        }

        return build({
            // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}