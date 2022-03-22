import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { AccountTypeGuard } from '../../../../auth/guard/role.guard';
import { AccountTypes } from '../../../../auth/decorator/role.decorator';
import { AccountType } from '../../../account/account.meta';
import { FileService } from '../../../../file/file.service';
import { InPoStackAuth } from '../../../../auth/guard/InPoStackAuth.guard';
import { StoreLogoDto } from './store-logo.dto';
import { StoreLogoService } from './store-logo.service';

@ApiTags('Store Logo')
@Controller('store-logo')
export class StoreLogoController {
  constructor(
    private readonly storeLogoService: StoreLogoService,
    private readonly fileService: FileService,
  ) {}

  @Post(':store_id')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async registerStoreLogo(
    @Param('store_id', ParseUUIDPipe) store_id: string,
    @Body() storeLogoDto: StoreLogoDto,
  ) {
    const { store_logo } = storeLogoDto;
    if (!store_logo) throw new BadRequestException('invalid logo');

    const store = await this.storeLogoService.findOneById(store_id);
    if (!store) throw new BadRequestException('Not exist store');

    const logoKey = `store/logo/${store_id}`;
    const logoUrl = await this.fileService.uploadFile(logoKey, store_logo);

    await this.storeLogoService.updateStoreLogoById(store_id, {
      image_url: logoUrl,
    });
    return logoUrl;
  }

  @Delete(':store_id')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  deleteStoreLogo(@Param('store_id', ParseUUIDPipe) store_id: string) {
    return this.storeLogoService.deleteStoreLogoById(store_id);
  }
}
