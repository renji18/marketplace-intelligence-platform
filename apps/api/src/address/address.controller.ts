import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { Buyer } from 'src/auth/utils/roles.decorator';
import { Request } from 'express';
import { AddAddressDto } from './dto/add-address.dto';
import { getPayload } from 'src/utils/get-payload';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Buyer()
  @Post('add')
  modifyAddress(@Req() req: Request, @Body() body: AddAddressDto) {
    return this.addressService.modifyAddress(getPayload(req).roleId, body);
  }

  @Buyer()
  @Get('get')
  getMyAddresses(@Req() req: Request) {
    return this.addressService.getMyAddresses(getPayload(req).roleId);
  }

  @Buyer()
  @Get('delete/:addressId')
  deleteAddress(@Req() req: Request, @Param('addressId') addressId: string) {
    return this.addressService.deleteAddress(getPayload(req).roleId, addressId);
  }
}
