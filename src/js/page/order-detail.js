/**
 * Created by Administrator on 2017-4-4.
 */
import Util from "../util";

import "../../css/page/stock-query.scss";
export default class Detail extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            lastData:{
                produceOrderProductVOs:[]
            },
            nextData:{
                produceOrderProductVOs:[]
            },
        };
      }

    componentDidMount() {
        this.getDetail(1);
        this.getDetail(2);
    }
    getDetail(type){
        let orderNo = this.props.location.query.id;
        let _this = this;
        $.ajax({
            url:Util.commonBaseUrl+"/mobile/order/findByOrderNo.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify({orderNo,type})},
            success(data){
                if(data.success){
                    let produceOrderVO = data.resultMap.produceOrderVO;
                    if(type==1){
                        _this.setState({lastData:produceOrderVO})
                    }else{
                        _this.setState({nextData:produceOrderVO})
                    }
                }
            }
        })
    }
    getTableHtml(produceOrderProductDetailVOs,type){
        let {lastData,nextData,typeFlag} = this.state;
        let list = type==1?lastData:nextData;
        if((type==1 && list.vampStatus==0) || (type == 2 && list.soleStatus==0)){
            let arr = [{},{}];
            return (
                produceOrderProductDetailVOs.map((item,i)=>{
                    return (
                        <tr key = {i}>
                            <td className="w-150">
                                {item.shoeCode+"码->"+item.shoeNum+"双"}
                            </td>
                        </tr>
                    )
                })
            )
        }else{
            return(
                produceOrderProductDetailVOs.map((item,i)=>{
                    return (
                        <tr key = {i}>
                            <td>
                                {item.shoeCode+"码->"+item.shoeNum+"双"}
                            </td>
                            <td>
                                {
                                    item.produceOrderProductDistributeDOs.map((sonItem)=>{
                                            return (
                                                <div className="table-bottom-line">{sonItem.employeeNo+"("+sonItem.employeeName+") ---"+sonItem.shoeNum+"双"}</div>
                                            )
                                        }
                                    )
                                }
                            </td>
                        </tr>
                    )
                })
            )
        }
    }
    render(){
        let {lastData,nextData} = this.state;
        let lastProduceOrderProductVOs = lastData.produceOrderProductVOs;
        let nextProduceOrderProductVOs = nextData.produceOrderProductVOs;

        return(
            <div>
                <div><span>订单编号：{lastData.orderNo}</span></div>
                <div><span>订单名称：{lastData.orderName}</span></div>
                <div><span>是否加急：{lastData.isUrgent==1?"是":"否"}</span></div>
                <div><span>交货时间：{lastData.deliveryTime}</span></div>
                <div><span>创建时间：{lastData.createTime}</span></div>
                <div><span>裁剪完成时间：{lastData.tailorFinishTime}</span></div>
                <div><span>机车分配时间：{lastData.vampHandleTime}</span></div>
                <div><span>机车完成时间：{lastData.vampFinishTime}</span></div>
                <div><span>底工分配时间：{lastData.soleHandleTime}</span></div>
                <div><span>底工完成时间：{lastData.soleFinishTime}</span></div>
                <div><span>质检完成时间：{lastData.qcFinishTime}</span></div>
                <div >
                    <div className = "detail-title">上案分配情况</div>
                    <div className="order-content clearfix">
                        {
                            lastProduceOrderProductVOs.map((item,index)=>{
                                return(
                                    <div className="list" key = {index}>
                                        <div className = "m-b-20">
                                            <label htmlFor="" className = "left-label"><i className="require">*</i>生产样图：</label>
                                            <img src={item.productUrl} onClick = {this.clickImg} className="detail-img" alt=""/>
                                        </div>
                                        <div className="m-b-20">
                                            <label>产品名称：</label><span>{item.productName}</span>
                                        </div>
                                        <div className="m-b-20">
                                            <label>产品数量：</label><span>{item.produceNum}</span>
                                        </div>
                                        {
                                            !!item.producePrice &&
                                            <div className="m-b-20 not-print">
                                                <label>产品单价：</label><span className="require">￥{(item.producePrice/100).toFixed(2)}</span>
                                            </div>
                                        }
                                        {
                                            !!item.produceAmount &&
                                            <div className="m-b-20 not-print">
                                                <label>产品金额：</label><span className="require">￥{(item.produceAmount/100).toFixed(2)}</span>
                                            </div>
                                        }
                                        <div className="m-t-10">
                                            <label><i className="require">*</i>生产鞋码与数量：</label>
                                            <table className = "table m-t-10 m-b-20">
                                                {
                                                    this.getTableHtml(item.produceOrderProductDetailVOs,1)
                                                }

                                            </table>
                                        </div>
                                        <div className="m-b-20">
                                            <label>生产要求：</label><span>{item.produceAsk}</span>
                                        </div>
                                        <div className="m-b-20">
                                            <label>备注：</label><span>{item.remark}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div >
                    <div className = "detail-title">下案分配情况</div>
                    <div className="order-content clearfix">
                        {
                            nextProduceOrderProductVOs.map((item,index)=>{
                                return(
                                    <div className="list" key = {index}>
                                        <div className = "m-b-20">
                                            <label htmlFor="" className = "left-label"><i className="require">*</i>生产样图：</label>
                                            <img src={item.productUrl} onClick = {this.clickImg} className="detail-img" alt=""/>
                                        </div>
                                        <div className="m-b-20">
                                            <label>产品名称：</label><span>{item.productName}</span>
                                        </div>
                                        <div className="m-b-20">
                                            <label>产品数量：</label><span>{item.produceNum}</span>
                                        </div>
                                        {
                                            !!item.producePrice &&
                                            <div className="m-b-20 not-print">
                                                <label>产品单价：</label><span className="require">￥{(item.producePrice/100).toFixed(2)}</span>
                                            </div>
                                        }
                                        {
                                            !!item.produceAmount &&
                                            <div className="m-b-20 not-print">
                                                <label>产品金额：</label><span className="require">￥{(item.produceAmount/100).toFixed(2)}</span>
                                            </div>
                                        }
                                        <div className="m-t-10">
                                            <label><i className="require">*</i>生产鞋码与数量：</label>
                                            <table className = "table m-t-10 m-b-20">
                                                {
                                                    this.getTableHtml(item.produceOrderProductDetailVOs,2)
                                                }

                                            </table>
                                        </div>
                                        <div className="m-b-20">
                                            <label>生产要求：</label><span>{item.produceAsk}</span>
                                        </div>
                                        <div className="m-b-20">
                                            <label>备注：</label><span>{item.remark}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}