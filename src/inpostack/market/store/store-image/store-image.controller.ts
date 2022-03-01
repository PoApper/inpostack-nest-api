import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { StoreImageService } from './store-image.service';
import { FileService } from '../../../../file/file.service';
import { FormDataRequest } from 'nestjs-form-data';
import { StoreImageDto } from './store-image.dto';

@ApiTags('Store Image')
@Controller('store-image')
export class StoreImageController {
  constructor(
    private readonly storeImageService: StoreImageService,
    private readonly fileService: FileService,
  ) {}

  @Post(':store_id')
  @FormDataRequest()
  async add_store_image(
    @Param('store_id') store_id: string,
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
  async get_all_store_images_links(@Param('store_id') store_id: string) {
    const storeImageList = await this.storeImageService.findAllStoreImages(
      store_id,
    );
    const storeImageLinkList: Array<string> = [];
    for (const storeImage of storeImageList) {
      const storeImageLink = `${process.env.S3_CF_DIST_URL}/${process.env.S3_TARGET_DIR}/store-image/${storeImage.uuid}`;
      storeImageLinkList.push(storeImageLink);
    }
    return storeImageLinkList;
  }

  @Delete('image/:store_image_id')
  delete_store_image(@Param('store_image_id') store_image_id: string) {
    return this.storeImageService.deleteStoreImage(store_image_id);
  }
}