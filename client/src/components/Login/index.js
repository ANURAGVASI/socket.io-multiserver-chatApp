import React from 'react';
import 'whatwg-fetch';
import {withRouter} from 'react-router-dom';
import cookie from 'react-cookies';
import $ from 'jquery';

 class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showErrors: false,
            error: null
        }
    }

    componentWillMount(){
        console.log('checking if user cookies are present..');
        if(cookie.load('user')){
            console.log('cookie found',cookie.load('user'));
            this.props.history.push('/chatroom')
        }
        else{
            console.log('no cookies found...continue to login.')
        }
    }

    isvalid = (email) => {
        if(email ){
            return true;
        }
        return false;
    }

    handleLogin = () => {
        // validating user data
        const email = $(".useremail").val();
        // const username = $(".username").val();
        
        if(this.isvalid(email)){
            // enter chat room
            cookie.save('user',{email});
            this.props.history.push('/chatroom');
        }
        else{
            // disply error on page
            this.setState({showErrors:true,error:'please fill above details before entering'});
        }
    }

    render(){
        return(
            <div>
                <input type="text" className="useremail" placeholder="username" name="email" />
                <br/>
                {/* <input typ="text" className="username" placeholder="username" name="username" /> */}
                <br/>
                <button onClick={this.handleLogin} >Enter Chat Room</button>
                <br/>
                {
                    (this.state.showErrors)
                    ? <p style={{color: 'red'}} >{this.state.error}</p>
                    : null
                }
            </div>
        )
    }
}

export default withRouter(Login);