/**
 * Created by Administrator on 2017-3-21.
 */
import "../../css/page/stock-query.scss";
import iScrollProbe from "../lib/iscroll-probe";
import iScroll from "iscroll";
import ReactIScroll from "react-iscroll";
import {hashHistory} from "react-router";
export default class Query extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list:[{key:1},{key:2},{key:3},{key:4},{key:5},{key:6},{key:7},{key:8},],
            refreshing:false,
            pullDownRefresh:false,
        };
        this.onScroll = this.onScroll.bind(this);
        this.onScrollStart = this.onScrollStart.bind(this);
        this.refresh = this.refresh.bind(this);
        this.end = this.end.bind(this);
        this.handleList = this.handleList.bind(this);

    }
    handleList(e){
        let node =  $(e.target);
        hashHistory.push("/stockDetail");
        console.log(node.attr("data-info"))
    }
    onScroll(e){
        console.log(e);
        if(e.y>5){
            this.setState({refreshing:true,pullDownRefresh:true})
        }
    }
    onScrollStart(){}
    refresh(){}
    end(){}
    render(){
        let {pullDownRefresh,refreshing,list} = this.state;
        let pullDownStyle = "none";
        if(pullDownRefresh && refreshing){
            pullDownStyle = "block";
        }
        return(
        <div id="wrapper">
            <ReactIScroll iScroll={iScrollProbe}
                          options={this.props.options}
                          onRefresh={this.refresh}
                          onScroll={this.onScroll}
                          onScrollStart={this.onScrollStart}
                          onScrollEnd={this.end}>
                <div style={{width: "110%",minHeight:"900px"}} id="scroller">

                    <div id="pullDown" className={pullDownStyle}>
                        <div className="pullDownIcon"></div>
                        <div className="pullDownLabel">加载中</div>
                    </div>

                    <div>
                        <div className="clearfix">
                                {
                                    list.map((item,i)=>{
                                        return(
                                            <div className="stock-list" key = {i} data-info = {item.key} onClick = {this.handleList} >
                                                <img data-info = {item.key} className="query-img" src={require("../../images/yeoman.png")} alt=""/>
                                                <p data-info = {item.key}>红色11 骚等我</p>
                                            </div>
                                        )
                                    })
                                }
                        </div>
                    </div>
                    <div id="pullUp" className="">
                        <div className="pullUpIcon"></div>
                        <div className="pullUpLabel">加载更多</div>
                    </div>
                </div>
            </ReactIScroll>
        </div>

        )
    }
}
Query.defaultProps = {
    options: {
        probeType: 2,
        scrollbars: false,
        preventDefault: true,
        mouseWheel: true,
        click: true,
        bounce:true,
        pullDown:true,
        momentum:true
    }
}
ReactDOM.render(<Query />,document.getElementById("app"));