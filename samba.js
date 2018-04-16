const SambaClient = require("samba-client");

const path = '//192.168.10.8/WEBAPPS';
const destination = '';

const client = new SambaClient({
    address: path,
    username: 'admin',
    password: '1314ctmw6e'
});

client.getFile('\\*', '\\*',function (err) {
    console.log(err)
});