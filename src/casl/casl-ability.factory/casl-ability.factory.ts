import { Injectable } from "@nestjs/common";
import { Action, IUser } from "src/configs/define.interface";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { User } from "src/users/schemas/user.schema";
type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: IUser) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        if (user.role === 'ADMIN') {
            can(Action.Manage, 'all'); // read-write access to everything
        } else {
            cannot(Action.Read, User); // read-only access to everything
            can(Action.Update, User, { email: user.email });
        }

        return build({
            // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}