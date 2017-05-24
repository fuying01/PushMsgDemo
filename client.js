
let net = require('net')

/**
 * event:
 *	auth_{}
 *	heart_
 *	logout_
 */

const client = net.connect({port : 8888}, () => {
	console.log('connect to server : 8888');
	let user = {
		id: 36,
		name: 'XShadow'
	}
	client.write('auth_' + JSON.stringify(user));
	
	client.user = user
	client.interval = setInterval(()=>{
		//client.write(`heart=${client.token}`);
		client.write('heart_');
	}, 100);
	client.stopInterval = ()=>{clearInterval(client.interval); client.on('data', data=>{})}
});
client.on('data', data=>{
	data = data.toString();
	data = data.split('\t\n');
	
	data.forEach( msg=> {
		if ( !msg ) return;

		console.log(`msg = |${msg}|`)
		msg = JSON.parse(msg.toString());
		try{
			client.handleMsg(msg);
		} catch (err) {
		}
	})
	//client.end();
});
client.handleMsg = msg=>{
	if ( !msg.event ) {
		console.log(msg);
	}
	switch(msg.event) {
		case 'logout':
			client.stopInterval();
			client.write('logout_');
			client.end();
			break; 
		default:
			break;
	}
}
client.on('end', ()=>{
	console.log('disconnected from server');
	client.interval && clearInterval(client.interval);
});

