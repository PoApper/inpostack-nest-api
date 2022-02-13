import axios from "axios";

async function findDistance(storeAddress: string){
    const addressInfo = await axios.get( "https://dapi.kakao.com/v2/local/search/address.json", {
        headers: { 
            'Accept': 'application/json',
            'Authorization': process.env.KAKAO_KEY
        },
        params: {
            query: storeAddress,
        }
    })
    const coordinateValue = addressInfo.data.documents[0].address.x + "," +  addressInfo.data.documents[0].address.y

    const distance = await axios.get( 'https://apis-navi.kakaomobility.com/v1/directions', {
        headers: { 
            'Accept': 'application/json',
            'Authorization': process.env.KAKAO_KEY
        },
        params: {
            origin: "129.322359, 36.015702", // 지곡회관 좌표
            destination: coordinateValue
        }
    })
    return distance.data.routes[0].summary.distance
}

export default findDistance;