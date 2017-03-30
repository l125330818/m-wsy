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
            stockDetail:[]
        };
      }

    componentDidMount() {
        let _this = this;
        $.ajax({
            url:Util.commonBaseUrl + "/store/findStoreDetail.htm",
            type : "get",
            dataType:"json",
            data:{d:JSON.stringify({productId:_this.props.id})},
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
        return(
            <div>
                <div className="">
                    <div className="info">
                        <label htmlFor="" >产品信息：</label>
                        <span>111双</span>
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
                        <tr>
                            <td>11</td>
                            <td>22</td>
                            <td>33</td>
                        </tr>
                        <tr>
                            <td>11</td>
                            <td>22</td>
                            <td>33</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}