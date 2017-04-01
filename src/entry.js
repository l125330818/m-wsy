/**
 * Created by luojie on 2017/3/27 11:36.
 */
import { Router, Route, hashHistory } from 'react-router';
ReactDOM.render((
    <Router history={hashHistory}>

        <Route path="/" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/stock-query"))
                })
            }}/>
        <Route path="/orderList" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/order-list"))
                })
            }}/>
        <Route path="/stockDetail" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/stock-detail"))
                })
            }}/>
    </Router>
), document.getElementById('app'));