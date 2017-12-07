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
    var list = document.getElementById('alertSpecifics');
    list.innerHTML = "";
    
    var name = "Name: " + alert[0] + " " + alert[1];
    var insertName = document.createElement('li');
    insertName.innerHTML = '<p>' + name +'</p>';
    list.appendChild(insertName);
    
    var message = "Message: " + alert[2];
    var insertMessage = document.createElement('li');
    insertMessage.innerHTML = '<p>' + message +'</p>';
    list.appendChild(insertMessage);

    var id = alert[3];
    
    var completeButton = "<button style=\"float: right\" onclick=\"checkAlert('" + id + "')\">Complete</button>";
    var completeButtonHTML = document.getElementById('completeButton');
    completeButtonHTML.innerHTML = completeButton;    
    
    var popup = document.getElementById('alertPopup');
    popup.style.display = "block";
}

function closeAlert() {
    var popup = document.getElementById('alertPopup');
    popup.style.display = "none";
    displayAlerts();
}

function checkAlert(id) {
    console.log(id);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com/checkAlert/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("id=" + id);
    closeAlert();
}

function displayAlertPopup() {
    var popup = document.getElementById("makeAlertPopup");
    popup.style.display = "block"; 
}

function closeCreateAlert(){
    document.getElementById("alertText").value = "";
    
    var popup = document.getElementById("makeAlertPopup");
    popup.style.display = "none";
}

function createAlert(){
    var data = document.getElementById("saveStudentData").innerHTML;
    var studentData = JSON.parse(data);
    var id = studentData[0][2];
    var alertText = document.getElementById("alertText").value;
    console.log("when creating it: " + alertText.value);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com/addAlert/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("id=" + id + "&alertText=" + alertText);
    closeCreateAlert();
}