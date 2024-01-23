import { Injectable } from "@nestjs/common";
import { Action, IUser } from "src/configs/define.interface";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { FORBIDDEN_CREATE_BLOG, FORBIDDEN_CREATE_BLOG_CATEGORY, FORBIDDEN_CREATE_BRAND, FORBIDDEN_CREATE_COUPON, FORBIDDEN_CREATE_PRODUCT, FORBIDDEN_DELETE_BLOG, FORBIDDEN_DELETE_BLOG_CATEGORY, FORBIDDEN_DELETE_BRAND, FORBIDDEN_DELETE_CATEGORY, FORBIDDEN_DELETE_COUPON, FORBIDDEN_DELETE_MYSELF, FORBIDDEN_DELETE_PRODUCT, FORBIDDEN_DELETE_USER, FORBIDDEN_ORDER_UPDATED, FORBIDDEN_READ_BY_ID, FORBIDDEN_READ_USERS, FORBIDDEN_UPDATE, FORBIDDEN_UPDATE_BLOG, FORBIDDEN_UPDATE_BLOG_CATEGORY, FORBIDDEN_UPDATE_BRAND, FORBIDDEN_UPDATE_CATEGORY, FORBIDDEN_UPDATE_COUPON, FORBIDDEN_UPDATE_PRODUCT, FORBIDDEN_UPLOAD_FILE } from "src/configs/response.constants";
import { BlogCategorySubject, BlogSubject, BrandSubject, CategorySubject, CouponSubject, OrderSubject, ProductSubject, UploadSubject, UserSubject } from "src/configs/define.class";
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
            //category
            cannot(Action.Create, CategorySubject).because(FORBIDDEN_DELETE_CATEGORY);
            cannot(Action.Update, CategorySubject).because(FORBIDDEN_UPDATE_CATEGORY);
            cannot(Action.Delete, CategorySubject).because(FORBIDDEN_DELETE_CATEGORY);
            //blog category
            cannot(Action.Create, BlogCategorySubject).because(FORBIDDEN_CREATE_BLOG_CATEGORY);
            cannot(Action.Update, BlogCategorySubject).because(FORBIDDEN_UPDATE_BLOG_CATEGORY);
            cannot(Action.Delete, BlogCategorySubject).because(FORBIDDEN_DELETE_BLOG_CATEGORY);
            //blog
            cannot(Action.Create, BlogSubject).because(FORBIDDEN_CREATE_BLOG);
            cannot(Action.Update, BlogSubject).because(FORBIDDEN_UPDATE_BLOG);
            can(Action.LikeOrDislike, BlogSubject);
            cannot(Action.Delete, BlogSubject).because(FORBIDDEN_DELETE_BLOG);
            //brand
            cannot(Action.Create, BrandSubject).because(FORBIDDEN_CREATE_BRAND);
            cannot(Action.Update, BrandSubject).because(FORBIDDEN_UPDATE_BRAND);
            cannot(Action.Delete, BrandSubject).because(FORBIDDEN_DELETE_BRAND);
            //coupon
            cannot(Action.Create, CouponSubject).because(FORBIDDEN_CREATE_COUPON);
            cannot(Action.Update, CouponSubject).because(FORBIDDEN_UPDATE_COUPON);
            cannot(Action.Delete, CouponSubject).because(FORBIDDEN_DELETE_COUPON);
            //upload
            cannot(Action.Upload, UploadSubject).because(FORBIDDEN_UPLOAD_FILE);
            //Order
            can(Action.Create, OrderSubject);
            cannot(Action.Update, OrderSubject).because(FORBIDDEN_ORDER_UPDATED);
        }

        return build({
            // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}