var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'veggie-place-API',
    description: '',
    script: 'C:/Users/sheri/Documents/TCC-veggie-place/index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
});
