var ros;
var canvas;
var ctx;
var selectedCoordinates;
var cabinCoordinates = {
  x: 3.5,
  y: 2.75,
};
var doorCoordinates = {
  x: -3,
  y: -2,
};

document.addEventListener("DOMContentLoaded", function () {
  canvas = document.getElementById("goal-canvas");
  ctx = canvas.getContext("2d");
  canvas.width = document.getElementById("map-image").width;
  canvas.height = document.getElementById("map-image").height;
  selectedCoordinates = document.getElementById("selected-coordinates")
});

function drawMarker(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function sendNavigationGoal(x, y) {
  var pose = new ROSLIB.Message({
    header: {
      frame_id: "map",
    },
    pose: {
      position: {
        x: x,
        y: y,
        z: 0.0,
      },
      orientation: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        w: 1.0,
      },
    },
  });
  var goalTopic = new ROSLIB.Topic({
    ros: ros,
    name: "/move_base_simple/goal",
    messageType: "geometry_msgs/PoseStamped",
  });
  goalTopic.publish(pose);
}

window.onload = function () {
  robot_IP = "192.168.64.63";
  ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090",
  });
  ros.on("connection", function () {
    console.log("Connected to ROSBridge server");
  });
  ros.on("error", function (error) {
    console.error("Error connecting to ROSBridge server:", error);
  });
  canvas.addEventListener("click", function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    selectedCoordinates.textContent = `Selected Coordinates: (${x.toFixed(2)}, ${y.toFixed(2)})`;
    drawMarker(x, y);
  });
  var sendGoalButton = document.getElementById("send-goal");
  sendGoalButton.addEventListener("click", function () {
    var goalX = parseFloat(document.getElementById("goal-x").value);
    var goalY = parseFloat(document.getElementById("goal-y").value);

    if (!isNaN(goalX) && !isNaN(goalY)) {
      sendNavigationGoal(goalX, goalY);
    } else {
      alert("Please enter valid coordinates.");
    }
  });
  var sendCabinButton = document.getElementById("send-cabin");
  sendCabinButton.addEventListener("click", function () {
    sendNavigationGoal(cabinCoordinates.x, cabinCoordinates.y);
  });
  var sendDoorButton = document.getElementById("send-door");
  sendDoorButton.addEventListener("click", function () {
    sendNavigationGoal(doorCoordinates.x, doorCoordinates.y);
  });
};
