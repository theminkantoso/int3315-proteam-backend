import {
    Controller,
    Get,
    InternalServerErrorException,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    AuthorizationGuard,
    Permissions,
} from 'src/common/guards/authoziration.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { SuccessResponse } from 'src/common/helper/response';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { RemoveEmptyQueryPipe } from 'src/common/pipe/removeEmptyQuery.pipe';
import { PermissionActions, PermissionResources } from '../role/role.constants';
import { QueryDropdown, queryDropdownSchema } from './dto/request/dropdown.dto';
import {
    ListRoleDropdown,
    ListUserDropdown,
} from './dto/responses/user-dropdown-response.dto';
import { CommonDropdownService } from './services/common-dropdown.service';

@Controller('common')
export class CommonController {
    constructor(
        private readonly commonDropdownService: CommonDropdownService,
    ) {}

    @Get('/user')
    @UseGuards(JwtGuard, AuthorizationGuard)
    @Permissions([`${PermissionResources.USER}_${PermissionActions.READ}`])
    async getUsers(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const listUserDropdown: ListUserDropdown =
                await this.commonDropdownService.getListUser(query);
            return new SuccessResponse(listUserDropdown);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/role')
    @UseGuards(JwtGuard, AuthorizationGuard)
    @Permissions([`${PermissionResources.USER}_${PermissionActions.READ}`])
    async getRoles(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(queryDropdownSchema),
        )
        query: QueryDropdown,
    ) {
        try {
            const listRoleDropdown: ListRoleDropdown =
                await this.commonDropdownService.getListRole(query);
            return new SuccessResponse(listRoleDropdown);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
