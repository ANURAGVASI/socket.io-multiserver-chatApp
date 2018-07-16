const cluster = require('cluster');
const workers = [];
const cpus = require('os').cpus().length;
const port = process.env.PORT || 3001;
const clients = {};
const net = require('net');
const farmhash = require('farmhash');
const express = require('express');
const redis = require('socket.io-redis'); 
const socketio = require('socket.io');
const path = require('path');
const memored = require('memored');
const circularjson = require('circular-json');

if(cluster.isMaster){
    console.log('Master started process id', process.pid);

    for(let i=0;i<cpus;i++){
        workers.push( cluster.fork());
        console.log('worker strated '+workers[i].id);

        workers[i].on('disconnect',() => {
            console.log('worker '+ workers[i].id+'died');
        });

        // handling process.send message events in master
        workers[i].on('message',(msg) => {
          if(msg.cmd==='newMessage'){
              console.log("master is notified about new message by worker",workers[i].id);
              sendNewmessage(msg);
          }
        })
    }

    // notifying all workers about new client
    sendNewmessage = (msg) => {
        workers[msg.workerID-1].send({
           ...msg 
        })
    }

    // get worker index based on Ip and total no of workers so that it can be tranferred to same worker
    const getWorker_index = (ip,len) => {
        return farmhash.fingerprint32(ip)%len;
    }

    // ceating TCP server
    const server = net.createServer({
        // seting pauseOnCOnnect to true , so that when  we receive a connection pause it
        // and send to corresponding worker
        pauseOnConnect: true 
    }, (connection) => {
        // We received a connection and need to pass it to the appropriate
		// worker. Get the worker for this connection's source IP and pass
        // it the connection. we use above defined getworker_index func for that
        const worker = workers[getWorker_index(connection.remoteAddress,cpus)];

        // send the connection to the worker and send resume it there using .resume()
        worker.send({
            cmd:'sticky-session'
        },connection);
    }).listen(port);


    process.on('SIGINT',() => {
        console.log('cleaning up master server...');
        server.close();
        memored.clean(() => {
            onsole.log('cleaned memory..');
        })
        process.exit(1);
    });

}
else{
    
    const app = express();

    const Expserver = app.listen(3002,'localhost');

    const io = socketio(Expserver);

    // setting redis adapter as message broker and for
    // inter communication of connected sockets
    const socket_adapter = io.adapter(redis({ host: 'localhost', port: 6379 }));

    // Add a basic route – index page
    app.use(express.static(path.resolve(__dirname,'../'+'client/build/')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'../client/build/index.html'));
      });

    // require('./routes/register')(app,cluster,clients);
    
    io.on('connection', (socket) => {
        let newSocket = circularjson.stringify(socket);
        // let newSocket1 = new socketio( circularjson.parse(newSocket));
        console.log('client connected ..'+socket.id+'..cluster'+cluster.worker.id);

        // Accept login event with user data
        socket.on('createsession',(data) => {
            console.log('creating session for...',data);
            if(data && clients[data.email]){
                console.log('already session available for user.',clients[data.email].email);
                socket.emit('accessdenied',{err:'alreadyrunning',address:clients[data.email].clientIP});
            }
            else{
                // adding to clients list
                socket.email = data.email;
                socket.clientIP = data.clientIP;
                socket.workerID = cluster.worker.id;
                clients[data.email] = socket;

                // storing client-worker relation in memory
                memored.store(data.email,{
                    workerID : cluster.worker.id
                },() => {
                    console.log("*8stored in memory**");
                    memored.keys((err,keys) => {
                        console.log('session created..available users',keys);
                        socket.emit('accessgranted',keys);
                        socket.broadcast.emit('newClientOnline',{
                            email: data.email
                        })
                    })                  
                });
            }
        });

        // new Message event from client...redirect to appropriate client
        socket.on('newMessage', (message) => {
            console.log('message arrived',message);
            // getting mapped workerID from memory
             memored.read(message.to,(err,val) => {
                 if(err){
                     console.log(err);
                 }
                 else{
                     if(val)
                    // send message to mater..master will redirect
                    // to appropriate worker
                     process.send({
                         cmd:'newMessage',
                         to: message.to,
                         from: socket.email,
                         text: message.message,
                         workerID : val.workerID
                     })
                     else{
                        //  client offline suport---in dev
                        console.log('requested  client offline');
                        socket.emit('clientNotFound');
                     }
                 }
             })
        })

        // disonnet event when a client disconnects
        socket.on('disconnect',() => {
            console.log('client disconnected...',socket.id);
            console.log('deleting client..');
            // notifying master about client disconnect 
            delete clients[socket.email];
            memored.remove(socket.email,()=>{
                console.log('client removed from memory');
            });
            socket.broadcast.emit('clientOffline',socket.email);
        });
    });
        
    // listning for message event sent by master to catch the connection and resume
    cluster.worker.on('message',(obj,data) => {
        switch(obj.cmd){
            case "sticky-session":
                Expserver.emit('connection',data);
                data.resume();
                break;

            case "newMessage":
                console.log("message handled by"+ cluster.worker.id);
                clients[obj.to].emit("newMessage",{
                    from: obj.from ,
                    text: obj.text
                });
                break;
                
            default: return;
        }            
    });

    // SIGINT handling cleaning open servers and processes
    process.on('SIGINT',() => {
        console.log('cleaning up process...');
        Expserver.close();
        process.exit(1);
    });
}