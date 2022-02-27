import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

/**
 * Find distance between specific korean address and '지곡회관' through kakao api
 * @return unit: meters
 * @param storeAddress "경상북도 포항시 남구 청암로 77"
 */

async function findDistance(storeAddress: string): Promise<number> {
  const addressInfo = await axios.get(
    'https://dapi.kakao.com/v2/local/search/address.json',
    {
      headers: {
        Accept: 'application/json',
        Authorization: process.env.KAKAO_KEY,
      },
      params: {
        query: storeAddress,
      },
    },
  );

  if(addressInfo.data.documents.length == 0){
    throw new BadRequestException('invalid address')
  }

  const coordinateValue: string =
    addressInfo.data.documents[0].address.x +
    ',' +
    addressInfo.data.documents[0].address.y;

  const distance = await axios.get(
    'https://apis-navi.kakaomobility.com/v1/directions',
    {
      headers: {
        Accept: 'application/json',
        Authorization: process.env.KAKAO_KEY,
      },
      params: {
        origin: '129.322359, 36.015702', // geographical CoordinateValue of '지곡회관'
        destination: coordinateValue,
      },
    },
  );
  return distance.data.routes[0].summary.distance;
}

export default findDistance;
