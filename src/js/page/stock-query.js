/**
 * Created by Administrator on 2017-3-21.
 */
import "../../css/page/stock-query.scss";
import iScrollProbe from "../lib/iscroll-probe";
import iScroll from "iscroll";
import ReactIScroll from "react-iscroll";
import {hashHistory} from "react-router";
import Util from "../util";
export default class Query extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list:[],
            refreshing:true,
            pullDownRefresh:true,
            listRequest:{
                id : "",
                classifyId : "",
                status : "",
            },
        };
        this.onScroll = this.onScroll.bind(this);
        this.onScrollStart = this.onScrollStart.bind(this);
        this.refresh = this.refresh.bind(this);
        this.end = this.end.bind(this);
        this.handleList = this.handleList.bind(this);

    }
    componentDidMount(){
        this.getList();
        let winH = $(window).height();
        $("#scroller").css("min-height",winH+2)

        console.log(winH)
    }
    getList(pageNo=1){
        let {listRequest} = this.state;
        let _this = this;
        $.ajax({
            url:Util.commonBaseUrl+"/mobile/store/findStoreList.htm",
            type:"get",
            dataType:"json",
            data:{page:pageNo,pageSize:50,d:JSON.stringify(listRequest)},
            success(data){
                if(data.success){
                    _this.setState({
                        list:data.resultMap.rows,
                        refreshing:false,
                        pullDownRefresh:false,
                    });
                }else{
                    _this.setState({
                        list:[],
                        refreshing:false,
                        pullDownRefresh:false,
                    });
                }
            },
            error(){
                _this.setState({
                    refreshing:false,
                    pullDownRefresh:false,
                });
            }
        })
    }
    handleList(e){
        let node =  $(e.target);
        hashHistory.push("/OrderList");
        console.log(node.attr("data-info"))
    }
    onScroll(e){
        console.log(e);
        if(e.y>5){
            this.setState({refreshing:true,pullDownRefresh:true})
        }else if(e.y<5){
            this.setState({refreshing:true,pullUpRefresh:true})
        }
    }
    onScrollStart(){}
    refresh(){}
    end(){
        let {pullDownRefresh,refreshing} = this.state;
        if(pullDownRefresh && refreshing){
            this.getList();
        }
    }
    render(){
        let {pullDownRefresh,pullUpRefresh,refreshing,list} = this.state;
        let pullDownStyle = "none";
        let pullUpStyle = "none";
        if(pullDownRefresh && refreshing){
            pullDownStyle = "block";
        }else if(pullUpRefresh && refreshing){
            pullUpStyle = "block";
        }
        return(
        <div id="wrapper">
            <ReactIScroll iScroll={iScrollProbe}
                          options={this.props.options}
                          onRefresh={this.refresh}
                          onScroll={this.onScroll}
                          onScrollStart={this.onScrollStart}
                          onScrollEnd={this.end}>
                <div id="scroller">

                    <div id="pullDown" className={pullDownStyle}>
                        <div className="pullDownIcon"></div>
                        <div className="pullDownLabel">加载中</div>
                    </div>

                    <div>
                        <div className="clearfix">
                                {
                                    list.length>0 && list.map((item,i)=>{
                                        return(
                                            <div className="stock-list" key = {i} data-info = {item.id} onClick = {this.handleList} >
                                                <img data-info = {item.id} className="query-img" src={item.url} alt=""/>
                                                <p data-info = {item.id}>{item.classifyName+item.colour+item.storeTotalNum+"双    "}</p>
                                            </div>
                                        )
                                    })
                                }
                        </div>
                    </div>
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