import { ApiConfig } from '../utils/contentScriptTool/types';

export const defaultConfigs: ApiConfig[] = [
    {
        id: 'default-config-1',  // 使用更明确的ID
        name: '默认配置1',
        url: 'https://apigateway.ctripcorp.com/restapi/soa2/28820/getHotelNotify',
        method: 'POST',
        params: {
            checkIn: "20250213",
            checkOut: "20250214",
            hotelId: 1569729,
            "pageCode": "trip-hotel-detail",
            "options": [
                "divideHotelPolicy"
            ],
            "head": {
                "platform": "PC",
                "cver": "0",
                "cid": "1736408626333.9682rBzBrQ6u",
                "bu": "IBU",
                "group": "trip",
                "aid": "",
                "sid": "",
                "ouid": "",
                "locale": "zh-HK",
                "timezone": "8",
                "currency": "HKD",
                "pageId": "10320668147",
                "vid": "1736408626333.9682rBzBrQ6u",
                "guid": "",
                "isSSR": false
            }
        },
        displayFields: [
            {
                path: 'data.reservationNoticeTips[0].title',
                description: '预订提示标题'
            }
        ]
    }
];
