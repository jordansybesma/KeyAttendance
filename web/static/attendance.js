


function closeAddStudent() {
    var span = document.getElementById("close");
    var popUp = document.getElementById('studentDiv');
    document.getElementById("newStudentFirst").value = "";
    document.getElementById("newStudentLast").value = "";
    popUp.style.display = "none";
}
function addNewStudent() {

    var first = document.getElementById("newStudentFirst").value;
    var last = document.getElementById("newStudentLast").value;
    if (first == "") {
        alert("Please enter a first name");
        return;
    }
    if (last == "") {
        alert("Please enter a last name");
        return;
    }
    alert(first + " " + last);
    data = {
        "id": "3",
        "firstName": first,
        "lastName": last,
        "art": "FALSE",
        "madeFood": "FALSE",
        "recievedFood": "FALSE",
        "leadership": "FALSE",
        "exercise": "FALSE",
        "mentalHealth": "FALSE",
        "volunteering": "FALSE",
        "oneOnOne": "FALSE",
        "comments": "FALSE"
    };
    data = JSON.stringify(data);
    console.log(data);
    document.getElementById("newStudentFirst").value = "";
    document.getElementById("newStudentLast").value = "";
    closeAddStudent();
    var response = addAttendant(data);
}

function sendRequest(isPost, data, header, value, urlAddOn) {
    var xhr = new XMLHttpRequest();
    xhr.open(isPost? "POST": "GET", urlAddOn, true);
    // xhr.setRequestHeader(header, value);
    // var data = JSON.stringify({"text": theirText});
    xhr.send(data);
    alert(urlAddOn + xhr.responseText);
    return xhr.responseText;
}
function addAttendant(data) {
    var xhttp = new XMLHttpRequest();
    url = window.location.origin + "/addAttendant/";
    xhttp.open("POST", url, true);
    xhttp.send(data);
    //alert(urlAddOn + xhr.responseText);
    return xhttp.responseText;
}

function getRequest(urlAddon, callbackState, callback) {
    xmlHttpRequest = new XMLHttpRequest();
    url = window.location.origin + urlAddon;
    xmlHttpRequest.open('get', url);

    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200)  {
                if(callbackState == null)  {
                    callback(xmlHttpRequest.responseText);
                } else  {
                    callback(callbackState, xmlHttpRequest.responseText);
                }
           }
    };
    xmlHttpRequest.send(null);
}

function sendSubmitForm()  {
    theirText = document.getElementById("someRandoText").value
    console.log(theirText)

    console.log('theirText:' + sendRequest(true, theirText, "attendance-json", "application/json", "/addText"));
}

function modifyAutofillList(_ , studentNames) {
  var list = document.getElementById("suggestedStudents");
  var myData = JSON.parse(studentNames);
  inner = "";
  for (i in myData) {
    inner += "<option>" + myData[i][0] + " " + myData[i][1] + "</option>\n";
  }
  list.innerHTML = inner;
}
function showProfile(_, studentInfo) {
    alert("got to showProfile")
    var popUp = document.getElementById('studentInfo');
    popUp.style.display = "block";
    document.getElementById("testContent").value = JSON.stringify(studentInfo);
    alert(JSON.stringify(studentInfo))

}


function showSuggestions(curText) {
    getRequest("/autofill/" + curText, "", modifyAutofillList);
}

function handleAddBox(e, curText) {
  if(e.keyCode === 13){
      onAddRow();
}
  else {
    showSuggestions(curText);
  }
}
function checkBox(checkbox, keyword) {
    //var val = checkbox.value;
    //alert(keyword + ' is ' + val);
    var str = "got here " + checkbox.value + " " + keyword;
    alert(str);
}
function openAddStudent() {
    var popUp = document.getElementById('studentDiv');
    popUp.style.display = "block";
}

function showStudentProfile() {
    alert("got here")
    //var table = document.getElementById("Attendance-Table");
    var keywordElement = document.getElementById('keywordStudentSearch').value;
    var optionFound = false;
    datalist = document.getElementById("suggestedStudents");
    for (var j = 0; j < datalist.options.length; j++){
        if (keywordElement == datalist.options[j].value){
            optionFound= true;
            break;
        }
    }
    if (optionFound) {
        alert("option found")
        alert(keywordElement)
        getRequest("http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/getID/" + keywordElement, "", showProfile);


    }

}

function onAddRow() {
    var table = document.getElementById("Attendance-Table");
    var keywordElement = document.getElementById('keyword').value;
    var optionFound = false;
    datalist = document.getElementById("suggestedStudents");
    for (var j = 0; j < datalist.options.length; j++){
      if (keywordElement == datalist.options[j].value){
        optionFound= true;
        break;
      }
    }
    if (optionFound){
    document.getElementById("keyword").value = "";
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    str = "<form> <input type=\"checkbox\" onclick=\"checkBox(this, \'" + keywordElement + "\')\"></form>";

    cell1.innerHTML = keywordElement;
    cell2.innerHTML = str;
    cell3.innerHTML = str;
  } else {
    alert("Please enter an existing student");
  }

}

function displayAttendanceTable(table_name) {
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
}

function displayAttendanceList() {
    alert("got here");
    /*var list = document.getElementById("attendanceList");
    var attendance_names = '{"atten", "atten1", "atten2"}';
    var myData = JSON.parse(attendance_names);
    
    for (i in myData) {
        var a = document.createElement('a');
        var entry = document.createElement('li');
        a.title = myData[i][0];
        a.href = "displayAttendanceTable(" + myData[i][0] + ")";
        entry.appendChild(a);
        list.appendChild(entry);
    }*/
    var list = document.getElementById("attendanceList");
    var attendance_name = 'Attendance Table';
    //var myData = JSON.parse(attendance_names);
    
    
        var a = document.createElement('a');
        var entry = document.createElement('li');
        var linkText = document.createTextNode(attendance_name);
        //linkText.onclick = "displayAttendanceTable(" + attendance_name + ")";
        a.appendChild(linkText);
        a.title = attendance_name;
        a.href = "#";
        a.onclick = "displayAttendanceTable(" + attendance_name + ")";
        entry.appendChild(a);
        list.appendChild(entry);
    //<a onclick="jsfunction()" href="#">


    //var firstname = document.getElementById('firstname').value;
    //var entry = document.createElement('li');
    //entry.appendChild(document.createTextNode(firstname));
    //list.appendChild(entry);
}
