import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DEFAULT_LIMIT_FOR_DROPDOWN } from 'src/common/constants';
import { Role } from 'src/modules/role/entity/role.entity';
import { User } from 'src/modules/user/schemas/user.entity';
import { Brackets, EntityManager, In } from 'typeorm';
import { QueryDropdown } from '../dto/request/dropdown.dto';
import {
    ListRoleDropdown,
    ListUserDropdown,
} from '../dto/responses/user-dropdown-response.dto';

const userDropdownListAttributes: (keyof User)[] = [
    'id',
    'lastName',
    'firstName',
    'status',
];
const roleDropdownListAttributes: (keyof Role)[] = ['id', 'name'];
@Injectable()
export class CommonDropdownService {
    constructor(
        @InjectEntityManager()
        private readonly dbManager: EntityManager,
    ) {}

    generateQueryBuilder(queryBuilder, { page, limit, status }) {
        if (status && status.length > 0) {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where([
                        {
                            status: In(status),
                        },
                    ]);
                }),
            );
        }

        let skip = 0;
        const take = limit;
        if (page) {
            skip = take * (page - 1);
        }
        queryBuilder.take(take).skip(skip);
    }

    async getListUser(query: QueryDropdown): Promise<ListUserDropdown> {
        try {
            const {
                page = 0,
                limit = DEFAULT_LIMIT_FOR_DROPDOWN,
                status = [],
            } = query;
            const [items, totalItems] = await this.dbManager.findAndCount(
                User,
                {
                    select: userDropdownListAttributes,
                    where: (queryBuilder) => {
                        this.generateQueryBuilder(queryBuilder, {
                            page,
                            limit,
                            status,
                        });

                        queryBuilder.andWhere({
                            isSuperAdmin: false,
                        });
                    },
                },
            );
            return {
                totalItems,
                items,
            };
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async getListRole(query: QueryDropdown): Promise<ListRoleDropdown> {
        try {
            const { page, limit } = query;
            const [items, totalItems] = await this.dbManager.findAndCount(
                Role,
                {
                    select: roleDropdownListAttributes,
                    where: (queryBuilder) =>
                        this.generateQueryBuilder(queryBuilder, {
                            page,
                            limit,
                            status: [],
                        }),
                },
            );
            return {
                totalItems,
                items,
            };
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
