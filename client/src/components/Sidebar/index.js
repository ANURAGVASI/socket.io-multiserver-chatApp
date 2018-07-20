import React from 'react';
import "./index.css";

export default class sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            Cuser: (this.props.cookie.load('user')) ?this.props.cookie.load('user').email : null
        }
    }

    render(){
        return(
            <div className="side-bar" >
               <p className="online-header-text" > Online users </p>
                <hr/>
                {
                    (this.props.users && this.props.users.length!==0)
                    ? <div>
                        {
                            this.props.users.map((user,i) => {
                                if(user!==this.state.Cuser)
                                return(
                                    <div key={i}>
                                    <p className="sidebar-user"
                                    onClick={(e) => {this.props.chatWithuser(user)}} >
                                        {/* <i class="fa fa-circle" aria-hidden="true"></i>
                                     */}
                                     <img src={require('../../static/user-default.png')} className="user-image" />
                                        {user}
                                        
                                    </p>
                                    <hr className="divider-sidebar" />
                                    </div>  
                                )
                            })
                        }
                    </div>
                    : <p>no online users</p>
                }
            </div>
        );
    }
}