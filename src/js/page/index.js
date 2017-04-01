/**
 * Created by Administrator on 2017-3-21.
 */
import RUI from "react-component-lib";
export default class Index extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    query(){

    }
    render(){
        return(
            <div>
                <RUI.Button onClick = {this.query}>订单查询</RUI.Button>
                <RUI.Button onClick = {this.query}>库存查询</RUI.Button>
            </div>
        )
    }
}
ReactDOM.render(<Index />,document.getElementById("app"));