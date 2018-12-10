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
                    <span>Idea comes from <a href={'https://community.nodebb.org/'}>NodeBB</a> and <a
                        href={'https://community.nodebb-cn.org/'}>NodeBB.CN</a>.</span>
                    <span style={{marginRight: '10px', marginLeft: '10px'}}>Powered by <a
                        href={'https://www.vultr.com/'}>Vultr</a>.</span>
                    <span> Copyright © 2018 <a href={'http://cwuc.cc'}>CWUC.CC</a>. All rights reserved.</span>
                </div>
            </footer>
        )
    }
}

export default Footer