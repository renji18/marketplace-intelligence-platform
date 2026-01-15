import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create.admin.dto';
// import { Public } from 'src/auth/utils/public.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Public()
  @Post('create')
  createAdmin(@Body() body: CreateAdminDto) {
    return this.adminService.createAdmin(body);
  }
}
