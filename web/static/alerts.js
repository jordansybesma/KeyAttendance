function displayAlerts() {
    getRequest("/getAlerts", "", showAlerts);
}

function showAlerts(_, alertList) {
    console.log(alertList)
    var alerts = JSON.parse(alertList);
    var list = document.getElementById("alertsList");
    list.innerHTML = "";
    for (i in alerts) {
        var alert = alerts[i];
        var name = alerts[i][0] + " " + alerts[i][1];
        var entry = document.createElement('li');
        entry.innerHTML = '<span onclick="displayAlert(\'' + alert + '\')">' + name + '</span>';
        list.appendChild(entry);
    }
}

function displayAlert(alert) {
    console.log(alert);
    alert = alert.split(",");
    var popup = document.getElementById('alertPopup');
    var alertText = document.getElementById('alertText');
    var name = alert[0] + " " + alert[1];    
    var message = "Message: " + alert[2];
    var nameHTML = '<h1>' + name +'</h1>';
    var messageHTML = '<p>' + message +'</p>';
    alertText.innerHTML = nameHTML + messageHTML + alertText.innerHTML;

    var id = alert[3];
    
    var completeButton = "<button style=\"float: right\" onclick=\"checkAlert('" + id + "')\">Complete</button>";
    var completeButtonHTML = document.getElementById('completeButton');
    completeButtonHTML.innerHTML = completeButton;    
    
    popup.style.display = "block";
}

function checkAlert(id) {
    console.log(id);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/checkAlert/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("id=" + id);
    closeAlert();
}

function closeAlert() {
    var popup = document.getElementById('alertPopup');
    var alertText = document.getElementById('alertText);
    popup.style.display = "none";
    alertText.innerHTML = "";
    displayAlerts();
}

function displayAlertPopup() {
    var popup = document.getElementById("makeAlertPopup");
    popup.style.display = "block"; 
}

function createAlert(){
    var data = document.getElementById("saveStudentData").innerHTML;
    var studentData = JSON.parse(data);
    var id = studentData[0][2];
    var alertText = document.getElementById("alertText").value;
    console.log("when creating it: " + alertText.value);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addAlert/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("id=" + id + "&alertText=" + alertText);
    closeCreateAlert();
}

function closeCreateAlert(){
    document.getElementById("alertText").value = "";
    
    var popup = document.getElementById("makeAlertPopup");
    popup.style.display = "none";
}