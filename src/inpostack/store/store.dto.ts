export class StoreDto {
  readonly name: string;
  readonly phone: string;
  readonly desc: string;
  readonly location: string;
  readonly openTime: number; // HHMM
  readonly closeTime: number; // HHMM
  readonly menu: JSON;
}