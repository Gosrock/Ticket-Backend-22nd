import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/consts/enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/database/entities/user.entity';
import { ErrorResponse } from './common/decorators/ErrorResponse.decorator';
import { ErrorCommonResponse } from './common/errors/ErrorCommonResponse.dto';
import { HttpExceptionErrorResponseDto } from './common/errors/HttpExceptionError.response.dto';
@Controller()
@ApiTags('common')
export class CommonController {
  @ErrorResponse({ model: HttpExceptionErrorResponseDto })
  @Get()
  commen() {}
}
