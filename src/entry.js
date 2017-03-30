/**
 * Created by luojie on 2017/3/27 11:36.
 */
import { Router, Route, hashHistory } from 'react-router';
import StockQuery from "./js/page/stock-query";
import StockDetail from "./js/page/stock-detail";
import OrderList from "./js/page/order-list";
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={StockQuery}/>
        <Route path='/stockDetail' component={StockDetail}/>
        <Route path='/OrderList' component={OrderList}/>
    </Router>
), document.getElementById('app'));