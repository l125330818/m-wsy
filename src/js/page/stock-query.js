/**
 * Created by Administrator on 2017-3-21.
 */
import "../../css/page/stock-query.scss";
import iScrollProbe from "../lib/iscroll-probe";
import iScroll from "iscroll";
import ReactIScroll from "react-iscroll";
import {hashHistory} from "react-router";
import RUI from "react-component-lib";
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
            listRequest:{
                id : "",
                classifyId : "",
                status : "",
            },
            isMore:false,
            iTotalDisplayRecords:0,
            pageSize:1,
            pageNo:1,
            productSelect : [{key:"全部",value:""}],
        };
        this.onScroll = this.onScroll.bind(this);
        this.end = this.end.bind(this);
        this.handleList = this.handleList.bind(this);
        this.listSelect = this.listSelect.bind(this);
    }
    componentDidMount(){
        this.getList();
        this.productList();
        let winH = $(window).height();
        let winW = $(window).width();
        let paddingNum = winW%122;
        let imgW =(winW-60)/2;
        $("#scroller").css("min-height",winH+2);
        //$("#list-content").css("padding-left",paddingNum/2);
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
    productList(){
        let _this = this;
        let {productSelect} = this.state;
        $.ajax({
            url:Util.commonBaseUrl+"/mobile/product/findByPage.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify({classifyId:"",name:""}),pageNo:1,pageSize:20000},
            success(data){
                if(data.success){
                    let rows = data.resultMap.rows;
                    rows && rows.map((item)=>{
                        productSelect.push({key:item.name,value:item.id})
                    });
                    _this.setState({productSelect});
                }else{
                    productSelect = [{key:"全部",value:""}];
                    _this.setState({productSelect});
                }
            }
        })
    }
    getList(pageNo=1){
        let {listRequest,pageSize} = this.state;
        let _this = this;
        $.ajax({
            url:Util.commonBaseUrl+"/mobile/store/findStoreList.htm",
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
        let id = node.attr("data-id");
        let name = node.attr("data-name");
        hashHistory.push("/stockDetail?id="+id+"&name="+name);
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
    listSelect(e){

        let {listRequest} = this.state;
        listRequest.id = e.value;
        this.setState({pageNo:1,listRequest},()=>{
            this.getList();
        });
    }
    render(){
        let {pullDownRefresh,pullUpRefresh,refreshing,list,isMore,productSelect} = this.state;
        let pullDownStyle = "none";
        let pullUpStyle = "none";
        if(pullDownRefresh && refreshing){
            pullDownStyle = "block";
        }else if(pullUpRefresh && refreshing && isMore){
            pullUpStyle = "block";
        }
        let winW = $(window).width();
        let imgW =(winW-84)/2;
        let selectW = winW-22;
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
                    <RUI.Select
                        data={productSelect}
                        value={{key:'全部',value:''}}
                        stuff={true}
                        event = "click"
                        style = {{width:selectW,margin:"10px"}}
                        callback = {this.listSelect}
                        className="rui-theme-1 w-120">
                    </RUI.Select>
                    <div className="clearfix" id = "list-content">
                            {
                                list.length>0 && list.map((item,i)=>{
                                    return(
                                        <div className="stock-list" key = {i}
                                             data-id = {item.id}
                                             data-name = {item.name}
                                             onClick = {this.handleList} >
                                            <img data-id = {item.id}
                                                 data-name = {item.name}
                                                 style = {{width:imgW}}
                                                 className="query-img" src={item.url} alt=""/>
                                            <p  style = {{width:imgW}} className="over" data-id = {item.id} data-name = {item.name}>{item.name}</p>
                                            <p data-id = {item.id} data-name = {item.name}>{item.storeTotalNum+"双    "}</p>
                                        </div>
                                    )
                                })
                            }
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
