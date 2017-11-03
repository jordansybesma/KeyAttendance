


function closeAddStudent() {
    var span = document.getElementById("close");
    var popUp = document.getElementById('studentDiv');
    document.getElementById("newStudentFirst").value = "";
    document.getElementById("newStudentLast").value = "";
    popUp.style.display = "none";
}
function addAttendant(first, last) {
    var dt = new Date();
    // Display the month, day, and year. getMonth() returns a 0-based number.  
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var minute = dt.getMinutes();
    var seconds = dt.getSeconds();
    alert(month + '-' + day + '-' + year + "  " + hour+ " " + minute + " " + seconds);
    var xmlhttp = new XMLHttpRequest();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var date = year + "-" + month + "-" + day;
    var time = hour + ":" + minute + ":" + seconds
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addAttendant/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + first + "&lastName=" + last +"&art=FALSE&madeFood=FALSE&recievedFood=FALSE&leadership=FALSE&exercise=FALSE&mentalHealth=FALSE&volunteering=FALSE&oneOnOne=FALSE&comments=FALSE&date="+ date + "&time=" + time +"&id=");
        

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
    /*data = {
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
    console.log(data);*/
    document.getElementById("newStudentFirst").value = "";
    document.getElementById("newStudentLast").value = "";
    closeAddStudent();
    //var response = addAttendant(data);
    sendNewStudent(first, last);
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
function sendNewStudent(firstname, lastname) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addNewStudent/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + firstname + "&lastName=" + lastname);
}
/*function addAttendant(data) {
    var xhttp = new XMLHttpRequest();
    url = window.location.origin + "/addAttendant/";
    xhttp.open("POST", url, true);
    xhttp.send(data);
    //alert(urlAddOn + xhr.responseText);
    return xhttp.responseText;
}*/

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
function fillAttendance(_, attendance) {
    console.log(attendance);
    var myData = JSON.parse(attendance);
    for (i in myData) {
        console.log(myData[i]);
        addRowHelper(myData[i][1], myData[i][2], myData[i][3], myData[i][4])
    }
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

    document.getElementById("studentProfileText").innerHTML = JSON.stringify(studentInfo);

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

function handleProfileBox(e, curText) {
  if(e.keyCode === 13){
      showStudentProfile();
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
function addRowHelper(first, last, art, madeFood) {
    var table = document.getElementById("Attendance-Table");
    var keywordElement = document.getElementById('keyword').value;
    
    var date = getCurrentDate();
    //document.getElementById("keyword").value = "";
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var checkIDArt = date + first + last + "art";
    var checkIDmadeFood = date + first + last + "madeFood";
    str = "<form> <id='" + checkIDArt + "' input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'art', '" + date + "')\"></form>";
    str2 = "<form> <id='" + checkIDmadeFood + "' input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'madeFood', '" + date + "')\"></form>";

    cell1.innerHTML = first + " " + last;
    cell2.innerHTML = str;
    cell3.innerHTML = str2;

    if (art) {
        document.getElementById(checkIDArt).checked = true;
    }
    if (madeFood) {
        document.getElementById(checkIDmadeFood).checked = true;
    }
    //var names = keywordElement.split(" ");
    //addAttendant(names[0], names[1]);
    
}
function selectActivity(name, column, date) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/selectActivity");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&column=" + column + "&date=" + date);
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
    var date = getCurrentDate();
    if (optionFound){
    document.getElementById("keyword").value = "";
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    str = "<form> <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'art', '" + date + "')\"></form>";
    str2 = "<form> <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'madeFood', '" + date + "')\"></form>";

    cell1.innerHTML = keywordElement;
    cell2.innerHTML = str;
    cell3.innerHTML = str2;
    var names = keywordElement.split(" ");
    addAttendant(names[0], names[1]);
  } else {
    alert("Please enter an existing student");
  }
    //var str = "How are you doing today?";
    
}

function createNewAttendance() {
    var date = getCurrentDate();
    var readable = makeDateReadable(date);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet " + readable;
    var table = document.getElementById("Attendance-Table");
    table.innerHTML = "";
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "Name";
    cell2.innerHTML = "Health";
    cell3.innerHTML = "Food";
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
    //getRequest("/getAttendance/" + table_date, "", fillAttendance);??
}

function displayAttendanceTable(table_date) {
    var table = document.getElementById("Attendance-Table");
    table.innerHTML = "";
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "Name";
    cell2.innerHTML = "Health";
    cell3.innerHTML = "Food";
    var readable = makeDateReadable(table_date);
    var sql = makeDateSQL(readable);
    console.log(sql);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet " +readable;
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
    //var xmlhttp = new XMLHttpRequest();
    /*xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/temp");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send();*/
    getRequest("/getAttendance/" + table_date, "", fillAttendance);
    
    return false;
    // list.style.display = "none";
}

function createListOfAttendanceDates(_, dates) {
    console.log(dates);
    var myData = JSON.parse(dates);
    var list = document.getElementById("attendanceList");
    for (i in myData) {
        var date = myData[i][0];
        var readable = makeDateReadable(date);
        var entry = document.createElement('li');
        entry.innerHTML = '<span onclick="displayAttendanceTable(\'' + date + '\')">' + readable + '</span>';
        list.appendChild(entry);
    }   
}

function displayAttendanceList() {
    getRequest("/getDates", "", createListOfAttendanceDates);
}
function returnAttendance() {
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "none";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "block";
    var list = document.getElementById("attendanceList");
    list.innerHTML = '';
    getRequest("/getDates", "", createListOfAttendanceDates);
}
function makeDateReadable(date) {
    var month = date.substr(5, 7);
    var day = date.substr(8, 10);
    var year = date.substr(0, 4);
    var newDate = month.substr(0, 2) + "/" + day + "/" + year;
    return newDate;
}
function makeDateSQL(date) {
    var month = date.substr(0, 2);
    var day = date.substr(3, 4);
    var year = date.substr(6, 9);
    var newDate = year + "-" + month + "-" + day.substr(0,2);
    return newDate;
}
function getCurrentDate() {
    var dt = new Date();
    // Display the month, day, and year. getMonth() returns a 0-based number.  
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var year = dt.getFullYear();
   
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    
    var date = year + "-" + month + "-" + day;
    return date;
}
