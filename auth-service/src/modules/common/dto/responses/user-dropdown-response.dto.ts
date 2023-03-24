import { UserStatus } from 'src/common/constants';
import { CommonListResponse } from 'src/common/helper/response';

export class ListUserDropdown extends CommonListResponse<UserDropdownResponseDto> {
    items: UserDropdownResponseDto[];
}

export class ListRoleDropdown extends CommonListResponse<RoleDropdownResponseDto> {
    items: RoleDropdownResponseDto[];
}

export class RoleDropdownResponseDto {
    id: number;
    name: string;
}

class UserDropdownResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    status: UserStatus;
}
