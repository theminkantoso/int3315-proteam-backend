import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, EntityTarget, Not } from 'typeorm';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectEntityManager()
        private readonly dbManager: EntityManager,
    ) {}

    async checkItemExist<Entity>(
        entity: EntityTarget<Entity>,
        fieldName: string,
        fieldValue: string | number | boolean,
        itemId?: number,
    ) {
        try {
            const whereCondition = {
                [fieldName]: fieldValue,
            };
            if (itemId) {
                // when update item
                Object.assign(whereCondition, {
                    id: Not(itemId),
                });
            }
            const item = await this.dbManager.count(entity, {
                where: whereCondition,
            });
            return item > 0;
        } catch (error) {
            throw error;
        }
    }

    async getDataById<Entity>(entity: EntityTarget<Entity>, id: number | null) {
        try {
            if (id) {
                const result = await this.dbManager.findOne(entity, id);
                return result;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
}
