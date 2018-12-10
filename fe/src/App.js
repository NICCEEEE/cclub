import React, {Component} from 'react';
import './App.css';
import Header from "./components/Header"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Footer from "./components/Footer"
import routes from './routeConf'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginStatus: 'fail',
        }
    }
    handleLogin = () => {
        console.log('ready to login')
        this.setState({
            loginStatus: 'success'
        })
        console.log('login success', this.state.loginStatus)
    }
    render() {
        return (
            <Router>
                <div className="App">
                    <Header loginStatus={this.state.loginStatus}/>
                    <Switch>
                        {
                            routes.map((route, index) => {
                                if (route.exact === true) {
                                    return <Route key={index} exact path={route.path}
                                                  render={props => (
                                                      <route.component {...props} handleLogin={this.handleLogin} routes={route.routes}/>
                                                  )}/>
                                } else {
                                    return <Route key={index} path={route.path}
                                                  render={props => (
                                                      <route.component {...props} handleLogin={this.handleLogin} routes={route.routes}/>
                                                  )}/>
                                }
                            })
                        }
                    </Switch>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
