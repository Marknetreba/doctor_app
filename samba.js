const SambaClient = require("samba-client");

const path = '';
const destination = '';

const client = new SambaClient({
    address: path,
    username: '',
    password: ''
});

client.getFile(path, destination, function (err) {
    console.log(err)
});