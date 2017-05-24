let child = require('child_process');
let readline = require('readline');

let cp = child.fork('./server.js');

cp.on('message', msg=>{
	console.log('main => receive: ', msg);
})
cp.send({time: new Date().toString()});



let talk = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

talk.on('line', line=>{
	let splitIndex = line.indexOf(',');
	let alias = parseInt(line.substring(0, splitIndex));
	let content = line.substring(splitIndex+1, line.length);
	
	if ( content.startsWith('logout') ) {
		msg = {alias, event: content}
	} else {
		msg = {alias, msg: content};
	}

	cp.send(msg);
	console.log('msg => ' + JSON.stringify(msg) );
})
