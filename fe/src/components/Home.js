import React from 'react'
import {changeTitle} from '../utilities'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {
        changeTitle('Home')
    }
    render() {
        return (
            <div className={'content homePage'}>
                home
            </div>
        )
    }
}

export default Home