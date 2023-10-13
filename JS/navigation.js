var publishImmidiately = true;
var ros;

function sendNavigationGoal(x, y) {
  var goalMessage = new ROSLIB.Message({
    x: x,
    y: y,
  });
  var goalTopic = new ROSLIB.Topic({
    ros: ros,
    name: "/navigation_goal", // Adjust the topic name according to your robot's setup.
    messageType: "your_custom_message_type", // Modify this to your message type.
  });
  goalTopic.publish(goalMessage);
}

//In this code, when the user enters the X and Y coordinates for the navigation goal and clicks the "Send Goal" button, it sends a message to your robot containing the goal coordinates. You'll need to adjust the code to match your robot's specific setup, including the message type, topic, and message format.
// Make sure to replace 'your_custom_message_type' and '/navigation_goal' with the appropriate values for your robot's navigation system.

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
    // Send the pre-defined cabin coordinates.
    sendNavigationGoal(cabinCoordinates.x, cabinCoordinates.y);
  });
};
