/**
 * Created by Administrator on 2017-3-21.
 */
import "../../css/page/stock-query.scss";
import iScrollProbe from "../lib/iscroll-probe";
import iScroll from "iscroll";
import ReactIScroll from "react-iscroll";
import {hashHistory} from "react-router";
import Util from "../util";
export default class QueryList extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list:[],
            refreshing:true,
            pullDownRefresh:true,
            pullUpRefresh:false,
            listRequest:{},
            isMore:false,
            iTotalDisplayRecords:0,
            pageSize:1,
            pageNo:1
        };
        this.onScroll = this.onScroll.bind(this);
        this.end = this.end.bind(this);
        this.handleList = this.handleList.bind(this);
    }
    componentDidMount(){
        this.getList();
        let winH = $(window).height();
        let winW = $(window).width();
        let paddingNum = winW%122;
        $("#scroller").css("min-height",winH+2);
    }
    componentWillUnmount(){

    }
    isMoreFn(){
        let {iTotalDisplayRecords,list} = this.state;
        if(list.length<iTotalDisplayRecords){
            this.setState({isMore:true});
        }else{
            this.setState({isMore:false});
        }
    }
    getList(pageNo=1){
        let {listRequest,pageSize} = this.state;
        let _this = this;
        $.ajax({
            url:Util.commonBaseUrl+"/mobile/order/findOrderList.htm",
            type:"get",
            dataType:"json",
            data:{pageNo:pageNo,pageSize:pageSize,d:JSON.stringify(listRequest)},
            success(data){
                if(data.success){
                    let list = [];
                    if(pageNo==1){
                        list = data.resultMap.rows;
                    }else{
                        list = _this.state.list.concat(data.resultMap.rows);
                    }
                    _this.setState({
                        list:list,
                        refreshing:false,
                        pullDownRefresh:false,
                        iTotalDisplayRecords:data.resultMap.iTotalDisplayRecords
                    },()=>{
                        _this.isMoreFn();
                    });
                }else{
                    _this.setState({
                        list:[],
                        refreshing:false,
                        pullDownRefresh:false,
                        pullUpRefresh:false,
                        iTotalDisplayRecords:0,
                        isMore:false
                    });
                }
            },
            error(){
                _this.setState({
                    refreshing:false,
                    pullDownRefresh:false,
                    pullUpRefresh:false,
                    iTotalDisplayRecords:0,
                    isMore:false
                });
            }
        })
    }
    handleList(e){
        let node =  $(e.target);
        let id = node.attr("data-info");
        hashHistory.push("/orderDetail?id="+id);
    }
    onScroll(e){
        if(e.y>5){
            this.setState({refreshing:true,pullDownRefresh:true})
        }else if(e.y < (e.maxScrollY - 5)){
            this.setState({refreshing:true,pullUpRefresh:true})
        }
    }
    end(){
        let {pullDownRefresh,refreshing,isMore,pullUpRefresh,pageNo} = this.state;
        if(pullDownRefresh && refreshing){
            this.setState({pageNo:1},()=>{
                this.getList();
            })
        }else if(pullUpRefresh && refreshing && isMore){
            this.setState({pageNo:++pageNo},()=>{
                this.getList(this.state.pageNo);
            });
        }else{
            this.setState({
                pullDownRefresh : false,
                refreshing : false,
                pullUpRefresh : false,
            })
        }
    }
    render(){
        let {pullDownRefresh,pullUpRefresh,refreshing,list,isMore} = this.state;
        let pullDownStyle = "none";
        let pullUpStyle = "none";
        if(pullDownRefresh && refreshing){
            pullDownStyle = "block";
        }else if(pullUpRefresh && refreshing && isMore){
            pullUpStyle = "block";
        }
        return(
            <div id="wrapper">
                <ReactIScroll iScroll={iScrollProbe}
                              options={this.props.options}
                              onScroll={this.onScroll}
                              onScrollEnd={this.end}>
                    <div id="scroller">

                        <div id="pullDown" className={pullDownStyle}>
                            <div className="pullDownIcon"></div>
                            <div className="pullDownLabel">加载中</div>
                        </div>
                        <ul className="list-content">
                            {
                                list.length>0 && list.map((item,i)=>{
                                    return(
                                        <li className="order-list" key = {i} data-info = {item.orderNo} onClick = {this.handleList} >
                                            <p data-info = {item.orderNo}>{item.orderName}</p>
                                            <p data-info = {item.orderNo}>交货时间：{item.deliveryTime}</p>
                                            <p data-info = {item.orderNo}>{item.orderNum}双</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div id="pullUp" className={pullUpStyle}>
                            <div className="pullUpIcon"></div>
                            <div className="pullUpLabel">加载更多</div>
                        </div>
                    </div>
                </ReactIScroll>
            </div>

        )
    }
}
QueryList.defaultProps = {
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
