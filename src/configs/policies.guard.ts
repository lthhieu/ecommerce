import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CaslAbilityFactory } from "src/casl/casl-ability.factory/casl-ability.factory";
import { CHECK_POLICIES_KEY, IS_PUBLIC_KEY } from "./custom.decorator";
import { ForbiddenError } from "@casl/ability";
import { PolicyHandler } from "./define.interface";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const policyHandlers =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) || [];

        const { user } = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.createForUser(user);

        try {
            policyHandlers.forEach((policy: PolicyHandler) => {
                ForbiddenError.from(ability).throwUnlessCan(policy.action, policy.subject)
            })
            return true
        } catch (e) {
            if (e instanceof ForbiddenError) {
                throw new ForbiddenException(e.message)
            }
        }
    }
}