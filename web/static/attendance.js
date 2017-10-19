function sendRequest(isPost, data, header, value, urlAddOn)  {
    var xhr = new XMLHttpRequest();
    xhr.open(isPost? "POST": "GET", urlAddOn, true);
    xhr.setRequestHeader(header, value);
    var data = JSON.stringify({"text": theirText});
    xhr.send(data);
    return xhr.responseText;
}


function sendSubmitForm()  {
    theirText = document.getElementById("someRandoText").value
    console.log(theirText)

    console.log('theirText:' + sendRequest(true, theirText, "attendance-json", "application/json", "/addText"));
}
