function sendSubmitForm()  {
    theirText = document.getElementById("someRandoText").value
    console.log(theirText)
    console.log(window.location.hostname)
    /*
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(someStuff);
    */


    // Sending and receiving data in JSON format using POST method
    //
    var xhr = new XMLHttpRequest();
    var url = "137.22.166.165/addText/";
    url = "http://127.0.0.1:5000/addText/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("attendance-json", "application/json");
    
    var data = JSON.stringify({"text": theirText});
    xhr.send(data);
}
function onAddRow() {
    var table = document.getElementById("Attendance-Table");
    var keywordElement = document.getElementById('keyword').value;
    if (keywordElement != ""){
    document.getElementById("nameEnter").reset();
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    str = '<form> <input type="checkbox"></form>';
    cell1.innerHTML = keywordElement;
    cell2.innerHTML = str;
    cell3.innerHTML = str;
    }
    
}

