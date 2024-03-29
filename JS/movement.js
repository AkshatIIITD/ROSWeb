var twist;
var cmdVel;
var publishImmidiately = true;
var manager;
var teleop;
var ros;

function moveAction(linear, angular) {
  if (linear !== undefined && angular !== undefined) {
    twist.linear.x = linear;
    twist.angular.z = angular;
  } else {
    twist.linear.x = 0;
    twist.angular.z = 0;
  }
  cmdVel.publish(twist);
}

function initVelocityPublisher() {
  // Init message with zero values.
  twist = new ROSLIB.Message({
    linear: {
      x: 0,
      y: 0,
      z: 0,
    },
    angular: {
      x: 0,
      y: 0,
      z: 0,
    },
  });
  // Init topic object
  cmdVel = new ROSLIB.Topic({
    ros: ros,
    name: "/cmd_vel",
    messageType: "geometry_msgs/Twist",
  });
  // Register publisher within ROS system
  cmdVel.advertise();
}

function initTeleopKeyboard() {
  // Use w, s, a, d keys to drive your robot

  // Check if keyboard controller was aready created
  if (teleop == null) {
    // Initialize the teleop.
    teleop = new KEYBOARDTELEOP.Teleop({
      ros: ros,
      topic: "/cmd_vel",
    });
  }

  // Add event listener for slider moves
  robotSpeedRange = document.getElementById("robot-speed");
  robotSpeedRange.oninput = function () {
    teleop.scale = robotSpeedRange.value / 100;
  };
}

function createJoystick() {
  if (manager == null) {
    joystickContainer = document.getElementById("joystick");
    var options = {
      zone: joystickContainer,
      position: { left: 50 + "%", top: 70 + "%" },
      mode: "static",
      size: 100,
      color: "#22A39F",
      restJoystick: true,
    };
    manager = nipplejs.create(options);
    manager.on("move", function (evt, stick) {
      var direction = stick.angle.degree - 90;
      if (direction > 180) {
        direction = -(450 - stick.angle.degree);
      }
      var lin = Math.cos(direction / 57.29) * stick.distance * 0.005;
      var ang = Math.sin(direction / 57.29) * stick.distance * 0.05;
      if (publishImmidiately) {
        publishImmidiately = false;
        moveAction(lin, ang);
        setTimeout(function () {
          publishImmidiately = true;
        }, 50);
      }
    });
    // event litener for joystick release, always send stop message
    manager.on("end", function () {
      moveAction(0, 0);
    });
  }
}

window.onload = function () {
  var robot_IP = "192.168.64.63";
  ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090",
  });
  ros.on("connection", function () {
    console.log("Connected to ROSBridge server");
  });
  ros.on("error", function (error) {
    console.error("Error connecting to ROSBridge server:", error);
  });
  initVelocityPublisher();
  createJoystick();
  initTeleopKeyboard();
};
