import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AccessService } from 'nest-casl';
import { AbilityMetadata } from 'nest-casl/dist/interfaces/ability-metadata.interface';
import { CASL_META_ABILITY } from 'nest-casl/dist/casl.constants';
import { ContextProxy } from 'nest-casl/dist/proxies/context.proxy';
import { CaslConfig } from 'nest-casl/dist/casl.config';
import { RequestProxy } from 'nest-casl/dist/proxies/request.proxy';
import { userHookFactory } from 'nest-casl/dist/factories/user-hook.factory';
import { subjectHookFactory } from 'nest-casl/dist/factories/subject-hook.factory';
import { UnauthorizedException } from '../../../exceptions/unauthorized.exception';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly accessService: AccessService,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ability = this.reflector.get<AbilityMetadata | undefined>(
      CASL_META_ABILITY,
      context.getHandler(),
    );
    const request = await ContextProxy.create(context).getRequest();
    const { getUserHook } = CaslConfig.getRootOptions();
    const req = new RequestProxy(request);

    req.setUserHook(await userHookFactory(this.moduleRef, getUserHook));
    req.setSubjectHook(
      await subjectHookFactory(this.moduleRef, ability?.subjectHook),
    );

    if (!(await this.accessService.canActivateAbility(request, ability))) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    return true;
  }
}
