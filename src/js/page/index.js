/**
 * Created by Administrator on 2017-3-21.
 */
import RUI from "react-component-lib";
import {hashHistory} from "react-router";
import "../../css/page/stock-query.scss";

export default class Index extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    query(type){
        let url = type==1?"/orderList":"/stockQuery";
        hashHistory.push(url);
    }
    render(){
        return(
            <div className="p-10">
                <RUI.Button className = "primary query-btn width-100" onClick = {this.query.bind(this,1)}>订单查询</RUI.Button>
                <RUI.Button className = "primary query-btn width-100" onClick = {this.query.bind(this,2)}>库存查询</RUI.Button>
            </div>
        )
    }
}
