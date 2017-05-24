
let net = require('net')
let crypto = require('crypto')
let messageQueue = []

process.on('message', msg=> {
	if ( !msg.alias ) return;
	messageQueue.push(msg);
	console.log('msgQueue => ' + JSON.stringify(messageQueue));
});


let server = net.createServer( (c) => {
	console.log("listener => ");
	c.on('end', ()=>{
		console.log("client disconnected");
	})
	
	//c.write('Hello/r/n');
	//c.pipe(c);

	c.on('data', data=>{
		//console.log(data.toString());
		//c.pipe(c);
		let txt = data.toString();
		/**
		 * txt: eventName_[Object]
		 */
		if ( txt.indexOf('_') >= 0 ) {
			let splitIdx = txt.indexOf('_');
			let evt = txt.substr(0, splitIdx);
			let msg = txt.substr(splitIdx+1, txt.length);
			handler({server, client: c, event: {evt, msg} });
		}
	});
})

handler = itface => {
	const { server, client, event } = itface;
	const { evt, msg } = event;
	
	switch( evt ) {
		case 'auth':
			if ( !server.clientMap ) {
				server.clientMap = {}
			}
			let md5 = crypto.createHash('md5');
			md5.update(msg);
			md5 = md5.digest('hex');
			client.md5 = md5;
			server.clientMap[md5] = JSON.parse(msg);			
			//client.pipe(client);
			console.log('client -> ' + JSON.stringify(server.clientMap))
			break;
		case 'heart':
			token = client.md5;
			for ( let i=0 ; i<messageQueue.length ; i++ ) {
				let message = messageQueue[i];
				if ( message.alias == server.clientMap[token].id ) {
					messageQueue.splice(i, 1);
					i--;
					let msg = Object.assign({}, message);
					delete msg.alias;
					client.write(JSON.stringify(msg)+"\t\n")
					console.log('msgQueue => ' + JSON.stringify(messageQueue));
				}
			}
			break;
		case 'logout':
			token = client.md5;
			console.log(`logout => ${JSON.stringify(server.clientMap[token])}`)
			delete server.clientMap[token];
			console.log(`clientMap ->${JSON.stringify(server.clientMap)}`)
		
			//client.pipe(client)
			break;
		default:
			break;
	}
}



server.listen(8888, ()=>{
	console.log('server bind =>8888')
})

