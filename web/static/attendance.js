function sendSubmitForm()  {
    theirText = document.getElementById("someRandoText").value
    console.log(theirText)
    /*
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(someStuff);
    */


    // Sending and receiving data in JSON format using POST method
    //
    var xhr = new XMLHttpRequest();
    var url = "137.22.166.165/addText/";
//    url = "http://127.0.0.1:5000/addText/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("attendance-json", "application/json");
    
    var data = JSON.stringify({"text": theirText});
    xhr.send(data);
}