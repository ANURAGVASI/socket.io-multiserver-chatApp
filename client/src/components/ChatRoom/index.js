import React from 'react';
import Sidebar from '../Sidebar';
import ChatWindow from '../ChatWindow';
import ChatUser from '../ChatUser';
import TextInput from '../TextInput';
import {withRouter} from 'react-router-dom';
import cookie from 'react-cookies';
import io from 'socket.io-client';
import './index.css';
const request = require('request');


class Chatroom extends React.Component{
    // assigning props
    constructor(props){
        super(props);
        this.state = {
            isEstablishingSession: false,
            chattingWith: null,
            socket: null,
            onlineUsers : [],
            myMessages: []
        }
    }

    // React life cycle hoo. redirect to login page
    // if n user cookies are found..
    componentWillMount(){
        if(cookie.load('user')){
            console.log('usr cookie...cookie found');
        }
        else{
            console.log('no cookie found..redirecting to login.');
            this.props.history.push('/');   
        }
    }
    
    

    // react life cycle hook. Establish socket if sucessfully mounted
    componentDidMount(){
        let _this = this;
        // get ip address of client
        request('http://ip-api.com/json',(err,res,body) => {
            console.log('your ip',JSON.parse(body).query);
            const clientIP = JSON.parse(body).query;

            const socket = io('localhost:3001');

            // checking for socket connection
            socket.on('connect',() => {
                console.log('socket established successfully with server..');
                console.log('requesting user session..');
                socket.emit('createsession',{...cookie.load('user'),clientIP});
                socket.on('accessdenied',(data) => {
                    // check if user session already present
                    if(data.err = "alreadyrunning"){
                        console.log('session already running at',data.address);
                        if(clientIP === data.address){
                            // redirect to error page
                            this.props.history.push('/error');
                        }
                    }
                    else{
                        console.log('error creating your session..');
                        console.log('clearing cookies..redirecting to login page');
                        cookie.remove('user');
                        this.props.history.push('/');
                        this.state.socket= null; // no need for re-rendering..hence not using setState()
                        socket.close();
                    }
    
                })

                socket.on('newClientOnline',(user) => {
                    console.log('new client connected',user);
                    if(cookie.load('user').email!==user.email){
                        let olUsers = this.state.onlineUsers;
                        olUsers.push(user.email);
                        this.setState({onlineUsers: olUsers});
                        console.log('available users', this.state.onlineUsers);
                    }
                });

                socket.on('clientOffline',(user) => {
                    console.log("client is offline",user);
                    const index = this.state.onlineUsers.indexOf(user)
                    if(index >-1){
                        console.log("index", index);
                        let olUsers = this.state.onlineUsers;
                        olUsers.splice(index,1);
                        console.log("online users are **",olUsers);
                        const messages = this.state.myMessages.filter((message) => {
                            if(message.from!==user && message.to!==user)
                                return message;
                        });

                        this.setState({onlineUsers:olUsers,myMessages:messages});
                    }
                })

                socket.on('accessgranted',(users) => {
                    console.log('user session established....');
                    this.setState({socket: socket})
                    if(cookie.load('user')){
                        let index= users.indexOf(cookie.load('user').email);
                        if(index>-1){
                            users.splice(index,1);
                        }
                    }
                    console.log("online users",users);
                    this.setState({onlineUsers: users});
                });

                socket.on('newMessage',(msg) => {
                    console.log('got new message',msg);
                    const messages = this.state.myMessages;
                    messages.push({
                        from: msg.from,
                        text: msg.text,
                        time: Date.now(),
                        type: 'from'
                    })
                    this.setState({myMessages: messages});
                })
            })
        });
    }

    sentMessage = (touser,message) => {
        const messages = this.state.myMessages;
        messages.push({
            to: touser,
            text: message,
            time: Date.now(),
            type: 'to'
        });
        this.setState({myMessages: messages});
    }

    chatWithuser(user){
        this.setState({chattingWith:user})
    }

    render(){
        console.log('renderingg', cookie.load('user'));
        const chattingWith=this.state.chattingWith || this.state.onlineUsers[0]
        return(
            <div>
                <div className="side-bar-parent" >
                    <Sidebar   chatWithuser={this.chatWithuser.bind(this)} cookie={cookie} users={this.state.onlineUsers} />
                </div>
                <div className="chat-window-parent" >
                    <ChatUser cookie={cookie}  chattingWith={chattingWith} />
                    <ChatWindow chattingWith={chattingWith} messages={this.state.myMessages} />
                    <TextInput sentMessage={this.sentMessage.bind(this)} chatWithuser={chattingWith} socket={this.state.socket} /> 
                </div>
             </div>
        )
    }
}

export default withRouter(Chatroom);