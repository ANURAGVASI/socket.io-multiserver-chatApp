import React from 'react';
import 'whatwg-fetch';
import {withRouter} from 'react-router-dom';
import cookie from 'react-cookies';
import $ from 'jquery';
import './index.css';

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
        this.state.error = (this.state.error)?this.state.error :this.props.error;
        return(
            <div>
                <div>
                    <p className="welcome-text" >Welcome!! to Real Time Chat Application</p>
                </div>
                <div className="input-div" >
                    <input type="text" className="useremail" placeholder="Username" name="email" />
                    {/* <input typ="text" className="username" placeholder="username" name="username" /> */}
                    <button className="login-btn" onClick={this.handleLogin} >Enter Chat Room</button>
                    <br/>
                    {
                        (this.state.showErrors)
                        ? <p className="error-text" style={{color: 'red'}} >{this.state.error}</p>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Login);