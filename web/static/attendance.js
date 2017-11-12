

// Called when a user exits the add new student pop up window
function closeAddStudent() {
    var span = document.getElementById("close");
    var popUp = document.getElementById('studentDiv');
    document.getElementById("newStudentFirst").value = "";
    document.getElementById("newStudentLast").value = "";
    popUp.style.display = "none";
}

// Called when a new name is added to the attendance sheet
function addAttendant(first, last) {
    var dt = new Date();
    // Display the month, day, and year. getMonth() returns a 0-based number.
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var year = dt.getFullYear();
    var hour = dt.getHours();
    var minute = dt.getMinutes();
    var seconds = dt.getSeconds();

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
    //var date = year + "-" + month + "-" + day;
    var time = hour + ":" + minute + ":" + seconds;
    var date = document.getElementById("storeDate").innerHTML;
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addAttendant/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + first + "&lastName=" + last + "&art=FALSE&madeFood=FALSE&recievedFood=FALSE&leadership=FALSE&exersize=FALSE&mentalHealth=FALSE&volunteering=FALSE&oneOnOne=FALSE&comments=FALSE&date=" + date + "&time=" + time + "&id=");
}

// Called when a user clicks submit on the add new student dialogue. checks
//that both values have been entered then adds them to the database
function addNewStudent() {

    var first = document.getElementById("newStudentFirst").value;
    var firstChar = first[0];
    firstChar = firstChar.toUpperCase();
    first = firstChar + first.slice(1);


    var last = document.getElementById("newStudentLast").value;
    var lastChar = last[0];
    lastChar = lastChar.toUpperCase();
    last = lastChar + last.slice(1);

    if (first == "") {
        alert("Please enter a first name");
        return;
    }
    if (last == "") {
        alert("Please enter a last name");
        return;
    }

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
    return xhr.responseText;
}
function sendNewStudent(firstname, lastname) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addNewStudent/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + firstname + "&lastName=" + lastname);
}

function deleteAttendant(date, name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/deleteAttendant");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&date=" + date);
    displayAttendanceTable(date);
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

function sendSubmitForm() {
    theirText = document.getElementById("someRandoText").value

}
function fillAttendance(_, attendance) {
    var myData = JSON.parse(attendance);
    var columnData = document.getElementById("columns").innerHTML;
    var myColumns = JSON.parse(columnData);
    for (i in myData) {
        addRowHelper2(myColumns, myData[i]);
    }
    /*for (i in myData) {
        addRowHelper(myData[i][1], myData[i][2], myData[i][3], myData[i][4], myData[i][5],myData[i][6],myData[i][7],myData[i][8],myData[i][9],myData[i][10])
    }*/
}

function makeHeaderReadable(header) {
    var newHeader = "";
    var newChar = "";
    for (i in header) {
        if (i == 0) {
            newChar = header[i].toUpperCase();
        } else if (header[i] == header[i].toUpperCase()) {
            if (header[i - 1] != "_") {
                newHeader = newHeader + " ";
                newChar = header[i];
            }
        } else if (header[i] == "_") {
            newHeader = newHeader + " ";
            newChar = "";
        } else {
            if (header[i - 1] == "_") {
                newChar = header[i].toUpperCase();
            }
            newChar = header[i];
        }
        newHeader = newHeader + newChar;
    }
    return newHeader;
}

function addRowHelper2(columns, entry) {
    var table = document.getElementById("Attendance-Table");

    //var date = getCurrentDate();
    var date = document.getElementById("storeDate").innerHTML;
    document.getElementById("keyword").value = "";


    //var fields = ['art', 'madeFood', 'recievedFood', 'leadership', 'exersize', 'mentalHealth', 'volunteering', 'oneOnOne'];
    //var checked = [art, madeFood, recievedFood, leadership, exersize, mentalHealth, volunteering, oneOnOne];
    console.log(entry);
    console.log(entry[11]);
    var row = table.insertRow(1);
    fullName = entry[0] + " " + entry[1];
    row.insertCell(-1).innerHTML = fullName;
    for (i in columns) {

        if (columns[i][1] == true) {
            console.log((i+ 2));
            var index = parseInt(i) + 2;
            var str = "<input type=\"checkbox\" "
            + (entry[index] ? "checked" : "")
            + " onclick=\"selectActivity('" + fullName + "','" + columns[i][2] + "', '" + date + "')\">";
            row.insertCell(-1).innerHTML = str;
        }
    }

    var str = "<button type=\"button\" onclick=\"deleteAttendant('" + date + "', '" + fullName + "')\">Delete </button>";
    row.insertCell(-1).innerHTML = str;
}
function showProfileManage() {
    table = document.getElementById("studentColumnsTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = "Column Name";
    row.insertCell(-1).innerHTML = "Show in Profile";
    row.insertCell(-1).innerHTML = "Show in Quick Add";
    getRequest("/getStudentColumns", "", showStudentManageHelper);
}

function showStudentManageHelper(_, data) {
    var myData = JSON.parse(data);
    var table = document.getElementById("studentColumnsTable");
    for (i in myData) {
        console.log(myData[i]);
        var row = table.insertRow(-1);
        name = myData[i][2];
        //for some reason this breaks everthing - can't figure out why?
        //newName = makeHeaderReadable(name);
        row.insertCell(-1).innerHTML = name;
        var str = "<input type=\"checkbox\" "
            + (myData[i][0] ? "checked" : "")
            + " onclick=\"selectStudentColumn('" + myData[i][2] + "', 'isShowing')\">";
        row.insertCell(-1).innerHTML = str;
        var str1 = "<input type=\"checkbox\" "
            + (myData[i][1] ? "checked" : "")
            + " onclick=\"selectStudentColumn('" + myData[i][2] + "', 'isQuick')\">";
        row.insertCell(-1).innerHTML = str1;
        var str2 = "<button type=\"button\" onclick=\"deleteStudentColumn('" + myData[i][2] + "')\">Delete </button>";
        row.insertCell(-1).innerHTML = str2;
    }
}

function selectStudentColumn(name, column) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/alterStudentColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&column=" + column);
}

function deleteStudentColumn(name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/deleteStudentColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name);
    showProfileManage()
}

function showAttendanceManage() {
    table = document.getElementById("attendanceColumnsTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = "Column Name";
    row.insertCell(-1).innerHTML = "Currently in Use";
    getRequest("/getAttendanceColumns", "", showAttendanceManageHelper);

}
function showAttendanceManageHelper(_, data){
    var myData = JSON.parse(data);
    var table = document.getElementById("attendanceColumnsTable");
    for (i in myData) {
        console.log(myData[i]);
        var row = table.insertRow(-1);
        row.insertCell(-1).innerHTML = myData[i][2];
        var str = "<input type=\"checkbox\" "
            + (myData[i][1] ? "checked" : "")
            + " onclick=\"selectColumn('" + myData[i][2] + "')\">";
        row.insertCell(-1).innerHTML = str;
        var str2 = "<button type=\"button\" onclick=\"deleteColumn('" + myData[i][2]  + "')\">Delete </button>";
        row.insertCell(-1).innerHTML = str2;
    }
}
function deleteColumn(name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/deleteAttendanceColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name);
    showAttendanceManage()
}
function selectColumn(name) {
    console.log("got here");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/updateAttendanceColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name);
}
function addStudentColumn() {
    var name = document.getElementById("studentColumnName").value;
    var type = document.getElementById("studentColumnType").value;
    if (name == "") {
        alert("Please enter a name")
        return;
    }
    var substring = " ";
    if (name.indexOf(substring) != -1) {
        alert("Please enter a column name with no spaces")
        return;
    }
    if (type == "") {
        alert("Please enter a type")
        return;
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addStudentColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&type=" + type + "&definedOptions=");

    /*var table = document.getElementById("attendanceColumnsTable");
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = name;
    var str = "<input type=\"checkbox\" "
            + "checked"
            + " onclick=\"selectColumn('" + name + "')\">";
    row.insertCell(-1).innerHTML = str;*/

}

function addColumn() {
    var name = document.getElementById("newColumn").value;
    var substring = " ";
    if (name.indexOf(substring)!= -1) {
        alert("Please enter a column name with no spaces")
        return;
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addAttendanceColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&type=boolean");


    var table = document.getElementById("attendanceColumnsTable");
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = name;
    var str = "<input type=\"checkbox\" "
            + "checked"
            + " onclick=\"selectColumn('" + name + "')\">";
    row.insertCell(-1).innerHTML = str;
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

    document.getElementById("studentProfileText").innerHTML += ("ID Number: ")

    document.getElementById("studentProfileText").innerHTML += JSON.stringify(studentInfo)


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
    var str = "got to checkBox " + checkbox.value + " " + keyword;
}
function openAddStudent() {
    var popUp = document.getElementById('studentDiv');
    popUp.style.display = "block";
}

function showStudentProfile() {
    console.log("got here");


    var peerSpace = document.getElementById("frequentPeers");
    peerSpace.innerHTML += ("Frequently Attends With: \n")

    var profileSpace = document.getElementById('studentProfileText');
    profileSpace.innerHTML = ("");
    var nameSpace = document.getElementById('studentName');
    nameSpace.innerHTML = ("");
    console.log("got here 2");
    //var table = document.getElementById("Attendance-Table");
    var keywordElement = document.getElementById('keywordStudentSearch').value;

    var optionFound = false;
    datalist = document.getElementById("suggestedStudents");
    for (var j = 0; j < datalist.options.length; j++) {
        if (keywordElement == datalist.options[j].value) {
            optionFound= true;
            break;
        }
    }
    if (optionFound) {
        console.log("got here 3");
        nameSpace.innerHTML += (keywordElement);
        profileSpace.innerHTML += ("\n");
        console.log(keywordElement);
        getRequest("/getStudentInfo/" + keywordElement, "", showDemographics);
        //getRequest("/getJustID/" + keywordElement, "", showProfile);
        

    }

}

function showDemographics(_, data) {
    var parsedData = JSON.parse(data);
    console.log(parsedData);
    document.getElementById("saveStudentData").innerHTML = data;
    
    getRequest("/getStudentColumns", "", demographicsHelper);
    
}
function demographicsHelper(_, columns) {

    var data = document.getElementById("saveStudentData").innerHTML;
    document.getElementById("saveColumnData").innerHTML = columns;
    var studentInfo = JSON.parse(data);
    var columnInfo = JSON.parse(columns);
    var keywordElement = document.getElementById('keywordStudentSearch').value;
    var div = document.getElementById("demographics");
    div.innerHTML = "<button type=\"button\" onclick=\"openEditProfile()\">Edit Profile</button>";


    for (i in columnInfo) {
        if (columnInfo[i][0]) {
            displayStudentInfo(columnInfo[i][2], studentInfo[0][parseInt(i) + 3], columnInfo[i][3]);
        }
    }

   
    getRequest("/getStudentAttendance/" + keywordElement + "/", "", showStudentAttendance);
}

function openEditProfile() {
    console.log("gets to here");
    var name = document.getElementById('keywordStudentSearch').value;
    var studentInfo = document.getElementById("saveStudentData").innerHTML;
    var columns = document.getElementById("saveColumnData").innerHTML;
    var keywordElement = document.getElementById('keywordStudentSearch').value;
    var div = document.getElementById("editProfile");
    div.style.display = "block";
    var studentData = JSON.parse(studentInfo);
    var studData = studentData[0];
    var columnData = JSON.parse(columns);
    for (i in columnData) {
        console.log("outer loop");
        if (columnData[i][0]) {
            console.log("next loop");
            var form = document.createElement("form");
            var type = columnData[i][3];
            form.setAttribute('onSubmit', 'return false;');
            if ((type == "varchar(500)")|| (type == "int")) {
                console.log("got to last loop");
                var col = columnData[i][2];
                var str = col + ":<br> <input id='" + col + "colid' type='text' value='" +studData[parseInt(i)+3] + "' /> <br>";
                str = str + " <input type='submit' value='Save' onclick=\"updateProfile('" + keywordElement + "','" + col;
                str = str + "','" + col + "colid', '" + columnData[i][3] + "')\"/><br><br>"
                console.log(str);
                form.innerHTML = str;
                div.appendChild(form);
            } else if (type == "date") {
                var col = columnData[i][2];
                var str = col + ":<br> <input id='" + col + "colid' type='date' value='" + studData[parseInt(i) + 3] + "'/> <br>";
                str = str + " <input type='submit' value='Save' onclick=\"updateProfile('" + keywordElement + "','" + col;
                str = str + "','" + col + "colid', '" + columnData[i][3] + "')\"/><br><br>"
                console.log(str);
                form.innerHTML = str;
                div.appendChild(form);
            } else if (type == "boolean") {
                var col = columnData[i][2];
                var str = col + ": "
                if (studData[parseInt(i) + 3]) {
                    str = str + " <input type='checkbox' checked value='Save' onclick=\"updateProfile('" + keywordElement + "','" + col;
                } else {
                    str = str + " <input type='checkbox' value='Save' onclick=\"updateProfile('" + keywordElement + "','" + col;

                }
                str = str + "','" + col + "colid', '" + columnData[i][3] + "')\"/><br><br>"
                console.log(str);
                form.innerHTML = str;
                div.appendChild(form);
            }
            
        }

    }
    var returnButton = document.createElement('button');
    returnButton.setAttribute('name', 'Return to Profile');
    returnButton.setAttribute('onclick', 'returnToProfile()');
    returnButton.innerHTML = "Return to Profile";
    div.appendChild(returnButton);
}

function returnToProfile() {
    var div = document.getElementById("editProfile");
    div.innerHTML = "";
    div.style.display = "none";
    showStudentProfile();
}

function updateProfile(name, col, colid, type) {
    if (type == "boolean") {
        var value = "TRUE";
    } else {
        var value = document.getElementById(colid).value;
    }
    
    

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/updateStudentInfo/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&value=" + value + "&column=" + col);
}

function displayStudentInfo(catName, info, type) {
    var parent = document.getElementById("demographics");
    var node = document.createElement("p");
    //var diplayName = makeHeaderReadable(catName);
    console.log(type);
    if (info == null) {
        var text = document.createTextNode(catName + ": " );
    } else if (type == "varchar(500)") {
        console.log("var");
        var text = document.createTextNode(catName + ": " + info);
    } else if (type == "int") {
        console.log("int");
        var text = document.createTextNode(catName + ": " + info.toString());
    } else if (type == "date") {
        console.log("date");
        var text = document.createTextNode(catName + ": " + makeDateReadable(info));
    } else if (type == "boolean") {
        console.log("bool");
        if (info) {
            var text = document.createTextNode(catName + ": yes");
        } else {
            var text = document.createTextNode(catName + ": no");
        }
    }
    node.appendChild(text);
    parent.appendChild(node);
}

function showStudentAttendance(_, data) {

    var parsedData = JSON.parse(data);

    console.log(JSON.parse(data));
    //
    // var x = [];

    var dateCounts = [0, 0, 0, 0, 0, 0, 0];

    var dateTimes = [[], [], [], [], [], [], []];

    var scatterx = [];
    var scattery = [];

    for(i = 0; i < parsedData.length; i++) {
      var dateString = parsedData[i][12];
      console.log(dateString);
      var dateList = dateString.split("-")
      var myDate = new Date(parseInt(dateList[0]), parseInt(dateList[1]), parseInt(dateList[2]), 1, 1, 1, 1);
      var day = myDate.getDay();
      dateCounts[day] = dateCounts[day] + 1;
      console.log(myDate.getDay());
      var time = parsedData[i][13];
      console.log(time);
      var timeList = time.split(":");
      var hour = parseInt(timeList[0]);
      scatterx.push(convertDay(day));
      scattery.push(hour);
      /*console.log(timeList);
      var baseTenTime = parseInt(timeList[0]) + (parseInt(timeList[1]) / 60);
      console.log(baseTenTime);
      dateTimes[myDate.getDay()].push(baseTenTime);*/
    }
    console.log(dateTimes);



    graphStudentAttendance(dateCounts);

    //scatterStudentAttendance(dateTimes);
    scatterStudentAttendance(scatterx, scattery);

    // var trace1 = {
    //   x: [1, 2, 3, 4, 5],
    //   y: [1, 6, 3, 6, 1],
    //   mode: 'markers',
    //   type: 'scatter',
    //   name: 'Team A',
    //   text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
    //   marker: { size: 12 }
    // };


    fillProfileTable(parsedData);
}

function convertDay(day) {
    if (day == 0) {
        return "Sunday";
    } else if (day == 1) {
        return "Monday"
    } else if (day == 2) {
        return "Tuesday"
    } else if (day == 3) {
        return "Wednesday"
    } else if (day == 4) {
        return "Thursday"
    } else if (day == 5) {
        return "Friday"
    } else if (day == 6) {
        return "Saturday"
    }
}

function scatterStudentAttendance(xList, yList) {
    var trace0 = {
        x: ["Sunday","Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        y: [0,0,0,0,0,0,0],
        mode: 'lines',
        type: 'scatter',
        marker: {
            size: 0,
            color: 'black'
        }
    };

    var trace1 = {
        x: xList,
        y: yList,
        mode: 'markers',
        type: 'scatter',
        marker: {opacity: 0.5, size: 14}
    };

    var data = [trace0, trace1];

    var layout = {
        showlegend: false,
        autosize: false,
        width: 400,
        height: 400,
        title: 'Attendance Times'
    };

    Plotly.newPlot('studentTimes', data, layout);
}

/*function scatterStudentAttendance(dateTimes){
    var xList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var yList = [[], [], [], [], [], [], []];

    for (i = 0; i < dateTimes.length; i++) {
      for (j = 0; j < dateTimes[i].length; i++) {
        xList.push(xList[i]);
        yList.push(dateTimes[i][j]);
      }
    }
    console.log(xList);
    console.log(yList);

    var trace1 = {
      x: xList,
      y: yList,
      type: 'scatter'
    };

    var data = [trace1];

    var layout = {
      autosize: false,
      width: 500,
      height: 500,
      title: 'Attendance Times'
    };

    Plotly.newPlot('studentTimes', data, layout);
}
*/
function graphStudentAttendance(yaxis) {
    var max = Math.max.apply(Math, yaxis);
    //var min = Math.min.apply(Math, yaxis);
    //var change = Math.ceil((max - min) / xaxis.lenth);
    change = 1;
    xaxis = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var trace1 = {
        x: xaxis,
        y: yaxis,
        type: 'bar'
    };
    var data = [trace1];

    var layout = {
        autosize: false,
        width: 400,
        height: 400,
        title: 'Recent Attendance'
    };

    Plotly.newPlot('graphStudent', data, layout);
}

function fillProfileTable(attendance)  {
    var table = document.getElementById("profileAttendanceTable");
    table.innerHTML = ""
    var fields = ['ID', 'First', 'Last', 'Art', 'Made Food', 'Recieved Food', 'Leadership', 'Exersize', 'Mental Health', 'Volunteering', 'One On One', 'Comments', 'Date', 'Time'];
    row = table.insertRow(-1);
    for (header of fields)  {
        row.insertCell(-1).innerHTML = header;
    }

    for (i in attendance)  {
        currRow = table.insertRow(-1);
        currLine = attendance[i];
        for (i in currLine)  {
            currRow.insertCell(-1).innerHTML = currLine[i];
        }
    }
}

function addRowHelper(first, last, art, madeFood, recievedFood, leadership, exersize, mentalHealth, volunteering, oneOnOne) {

    var table = document.getElementById("Attendance-Table");

    //var date = getCurrentDate();
    var date = document.getElementById("storeDate").innerHTML;
    document.getElementById("keyword").value = "";


    var fields = ['art', 'madeFood', 'recievedFood', 'leadership', 'exersize', 'mentalHealth', 'volunteering', 'oneOnOne'];
    var checked = [art, madeFood, recievedFood, leadership, exersize, mentalHealth, volunteering, oneOnOne];

    var row = table.insertRow(1);
    fullName = first + " " + last;
    row.insertCell(0).innerHTML = fullName;

    for(var i = 0; i < 8; i++)  {
        var str = "<input type=\"checkbox\" "
            + (checked[i]? "checked": "")
            + " onclick=\"selectActivity('" + fullName + "','" + fields[i] + "', '" + date + "')\">";
        row.insertCell(i + 1).innerHTML = str;
    }

    var str = "<button type=\"button\" onclick=\"deleteAttendant('" + date + "', '" + fullName + "')\">Delete </button>";
    row.insertCell(9).innerHTML = str;
}

function makeChecks(art, artID, madeFood, madeFoodID) {
    if (art) {
        document.getElementById(artID).checked = true;
    }
    if (madeFood) {
        document.getElementById(checkIDmadeFood).checked = true;
    }
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
    //var date = getCurrentDate();
    var date = document.getElementById("storeDate").innerHTML;
    if (optionFound)  {
        document.getElementById("keyword").value = "";
        fields = ['art','madeFood','recievedFood','leadership','exersize','mentalHealth','volunteering','oneOnOne']
        var row = table.insertRow(1);
        row.insertCell(0).innerHTML = keywordElement;

        for(var i = 0; i < 8; i++)  {
            var str = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "','" + fields[i] + "', '" + date + "')\">";
            row.insertCell(i + 1).innerHTML = str;
        }

        var str = "<button type=\"button\" onclick=\"deleteAttendant('" + date + "', '" + keywordElement + "')\">Delete </button>"
        row.insertCell(9).innerHTML = str;
        var names = keywordElement.split(" ");
        addAttendant(names[0], names[1]);
    } else {
        alert("Please enter an existing student");
    }
    //var str = "How are you doing today?";

}

function createNewAttendance() {
    var date = getCurrentDate();
    document.getElementById("storeDate").innerHTML = date;
    var readable = makeDateReadable(date);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet " + readable;
    var table = document.getElementById("Attendance-Table");
    makeTableHeader(table);
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
    //getRequest("/getAttendance/" + table_date, "", fillAttendance);??
}

function makeTableHeader(table) {
    table.innerHTML = "";
    /*var row = table.insertRow(0);
    cellNames = ["Name", "Art", "Made Food", "Recieved Food", "Leadership", "Exersize", "Mental Health", "Volunteering", "One On One"];
    for (header of cellNames) {
        row.insertCell(-1).innerHTML = header;
    }*/
    console.log("got here");
    getRequest("/getAttendanceColumns", "", makeTableHeaderHelper);
}

function makeTableHeaderHelper(_, data) {
    console.log("got to helper");
    console.log(data);
    document.getElementById("columns").innerHTML = data;
    table = document.getElementById("Attendance-Table");
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = "Name";
    var myData = JSON.parse(data);
    for (i in myData){
        if (myData[i][1] == true) {
            var newHeader = makeHeaderReadable(myData[i][2]);
            row.insertCell(-1).innerHTML = newHeader;
        }

    }
    var table_date = document.getElementById("storeDate").innerHTML;
    getRequest("/getAttendance/" + table_date, "", fillAttendance);
}

function refreshAttendanceTable() {
    var date = document.getElementById("storeDate").innerHTML;
    displayAttendanceTable(date);
}

function displayAttendanceTable(table_date) {
    document.getElementById("storeDate").innerHTML = table_date;
    var table = document.getElementById("Attendance-Table");
    console.log("about to create header");
    makeTableHeader(table);
    var readable = makeDateReadable(table_date);
    var sql = makeDateSQL(readable);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet " +readable;
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
    /*var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/tempStudentColumns");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send();*/


    return false;
    // list.style.display = "none";
}

function createListOfAttendanceDates(_, dates) {
    var myData = JSON.parse(dates);
    var list = document.getElementById("attendanceList");
    list.innerHTML = "";
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

function displayMasterAttendance() {
    var table = document.getElementById("masterAttendanceTable");
    table.innerHTML = "";
    getRequest("/getAttendanceColumns", "", makeMasterTableHeader);
}

function makeMasterTableHeader(_, columns) {
    table = document.getElementById("masterAttendanceTable");
    var row = table.insertRow(-1);
    document.getElementById("columnData").innerHTML = columns;
    row.insertCell(-1).innerHTML = "Date";
    row.insertCell(-1).innerHTML = "Attendees";
    var myData = JSON.parse(columns);
    for (i in myData) {
        if (myData[i][1] == true) {
            var newHeader = makeHeaderReadable(myData[i][2]);
            row.insertCell(-1).innerHTML = newHeader;
        }
    }
    getRequest("/getMasterAttendance", "", masterAttendanceHelper);
}



function masterAttendanceHelper(_, masterData) {
    var myData = JSON.parse(masterData);
    console.log(masterData);
    columns = document.getElementById("columnData").innerHTML;
    columnData = JSON.parse(columns);
    /*var row = table.insertRow(-1);
    headers = ["Date", "# Attendees", "# Art", "# Make Food", "# Recieved Food", "# Leadership", "# Exersize", "# Mental Health", "# Volunteering", "# One On One"];
    for (header of headers)  {
        row.insertCell(-1).innerHTML = header;
    }*/
    var xaxis = [];
    var yaxis = [];
    var yaxisArt = [];
    var yaxisMadeFood = [];
    var yaxisRecievedFood = [];
    var yaxisLeadership = [];
    var yaxisExersize = [];
    var yaxisMentalHealth = [];
    var yaxisVolunteering = [];
    var yaxisOneOnOne = [];
    for (i in myData) {
        xaxis.push(myData[i][0]);
        yaxis.push(myData[i][1]);
        yaxisArt.push(myData[i][2]);
        yaxisMadeFood.push(myData[i][3]);
        yaxisRecievedFood.push(myData[i][4]);
        yaxisLeadership.push(myData[i][5]);
        yaxisExersize.push(myData[i][6]);
        yaxisMentalHealth.push(myData[i][7]);
        yaxisVolunteering.push(myData[i][8]);
        yaxisOneOnOne.push(myData[i][9]);
        var row = table.insertRow(-1);
        row.insertCell(-1).innerHTML = myData[i][0];
        row.insertCell(-1).innerHTML = myData[i][1];
        for (j in columnData) {
            if (columnData[j][1] == true) {
                row.insertCell(-1).innerHTML = myData[i][parseInt(j) + 1];
            }
            
        }
    }

    masterDataPlot(xaxis, yaxis);
    activitiesPlot(xaxis, yaxisArt, yaxisMadeFood, yaxisRecievedFood, yaxisLeadership, yaxisExersize, yaxisMentalHealth, yaxisVolunteering, yaxisOneOnOne);


}

function activitiesPlot(xaxis, yaxisArt, yaxisMadeFood, yaxisRecievedFood, yaxisLeadership, yaxisExersize, yaxisMentalHealth, yaxisVolunteering, yaxisOneOnOne){
    var maxList = [];
    maxList.push(Math.max.apply(Math, yaxisArt));
    maxList.push(Math.max.apply(Math, yaxisMadeFood));
    maxList.push(Math.max.apply(Math, yaxisRecievedFood));
    maxList.push(Math.max.apply(Math, yaxisLeadership));
    maxList.push(Math.max.apply(Math, yaxisExersize));
    maxList.push(Math.max.apply(Math, yaxisMentalHealth));
    maxList.push(Math.max.apply(Math, yaxisVolunteering));
    maxList.push(Math.max.apply(Math, yaxisOneOnOne));
    var max = Math.max.apply(Math, maxList);
    //var min = Math.min.apply(Math, yaxis);
    //var change = Math.ceil((max - min) / xaxis.lenth);
    var change = 10;

    var trace1 = {
        x: xaxis,
        y: yaxisArt,
        mode: 'lines',
        name: "Art",
        line: {
            width: 3
        }
    };
    var trace2 = {
        x: xaxis,
        y: yaxisMadeFood,
        mode: 'lines',
        name: "Made Food",
        line: {
            width: 3
        }
    };
    var trace3 = {
        x: xaxis,
        y: yaxisRecievedFood,
        mode: 'lines',
        name: "Received Food",
        line: {
            width: 3
        }
    };
    var trace4 = {
        x: xaxis,
        y: yaxisLeadership,
        mode: 'lines',
        name: "Leadership",
        line: {
            width: 3
        }
    };
    var trace5 = {
        x: xaxis,
        y: yaxisExersize,
        mode: 'lines',
        name: "Exersize",
        line: {
            width: 3
        }
    };
    var trace6 = {
        x: xaxis,
        y: yaxisMentalHealth,
        mode: 'lines',
        name: "Mental Health",
        line: {
            width: 3
        }
    };
    var trace7 = {
        x: xaxis,
        y: yaxisVolunteering,
        mode: 'lines',
        name: "Volunteering",
        line: {
            width: 3
        }
    };
    var trace8 = {
        x: xaxis,
        y: yaxisOneOnOne,
        mode: 'lines',
        name: "OneOnOne",
        line: {
            width: 3
        }
    };
    var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8];

    var layout = {
        autosize: false,
        width: 500,
        height: 500,
        yaxis: {
            autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: change,
            ticklen: 1,
            tickwidth: 1,
            tickcolor: '#000',
            autorange: false,
            range: [0, max]
        },
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        },
        title: 'Activity Participation',
        layout_autorange_after: false

    };

    Plotly.newPlot('activityGraph', data, layout);
}

function masterDataPlot(xaxis, yaxis) {
    var max = Math.max.apply(Math, yaxis);
    var min = Math.min.apply(Math, yaxis);
    var change = Math.ceil((max - min) / xaxis.lenth);
    change = 10;

    var trace1 = {
        x: xaxis,
        y: yaxis,
        mode: 'lines',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 3
        }
    };
    var data = [trace1];

    var layout = {
        autosize: false,
        width: 500,
        height: 500,
        yaxis: {
            autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: change,
            ticklen: 1,
            tickwidth: 1,
            tickcolor: '#000',
            autorange: false,
            range: [0, max]
        },
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        },
        title: 'Recent Attendance',
        layout_autorange_after : false

    };

    Plotly.newPlot('masterGraph', data, layout);
}

function checkLogin() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    getRequest("/getLogin/" + user + " " + pass, "", checkLoginHelper);

}

function checkLoginHelper(_, loginData) {
    var myData = JSON.parse(loginData);
    if (myData.length > 0) {
        var hide = document.getElementById('login');
        hide.style.display = "none";
        var show = document.getElementById('dontShow');
        show.style.display = "block";
    } else {
        alert("Incorrect Login");
    }
}
function showLogin() {
    var hide = document.getElementById('login');
    hide.style.display = "block";
    var show = document.getElementById('dontShow');
    show.style.display = "none";
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
//used with date picker
function getDate() {
    var date = document.getElementById("datePicker").value;
    console.log(date);
    displayAttendanceTable(date);
    return false;
}

/*function runPHP() {
    $.ajax({
        url: 'makeFile.php',
        type: 'post',
        data: { "callFunc1": "1" },
        success: function (response) { console.log(response); }
    });
}*/

function createFile() {
    //var date = getCurrentDate();
    var date = document.getElementById("storeDate").innerHTML;
    getRequest("/getAttendance/" + date, "", createFileHelper);
    var rows = [];
    rows.push(["things", "things2", "thing3"]);
    rows.push(["things4", "things5", "thing6"]);
    rows.push(["things7", "things8", "thing9"]);
    //exportToCsv("testFile.csv", rows);
}

function createFileHelper(_, attendance) {
    var rows = [];
    rows.push(["ID", "First Name", "Last Name", "Art", "Made Food", "Recieved Food", "Leadership", "Exersize", "Mental Health", "Volunteering", "One on One", "Comments", "Date", "Time"]);

    var myData = JSON.parse(attendance);
    for (i in myData){
        rows.push(myData[i]);
    }
    var date = myData[0][12];
    var filename = "Attendance_" + date + ".csv";

    exportToCsv(filename, rows);

}

function downloadAllMaster() {
    getRequest("/getMasterAttendance", "", downloadAllMasterHelper);
    return false;
}
function downloadMasterDates() {
    var start = document.getElementById("startDate").value;
    var end = document.getElementById("endDate").value;
    console.log(start);
    console.log(end);
    console.log(typeof start);
    if (start == ""){
        alert("Please enter a start date");
        return false;
    }
    if (end == ""){
        alert("Please enter an end date");
        return false;
    }
    console.log(start + " " + end);
    console.log("/getMasterAttendanceDate/" + start + " " + end);
    getRequest("/getMasterAttendanceDate/" + start + " " + end, "", downloadAllMasterHelper);
    return false;
}



function downloadAllMasterHelper(_, data) {
    var rows = [];
    rows.push(["Date", "Number Attended", "Art", "Made Food", "Recieved Food", "Leadership", "Exersize", "Mental Health", "Volunteering", "One on One"]);

    var myData = JSON.parse(data);
    for (i in myData) {
        rows.push(myData[i]);
    }
    var date = getCurrentDate();
    var filename = "Master_Attendance_" + date + ".csv";
    exportToCsv(filename, rows);
    return false;
}

// source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function sendFeedback() {
    var feedback = document.getElementById("feedback").value;
    var date = getCurrentDate();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/sendFeedback");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("date=" + date + "&feedback=" + feedback);
    document.getElementById("feedback").value = "";

}
function login() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    getRequest("/getLogin/" + user + " " + pass, "", loginHelper);

}
function loginHelper(_, loginData) {
    var myData = JSON.parse(loginData);
    if (myData.length > 0) {
        var url = '/main/';
        window.location = url;
    } else {
        alert("Incorrect Login");
    }
}


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
    var message = "Message: " + alert[2];
    var insertMessage = document.createElement('li');
    insertName.innerHTML = '<p>' + name +'</p>';
    insertMessage.innerHTML = '<p>' + message +'</p>';
    list.appendChild(insertName);
    list.appendChild(insertMessage);
    var popup = document.getElementById('alertPopup');
    popup.style.display = "block";
}

function closeAlert() {
    var popup = document.getElementById('alertPopup');
    popup.style.display = "none";
}

function deleteAlert() {
    

}