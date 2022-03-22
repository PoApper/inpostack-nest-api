import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoreImageService } from './store-image.service';
import { FileService } from '../../../../file/file.service';
import { FormDataRequest } from 'nestjs-form-data';
import { StoreImageDto } from './store-image.dto';
import { InPoStackAuth } from '../../../../auth/guard/InPoStackAuth.guard';
import { AccountTypeGuard } from '../../../../auth/guard/role.guard';
import { AccountTypes } from '../../../../auth/decorator/role.decorator';
import { AccountType } from '../../../account/account.meta';
import { Public } from 'nest-keycloak-connect';

@ApiTags('Store Image')
@Controller('store-image')
export class StoreImageController {
  constructor(
    private readonly storeImageService: StoreImageService,
    private readonly fileService: FileService,
  ) {}

  @Post(':store_id')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  @FormDataRequest()
  async add_store_image(
    @Param('store_id', ParseUUIDPipe) store_id: string,
    @Body() dto: StoreImageDto,
  ) {
    const { store_image } = dto;
    if (!store_image) throw new BadRequestException('invalid image');

    // Create store image entity first
    const newStoreImage = await this.storeImageService.save(store_id);

    // Use its uuid as image key!
    const imageKey = `store-image/${newStoreImage.uuid}`;

    // Upload image file with key to S3 bucket
    return this.fileService.uploadFile(imageKey, store_image);
  }

  @Get(':store_id')
  @Public()
  async get_all_store_images_links(
    @Param('store_id', ParseUUIDPipe) store_id: string,
  ) {
    const storeImageList = await this.storeImageService.findAllStoreImages(
      store_id,
    );
    for (const storeImage of storeImageList) {
      storeImage[
        'link'
      ] = `${process.env.S3_CF_DIST_URL}/store-image/${storeImage.uuid}`;
    }
    return storeImageList;
  }

  @Delete('image/:store_image_id')
  @UseGuards(InPoStackAuth, AccountTypeGuard)
  @AccountTypes(AccountType.admin)
  delete_store_image(
    @Param('store_image_id', ParseUUIDPipe) store_image_id: string,
  ) {
    return this.storeImageService.deleteStoreImage(store_image_id);
  }
}
