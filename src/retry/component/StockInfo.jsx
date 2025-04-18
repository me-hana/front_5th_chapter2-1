import { CLASS } from '../../constant/class';
import { ID } from '../../constant/id';

// 재고 부족 메시지 표시
export default function StockInfo() {
  return <div id={ID.STOCK_STATUS} className={CLASS.STOCK_MSG}></div>;
}
