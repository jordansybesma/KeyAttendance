// FF
// Sends input in feedback textbox to database.
function sendFeedback() {
    var feedback = document.getElementById("feedback").value;
    var date = getCurrentDate();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/sendFeedback");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("date=" + date + "&feedback=" + feedback);
    document.getElementById("feedback").value = "";
}