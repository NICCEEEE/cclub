import React, {Component} from 'react';
import './App.css';
import Header from "./components/Header"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Footer from "./components/Footer"
import routes from './routeConf'

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Header/>
                    <Switch>
                        {
                            routes.map((route, index) => {
                                if (route.exact === true) {
                                    return <Route key={index} exact path={route.path}
                                                  render={props => (
                                                      <route.component {...props} routes={route.routes}/>
                                                  )}/>
                                } else {
                                    return <Route key={index} path={route.path}
                                                  render={props => (
                                                      <route.component {...props} routes={route.routes}/>
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
