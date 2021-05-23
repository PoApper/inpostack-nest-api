export class StoreDto {
  readonly name: string;
  readonly phone: string;
  readonly description: string;
  readonly location: string;
  readonly open_time: number; // HHMM
  readonly close_time: number; // HHMM
  readonly menu: JSON;
}