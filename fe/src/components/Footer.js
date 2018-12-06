import React from 'react'
import '../assets/css/Footer.css'

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div className={'footerColor'}>
                    <div className="color-1"></div>
                    <div className="color-2"></div>
                    <div className="color-3"></div>
                    <div className="color-4"></div>
                    <div className="color-5"></div>
                </div>
                <div className={'copyright'}>
                    <span style={{marginRight: '10px'}}>Powered by <a href={'https://www.vultr.com/'}>Vultr</a>.</span>
                    <span style={{marginLeft: '10px'}}> Copyright © 2018 Cclub For <a href={'http://cwuc.cc'}>CWUC.CC</a>. All rights reserved.</span>
                </div>
            </footer>
        )
    }
}

export default Footer