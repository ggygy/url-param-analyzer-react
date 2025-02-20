/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { decodeZstdBase64 } from '../../utils/zstdHelper';
import './PriceCompareWidget.css';

interface PriceCompareWidgetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PriceCompareWidget: React.FC<PriceCompareWidgetProps> = ({
  isVisible,
  onClose
}) => {
  const [traceId1, setTraceId1] = useState('');
  const [traceId2, setTraceId2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareResult, setCompareResult] = useState<any>(null);

  const fetchTraceData = async (traceId: string) => {
    const query = `/*TRACE_BOF --username=wangjunzhou --tableName=log.ibu_hotel_controller_online_all --source=kibana --duration_minutes=4320 --url=http://es.ops.ctripcorp.com/#/dashboard/elasticsearch/htl-ctrip-online-service.ck TRACE_EOF*/SELECT \`rateplan_process_error\`,\`ordercode\`,\`locale\`,\`ip\`,\`spider_uuid\`,\`accept\`,\`cat_client_bu\`,\`stored_controller_response\`,\`startprice_price\`,\`stored_controller_request\`,\`usecache\`,\`api_rateplan_error_code\`,\`searchDataType_CT\`,\`headExtensionGroup\`,\`cat_client_appid\`,\`hotelidlist\`,\`orderid\`,\`AMOUNTSHOWTYPE\`,\`ouid\`,\`group\`,\`vid\`,\`isguarantedd\`,\`spider_percent\`,\`createordercode\`,\`paytype\`,\`hotelSearchErrorCode\`,\`cityid\`,\`platform\`,\`order_trace_id\`,\`x_forwarded_for\`,\`spider_stauts\`,\`qid\`,\`payto\`,\`checkout\`,\`searchDataType_S\`,\`controller_head\`,\`stored_COOKIE\`,\`modifytype\`,\`searchDataType_Z\`,\`apierrorcode\`,\`clientappid\`,\`couponcode\`,\`searchDataType_P\`,\`checkin\`,\`sid\`,\`adult\`,\`spider_timespan\`,\`searchDataType_H\`,\`order_create_error_list\`,\`clientid\`,\`accept_language\`,\`aid\`,\`device\`,\`pageid\`,\`ticket\`,\`searchDataType_D\`,\`accept_encoding\`,\`time\`,\`rateplan_hotelid\`,\`currency\`,\`url\`,\`stored_api_request\`,\`searchDataType_v\`,\`stored_api_response\`,\`tiptype\`,\`content_type\`,\`user_agent\`,\`messageId\`,\`referer\`,\`TraceLogID\`,\`thread_id\`,\`startprice_roomid\`,\`servicecode\`,\`isOverSea\`,\`stored_order_trace_id\`,\`stored_ssr\`,\`vendorid\`,\`shadowid\`,\`displayprice\`,\`tax\`,\`prepaydiscount\`,\`primediscount\`,\`cashback\`,\`totalprice\`,\`lastdisplayprice\`,\`lasttax\`,\`lastprepaydiscount\`,\`lastprimediscount\`,\`lastcashback\`,\`lasttotalprice\`,\`compareprice\`,\`comparepriceresult\`,\`lasttracelogid\`,\`balancetype\`,\`roomquantity\`,\`days\`,\`lastticket\`,\`pricemargin_roomlist\`,\`pricemargin_hotelavail\`,\`isbooking\`,\`lastticketdiscount\`,\`ticketdiscount\`,\`veildiscount\`,\`otherdiscount\`,\`lastveildiscount\`,\`lastotherdiscount\`,\`isprev\`,\`hotellist_selected_keyword\`,\`groupid\`,\`optiontype\`,\`optionid\`,\`spider_error_code\`,\`listbookable\`,\`lastroomid\`,\`lastfilter\`,\`lasttimestamp\`,\`createordererror\`,\`resultcode\`,\`resultmessage\`,\`lastisspider\`,\`roomidlist\`,\`debugcode\`,\`debugtext\`,\`lastislogin\`,\`spider_action\`,\`spider_action_switch\`,\`passenger\`,\`keyword\`,\`pageTraceId\`,\`tsid\`,\`lastCancelPolicyType\`,\`lastCancelPolicyDesc\`,\`lastMealType\`,\`lastMealDesc\`,\`cancelPolicyType\`,\`cancelPolicyDesc\`,\`mealType\`,\`mealDesc\`,\`IsSameCancelPolicy\`,\`IsSameMeal\`,\`IsSamePrimeDiscount\`,\`IsSameVeilDiscount\`,\`IsSameCashback\`,\`IsSamePrepayDiscount\`,\`IsSameTicketDiscount\`,\`IsSameTax\`,\`guaranteeTypeDetail\`,\`guaranteeTypeBook\`,\`payTypeDetail\`,\`paymentTypeDetail\`,\`paymentTypeBook\`,\`subPayTypeDetail\`,\`guaranteeAmountDetail\`,\`guaranteeAmountBook\`,\`balanceTypeDetail\`,\`balanceTypeBook\`,\`guaranteeGoodsBook\`,\`IsSameGuaranteeType\`,\`IsSameGuaranteeAmount\`,\`IsSamePaymentType\`,\`isInfoSec\`,\`hotelcount\`,\`baseroomcount\`,\`sandbox\`,\`traceIgnore\`,\`isPrivateHost\`,\`request_headers\`,\`veil_price_log\`,\`isBff\`,\`cancel_code\`,\`apiCreateOrderErrorCode\`,\`az\`,\`zone\`,\`dynamic_refresh\` FROM log.ibu_hotel_controller_online_all WHERE (timestamp >= toDateTime(1739263020) AND timestamp <= toDateTime(1739522280)) AND (\`TraceLogID\` = '${traceId}') FORMAT JSON`;

    try {
      const response = await fetch('http://es.ops.ctripcorp.com/clickhouse/?tableName=log.ibu_hotel_controller_online_all', {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (!data.data?.[0]?.stored_controller_response) {
        throw new Error('No stored_controller_response found');
      }

      // 使用新的解码方法
      const encodedData = data.data[0].stored_controller_response;
      const decodedData = await decodeZstdBase64(encodedData);
      return decodedData;
    } catch (error) {
      throw new Error(`Failed to fetch trace data: ${error.message}`);
    }
  };

  const handleCompare = async () => {
    if (!traceId1 || !traceId2) {
      setError('请输入两个 TraceLogId');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [data1, data2] = await Promise.all([
        fetchTraceData(traceId1),
        fetchTraceData(traceId2)
      ]);

      const comparison = compareResults(data1, data2);
      setCompareResult(comparison);
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const compareResults = (data1: any, data2: any) => {
    // 这里实现具体的比对逻辑
    // 示例比对逻辑
    return {
      differences: findDifferences(data1, data2),
      matchRate: calculateMatchRate(data1, data2)
    };
  };

  const findDifferences = (obj1: any, obj2: any, path = ''): any[] => {
    const differences = [];
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      if (obj1[key] !== obj2[key]) {
        differences.push({
          path: currentPath,
          value1: obj1[key],
          value2: obj2[key]
        });
      }
    }
    return differences;
  };

  const calculateMatchRate = (obj1: any, obj2: any): number => {
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    let matchCount = 0;

    allKeys.forEach(key => {
      if (obj1[key] === obj2[key]) matchCount++;
    });

    return (matchCount / allKeys.size) * 100;
  };

  if (!isVisible) return null;

  return (
    <div className="price-compare-overlay">
      <div className="price-compare-container">
        <button className="price-compare-close" onClick={onClose}>&times;</button>
        <h3>房价一致率比对</h3>

        <div className="input-group">
          <label>TraceLogId 1:</label>
          <input
            type="text"
            value={traceId1}
            onChange={(e) => setTraceId1(e.target.value)}
            placeholder="输入第一个 TraceLogId"
          />
        </div>

        <div className="input-group">
          <label>TraceLogId 2:</label>
          <input
            type="text"
            value={traceId2}
            onChange={(e) => setTraceId2(e.target.value)}
            placeholder="输入第二个 TraceLogId"
          />
        </div>

        <button
          className={`compare-button ${loading ? 'loading' : ''}`}
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? '比对中...' : '开始比对'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {compareResult && (
          <div className="compare-results">
            <h4>比对结果</h4>
            <div className="match-rate">
              一致率: {compareResult.matchRate.toFixed(2)}%
            </div>
            <div className="differences">
              <h5>差异项：</h5>
              {compareResult.differences.map((diff: any, index: number) => (
                <div key={index} className="difference-item">
                  <div>路径: {diff.path}</div>
                  <div>值1: {JSON.stringify(diff.value1)}</div>
                  <div>值2: {JSON.stringify(diff.value2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
