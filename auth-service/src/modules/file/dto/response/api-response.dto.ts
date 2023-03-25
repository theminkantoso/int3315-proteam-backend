import { ApiResponse } from 'src/common/helper/response';
import { FileResponseDto } from './file-response.dto';

export class FileDetailResult extends ApiResponse<FileResponseDto> {
    data: FileResponseDto;
}
