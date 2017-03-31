/**
 * Created by luojie on 2017/3/27 11:36.
 */
import { Router, Route, hashHistory } from 'react-router';
import StockDetail from "./js/page/stock-detail";
ReactDOM.render((
    <Router history={hashHistory}>

        <Route path="/" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/stock-query"))
                })
            }}/>
        <Route path="/OrderList" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/order-list"))
                })
            }}/>
    </Router>
), document.getElementById('app'));