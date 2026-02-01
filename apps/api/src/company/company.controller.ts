import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Admin, Seller } from 'src/auth/utils/roles.decorator';
import { Request } from 'express';
import { getPayload } from 'src/utils/get-payload';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Seller()
  @Get('my')
  getMyCompany(@Req() req: Request) {
    return this.companyService.getMyCompany(getPayload(req).roleId);
  }

  @Seller()
  @Post('create')
  createCompany(@Req() req: Request, @Body() body: { name: string }) {
    return this.companyService.createCompany(
      getPayload(req).roleId,
      body?.name,
    );
  }

  @Admin()
  @Get('all')
  getAllCompanies() {
    return this.companyService.getAllCompanies();
  }

  @Admin()
  @Get('toggle/:companyId')
  toggleCompanyStatus(@Param('companyId') companyId: string) {
    return this.companyService.toggleCompanyStatus(companyId);
  }
}
