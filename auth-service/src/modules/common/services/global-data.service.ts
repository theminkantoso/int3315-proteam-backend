import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PermissionAction } from 'src/modules/role/entity/action.entity';
import { Permission } from 'src/modules/role/entity/permission.entity';
import { PermissionResource } from 'src/modules/role/entity/resource.entity';
import {
    IPermissionAction,
    IPermissionResource,
} from 'src/modules/role/role.interface';
import { User } from 'src/modules/user/schemas/user.entity';

export let actionList: IPermissionAction[] = [];
export let resourceList: IPermissionResource[] = [];
export let permissionList: Permission[] = [];
export let superAdminIdList: number[] = [];

@Injectable()
export class GlobalDataService {
    constructor(
        @InjectEntityManager()
        private readonly dbManager: EntityManager,
    ) {
        this.getCachedData();
    }

    private async getCachedData() {
        if (actionList.length === 0) {
            await this.setActionList();
        }
        if (resourceList.length === 0) {
            await this.setResourceList();
        }
        if (permissionList.length === 0) {
            await this.setPermissionList();
        }
        if (superAdminIdList.length === 0) {
            await this.getSuperAdminIdList();
        }
    }

    async getSuperAdminIdList() {
        try {
            const users = await this.dbManager.find(User, {
                where: {
                    isSuperAdmin: true,
                },
                select: ['id'],
            });
            superAdminIdList = users.map((user) => user.id);
        } catch (error) {
            throw error;
        }
    }

    private async setActionList() {
        actionList = await this.dbManager
            .getRepository(PermissionAction)
            .find({ select: ['id', 'content'] });
    }

    private async setResourceList() {
        resourceList = await this.dbManager
            .getRepository(PermissionResource)
            .find({ select: ['id', 'content'] });
    }

    private async setPermissionList() {
        permissionList = await this.dbManager
            .getRepository(Permission)
            .find({ select: ['id', 'actionId', 'resourceId'] });
        permissionList = permissionList.map((permission) => ({
            ...permission,
            action: actionList.find(
                (action) => action.id === permission.actionId,
            ),
            resource: resourceList.find(
                (resource) => resource.id === permission.resourceId,
            ),
        }));
    }
}
