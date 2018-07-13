import React from 'react';
import {withRouter} from 'react-router-dom';

class ErrorPage extends React.Component{
    render(){
        return( 
            <p style={{textAlign:'center',marginTop:'20px'}} >
        oops! your session is already running in your Browser in another tab.
                    Kindly close the browser and restart if problem persists.</p>
        )
        
    }
}

export default withRouter(ErrorPage);