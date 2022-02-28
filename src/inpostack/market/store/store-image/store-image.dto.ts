import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class StoreImageDto {
  @IsFile()
  @MaxFileSize(10 * 1024 * 1024) // 10MB
  readonly store_image: MemoryStoredFile;
}
