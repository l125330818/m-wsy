/**
 * Created by Administrator on 2017-3-21.
 */
import "../../css/page/stock-query.scss";
import Util from "../util";

export default class Detail extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            stockDetail:[
                {shoeNum:0}
            ]
        };
      }

    componentDidMount() {
        this.getDetail();
    }
    getDetail(){
        let _this = this;
        let productId = this.props.location.query.id;
        $.ajax({
            url:Util.commonBaseUrl + "/mobile/store/findStoreDetail.htm",
            type : "get",
            dataType:"json",
            data:{d:JSON.stringify({productId})},
            success(data){
                if(data.success){
                    let stockDetail = data.resultMap.productStoreDOs;
                    stockDetail.map((item)=>{
                        item.operateNum = 0;
                    });
                    _this.setState({stockDetail});
                }else{
                    _this.setState({stockDetail:[]});
                }
            }

        })
    }
    render(){
        let {stockDetail} = this.state;
        let number = this.props.location.query.number;
        return(
            <div>
                <div className="">
                    <div className="info">
                        <label htmlFor="" >产品信息：</label>
                        <span>{this.props.location.query.name || ""}&nbsp;&nbsp;&nbsp;{number || 0}双</span>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>鞋码</td>
                            <td>库存</td>
                            <td>库存区间</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            stockDetail.length>0 && stockDetail.map((item,index)=>{
                                let errorStyle = "";
                                if((item.shoeNum>item.storeMax && item.storeMax!=-1) || item.shoeNum<item.storeMin){
                                    errorStyle = "bg-red"
                                }
                                return(
                                    <tr key = {index} className={errorStyle}>
                                        <td>{item.shoeCode}</td>
                                        <td>{item.shoeNum}</td>
                                        <td>{(item.storeMin==-1?"无限制":item.storeMin) + "-"+(item.storeMax==-1?"无限制":item.storeMax)}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}