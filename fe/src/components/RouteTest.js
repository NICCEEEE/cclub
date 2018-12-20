import React from 'react'
import {Link, Route, Switch} from 'react-router-dom'
import Setting from "./Setting"
import Edit from "./Edit"
import Notify from "./Notify"
import Message from "./Message"

class RouteTest extends React.Component {
    render() {
        return (
            <div style={{marginTop: '100px'}}>
                <div className={'left'} style={{float: 'left'}}>
                    <Link to={'/route/edit'}>编辑</Link><br/>
                    <Link to={'/route/notification'}>通知</Link><br/>
                    <Link to={'/route/message'}>私信</Link><br/>
                    <Link to={'/route/setting'}>设置</Link><br/>
                </div>
                <div className={'right'} style={{width: '300px', height: '300px', backgroundColor: 'pink'}}>
                    <Route path={'/route/edit'} component={Edit}/>
                    <Route path={'/route/notification'} component={Notify}/>
                    <Route path={'/route/message'} component={Message}/>
                    <Route path={'/route/setting'} component={Setting}/>
                </div>
            </div>
        )
    }
}

export default RouteTest