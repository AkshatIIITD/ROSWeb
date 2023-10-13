var publishImmidiately = true;
var robot_IP;
var manager;
var ros;


function initNavigation() {
    
}


window.onload = function () {
    robot_IP = "192.168.64.63";
    ros = new ROSLIB.Ros({
        url: "ws://" + robot_IP + ":9090"
    });
    ros.on('connection', function () {
        console.log('Connected to ROSBridge server');
    });
    ros.on('error', function (error) {
        console.error('Error connecting to ROSBridge server:', error);
    });
    
}