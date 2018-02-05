var local, base, urlBase;
local = "http://127.0.0.1:5000";
base = "https://attendance.unionofyouth.org";
urlBase = base;

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

    var time = hour + ":" + minute + ":" + seconds;
    var date = document.getElementById("storeDate").innerHTML;
    xmlhttp.open("POST", urlBase + "/addAttendant/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + first + "&lastName=" + last + "&date=" + date + "&time=" + time + "&id=");

    displayNewAttendant(first, last, time);


}

// Adds a new attendant to the daily attendance table
function displayNewAttendant(first, last, time) {
    // Get data about columns
    //refreshAttendanceTable()
    var columnData = document.getElementById("columns").innerHTML;
    var myColumns = JSON.parse(columnData);

    // Make attendee array correct length
    var colLength = myColumns.length;
    var arrayLength = 3 + colLength;
    var attendantData = new Array(arrayLength);

    // Add data to array
    attendantData[0] = first;
    attendantData[1] = last;
    attendantData[2] = time;
    attendantData[3] = true;
    var i;
    for (i = 4; i < arrayLength; i++) {
        attendantData[i] = false;
    }

    displayRow(myColumns, attendantData);

}

// Called when a user clicks submit on the add new student dialogue. checks
//that both values have been entered then adds them to the database
function addNewStudent() {

    //    onAddRow()(@(*#&*

    var first = document.getElementById("newStudentFirst").value;
    var firstChar = first[0];
    firstChar = firstChar.toUpperCase();
    first = firstChar + first.slice(1);


    var last = document.getElementById("newStudentLast").value;
    var lastChar = last[0];
    lastChar = lastChar.toUpperCase();
    last = lastChar + last.slice(1);

    if (first.trim() === "") {
        alert("Please enter a first name");
        return;
    }
    if (last.trim() == "") {
        alert("Please enter a last name");
        return;
    }

    // Adds student to student table
    sendNewStudent(first.trim(), last.trim());

    // Adds student to daily attendance table
    addAttendant(first.trim(), last.trim());

    document.getElementById("newStudentFirst").value = "";
    document.getElementById("newStudentLast").value = "";
    closeAddStudent();
    //var response = addAttendant(data);
}


function sendRequest(isPost, data, header, value, urlAddOn) {
    var xhr = new XMLHttpRequest();
    xhr.open(isPost ? "POST" : "GET", urlAddOn, true);
    // xhr.setRequestHeader(header, value);
    // var data = JSON.stringify({"text": theirText});
    xhr.send(data);
    return xhr.responseText;
}

function sendNewStudent(firstname, lastname) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/addNewStudent/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + firstname + "&lastName=" + lastname);
}

// use ID (hard to do for adding new student to table without an ID)
function deleteAttendant(date, name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/deleteAttendant");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&date=" + date);
    displayAttendanceTable(date);
}

function getRequest(urlAddon, callbackState, callback) {
    xmlHttpRequest = new XMLHttpRequest();
    var url = window.location.origin + urlAddon;
    xmlHttpRequest.open('get', url);

    xmlHttpRequest.onreadystatechange = function () {
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            if (callbackState == null) {
                callback(xmlHttpRequest.responseText);
            } else {
                callback(callbackState, xmlHttpRequest.responseText);
            }
        }
    };
    xmlHttpRequest.send(null);
}

function sendSubmitForm() {
    var theirText = document.getElementById("someRandoText").value;

}
function fillAttendance(_, attendance) {
    var myData = JSON.parse(attendance);
    var columnData = document.getElementById("columns").innerHTML;
    var myColumns = JSON.parse(columnData);
    console.log("MYDATA: " + myData);
    for (i in myData) {
        console.log("i: " + i);
        displayRow(myColumns, myData[i]);
    }
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

// Inserts a row into the attendance table with name, timestamp, checkboxes, and delete button.
// The name links to a student profile.
function displayRow(columns, entry) {
    var table = document.getElementById("Attendance-Table");
    var date = document.getElementById("storeDate").innerHTML;
    document.getElementById("keyword").value = "";

    console.log("entry: " + entry);
    
    var row = table.insertRow(1);
    var fullName = entry[0] + " " + entry[1];
    var nameButton = '<span style="cursor:pointer" onclick=\"showAttendeeProfile(\'' + fullName + '\')\">' + fullName + '</span>';
    var time = entry[2];
    row.insertCell(-1).innerHTML = time + "  -  " + nameButton;
    for (i in columns) {
        var colActive = columns[i][1];
        if (colActive == true) {
            addCheckbox(i, entry, columns, date, row, fullName);
        }
    }

    var deleteButton = "<button type=\"button\" onclick=\"deleteAttendant('" + date + "', '" + fullName + "')\">Delete </button>";
    row.insertCell(-1).innerHTML = deleteButton;
}

// Helper function for displayRow.
// Adds a checkbox to the row with the correct status (checked or unchecked).
function addCheckbox(i, entry, columns, date, row, fullName) {
    var index = parseInt(i) + 3;
    var hasDoneActivity = entry[index];
    var col = columns[i][2];
    
    var box = "<input type=\"checkbox\" " 
        + (entry[index] ? "checked" : "") 
        + " onclick=\"selectActivity('" + fullName + "','" + col + "', '" + date + "')\">";
    
    row.insertCell(-1).innerHTML = box;
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
        var row = table.insertRow(-1);
        fillRow(row, myData[i]);
    }
}

function fillRow(row, rowData) {
    var name = rowData[2];
    var isShowing = rowData[0];
    var isQuick = rowData[1];

    var checkBoxIsShowing = "<input type=\"checkbox\" "
        + (isShowing ? "checked" : "")
        + " onclick=\"selectStudentColumn('" + name + "', 'isShowing')\">";

    var checkBoxIsQuick = "<input type=\"checkbox\" "
        + (isQuick ? "checked" : "")
        + " onclick=\"selectStudentColumn('" + name + "', 'isQuick')\">";

    var deleteButton = "<button type=\"button\" onclick=\"deleteStudentColumn('" + name + "')\">Delete </button>";

    row.insertCell(-1).innerHTML = name;
    row.insertCell(-1).innerHTML = checkBoxIsShowing;
    row.insertCell(-1).innerHTML = checkBoxIsQuick;
    row.insertCell(-1).innerHTML = deleteButton;
}

function selectStudentColumn(name, column) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/alterStudentColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&column=" + column);
}

function deleteStudentColumn(name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/deleteStudentColumn");
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

function showAttendanceManageHelper(_, data) {
    var myData = JSON.parse(data);
    var table = document.getElementById("attendanceColumnsTable");
    for (i in myData) {
        console.log(myData[i]);
        
        var name = myData[i][2];
        var checkBox = "<input type=\"checkbox\" "
            + (myData[i][1] ? "checked" : "")
            + " onclick=\"selectColumn('" + name + "')\">";
        var deleteButton = "<button type=\"button\" onclick=\"deleteColumn('" + name + "')\">Delete</button>";
        var upButton = "<button type=\"button\" onclick=\"moveAttendanceColumnUp('" + name + "')\">Move Up</button>";
        //var downButton = "<button type=\"button\" onclick=\"moveAttendanceColumnDown('" + name + "')\">Move Down</button>";
        
        var row = table.insertRow(-1);
        row.insertCell(-1).innerHTML = name;
        row.insertCell(-1).innerHTML = checkBox;
        row.insertCell(-1).innerHTML = deleteButton;
        row.insertCell(-1).innerHTML = upButton;
        //row.insertCell(-1).innerHTML = downButton;
    }
}

function moveAttendanceColumnUp(name) {
    console.log("move column up");
    var xmlhttp = new XMLHttpRequest();
    console.log(urlBase);
    xmlhttp.open("POST", urlBase + "/moveAttendanceColumnUp");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name);
    showAttendanceManage();
    //alert("you got it up");
    return false;
}

function moveAttendanceColumnDown(name) {
    alert("go down down down");
    return false;
}

function deleteColumn(name) {
    if (name == "Key" || name == "key") {
        alert("You cannot delete the key column");
        return false;
    }
    else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", urlBase + "/deleteAttendanceColumn");
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xmlhttp.send("name=" + name);
        showAttendanceManage()
    }
    
}
function selectColumn(name) {
    console.log("got here");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/updateAttendanceColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name);
}
function addStudentColumn() {
    var name = document.getElementById("studentColumnName").value;
    var type = document.getElementById("studentColumnType").value;
    var badSubstring = " .,<>/?':;\|]}[{=+-_)(*&^%$#@!~`";
    if (stop(name) === false) {
        alert("Please enter a valid column name")
        document.getElementById("studentColumnName").value = "";
        return;
    }

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
    document.getElementById("studentColumnName").value = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/addStudentColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&type=" + type + "&definedOptions=");
    showProfileManage()
}

function findOverlap(a, b) {
    if (b.length === 0) {
        return "";
    }

    if (a.endsWith(b)) {
        return b;
    }

    if (a.indexOf(b) >= 0) {
        return b;
    }

    return findOverlap(a, b.substring(0, b.length - 1));
}

function stop(name) {
    //alert("got here");
    var badSubstring = " .,<>/?':;|]}[{=+-_)(*&^%$#@!~`";
    for (var i = 0; i < badSubstring.length; i++) {
        if (name.indexOf(badSubstring.charAt(i)) != -1) {
            return false;
        }

    }
    if (name.indexOf("\\") != -1) {
        return false;
    }
    
    return true;
}

function addColumn() {
    var name = document.getElementById("newColumn").value;
    var badSubstring = " .,<>/?':;\|]}[{=+-_)(*&^%$#@!~`";
    //overlap = findOverlap(name, badSubstring);
    if (stop(name) === false) {
        alert("Please enter a valid column name")
        document.getElementById("newColumn").value = "";
        return;
    }

    if (name == "") {
        alert("Please enter a name")
        return;
    }
    document.getElementById("newColumn").value = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/addAttendanceColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&type=boolean");


    var checkBox = "<input type=\"checkbox\" "
            + "checked"
            + " onclick=\"selectColumn('" + name + "')\">";
    var deleteButton = "<button type=\"button\" onclick=\"deleteColumn('" + name + "')\">Delete</button>";

    var table = document.getElementById("attendanceColumnsTable");
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = name;
    row.insertCell(-1).innerHTML = checkBox;
    row.insertCell(-1).innerHTML = deleteButton;
}

function modifyAutofillList(_, studentNames) {
    var list = document.getElementById("suggestedStudents");
    var myData = JSON.parse(studentNames);
    inner = "";
    for (i in myData) {
        inner += "<option>" + myData[i][0] + " " + myData[i][1] + "</option>\n";
    }
    list.innerHTML = inner;
}

// Obsolete?
function showProfile(_, studentInfo) {

    document.getElementById("studentProfileText").innerHTML += ("ID Number: ")

    document.getElementById("studentProfileText").innerHTML += JSON.stringify(studentInfo)


}


function handleAddBox(e, curText) {
    if (e.keyCode === 13) {
        onAddRow();
    }
    else {
        showSuggestions(curText);
    }
}

function handleProfileBox(e, curText) {
    if (e.keyCode === 13) {
        showStudentProfile();
    }
    else {
        showSuggestions(curText);
    }
}

function showSuggestions(curText) {
    getRequest("/autofill/" + curText, "", modifyAutofillList);
}

// Obsolete?
function checkBox(checkbox, keyword) {
    var str = "got to checkBox " + checkbox.value + " " + keyword;
}

function openAddStudent() {
    var popUp = document.getElementById('studentDiv');
    popUp.style.display = "block";
}

function showStudentProfile() {
    console.log("got here");

    var profileSpace = document.getElementById('studentProfileText');
    profileSpace.innerHTML = ("");
    var nameSpace = document.getElementById('studentName');
    nameSpace.innerHTML = ("");
    console.log("got here 2");
    var keywordElement = document.getElementById('keywordStudentSearch').value;

    var optionFound = false;
    datalist = document.getElementById("suggestedStudents");
    for (var j = 0; j < datalist.options.length; j++) {
        if (keywordElement == datalist.options[j].value) {
            optionFound = true;
            break;
        }
    }
    if (optionFound) {
        console.log("got here 3");
        nameSpace.innerHTML += (keywordElement);
        profileSpace.innerHTML += ("\n");
        console.log(keywordElement);
        getRequest("/getStudentInfo/" + keywordElement, "", showDemographics);
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
    var updateString = "";
    for (i in columnData) {
        console.log("outer loop");
        
        if (columnData[i][0]) {
            console.log("next loop");
            var form = document.createElement("form");
            var type = columnData[i][3];
            form.setAttribute('onSubmit', 'return false;');
            if ((type == "varchar(500)") || (type == "int")) {
                console.log("got to last loop");
                var col = columnData[i][2];
                var value = studData[parseInt(i) + 3];
                if (value == null) {
                    value = "";
                }
                var str = col + ":<br> <input id='" + col + "colid' type='text' value='" + value + "' /> <br>";
                //str = str + " <input type='submit' value='Save' onclick=\"updateProfile('" + keywordElement + "','" + col;
                //str = str + "','" + col + "colid', '" + columnData[i][3] + "')\"/><br><br>"
                console.log(str);
                updateString = updateString + "updateProfile('" + keywordElement + "','" + col + "','" + col + "colid', '" + columnData[i][3] + "'); "
                console.log(updateString);
                form.innerHTML = str;
                div.appendChild(form);
            } else if (type == "date") {
                var col = columnData[i][2];
                var value = studData[parseInt(i) + 3];
                if (value == null) {
                    value = "";
                }
                var str = col + ":<br> <input id='" + col + "colid' type='date' value='" + value + "'/> <br>";
                //str = str + " <input type='submit' value='Save' onclick=\"updateProfile('" + keywordElement + "','" + col;
                //str = str + "','" + col + "colid', '" + columnData[i][3] + "')\"/><br><br>"
                console.log(str);
                updateString = updateString + "updateProfile('" + keywordElement + "','" + col + "','" + col + "colid', '" + columnData[i][3] + "'); "
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
                updateString = updateString + "updateProfile('" + keywordElement + "','" + col + "','" + col + "colid', '" + columnData[i][3] + "'); "
                console.log(str);
                form.innerHTML = str;
                div.appendChild(form);
            }

        }

    }
    var returnButton = document.createElement('button');
    returnButton.setAttribute('name', 'Return to Profile');
    console.log(updateString);
    returnButton.setAttribute('onclick', updateString + 'returnToProfile();');
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
    xmlhttp.open("POST", urlBase + "/updateStudentInfo/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&value=" + value + "&column=" + col);
}

function displayStudentInfo(catName, info, type) {
    var parent = document.getElementById("demographics");
    var node = document.createElement("p");
    var displayName = makeHeaderReadable(catName);
    console.log(type);
    if (info == null) {
        var text = document.createTextNode(displayName + ": ");
    } else if (type == "varchar(500)") {
        console.log("var");
        var text = document.createTextNode(displayName + ": " + info);
    } else if (type == "int") {
        console.log("int");
        var text = document.createTextNode(displayName + ": " + info.toString());
    } else if (type == "date") {
        console.log("date");
        var text = document.createTextNode(displayName + ": " + makeDateReadable(info));
    } else if (type == "boolean") {
        console.log("bool");
        if (info) {
            var text = document.createTextNode(displayName + ": yes");
        } else {
            var text = document.createTextNode(displayName + ": no");
        }
    }
    node.appendChild(text);
    parent.appendChild(node);
}

function showStudentAttendance(_, data) {

    var parsedData = JSON.parse(data);

    console.log(parsedData);
    //
    // var x = [];

    var dateCounts = [0, 0, 0, 0, 0, 0, 0];

    var dateTimes = [[], [], [], [], [], [], []];

    var scatterx = [];
    var scattery = [];

    for (i = 0; i < parsedData.length; i++) {
        var dateString = parsedData[i][2];
        console.log(dateString);
        var dateList = dateString.split("-")
        var myDate = new Date(parseInt(dateList[0]), parseInt(dateList[1]), parseInt(dateList[2]), 1, 1, 1, 1);
        var day = myDate.getDay();
        dateCounts[day] = dateCounts[day] + 1;
        console.log(myDate.getDay());
        
        var time = parsedData[i][3];
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


    //fillProfileTable(parsedData);

    getRequest("/frequentPeers/" + document.getElementById("studentName").innerHTML, "", showFrequentPeers);
}

function showFrequentPeers(_, data) {
    var peerSpace = document.getElementById("frequentPeers");
    peerSpace.innerHTML = (" ");
    peerSpace.innerHTML += ("Frequently Attends With: \n \n");

    //var nameButton = '<span style="cursor:pointer" onclick=\"showAttendeeProfile(\''+ fullName +'\')\">'+ fullName +'</span>';

    // peerSpace.innerHTML += (data.join())

    var nameString = data.replace(/\[/g, "").replace(/\'/g, "").replace(/\]/g, "");

    var nameList = nameString.split(", ");

    var friendsList = []

    console.log("Hello")
    console.log(nameList)
    console.log("Goodbye")

    for (var i in nameList) {
        var nameButton = '<span style="cursor:pointer" onclick=\"showAttendeeProfile(\'' + nameList[i] + '\')\">' + nameList[i] + '</span>';
        friendsList.push(nameButton)
    }

    peerSpace.innerHTML += friendsList;
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
        x: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        y: [0, 0, 0, 0, 0, 0, 0],
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
        marker: { opacity: 0.5, size: 14 }
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

// FIX HARDCODED STUFF
function fillProfileTable(attendance) {
    
//    var allCols = document.getElementById("columns").innerHTML;
//    console.log("allcols: " + allCols);
//    allCols = document.getElementById("saveColumnData").innerHTML;
//    console.log("how'd u like me now? " + allCols);

    var table = document.getElementById("profileAttendanceTable");
    table.innerHTML = ""
    var fields = ['ID', 'First', 'Last', 'Art', 'Made Food', 'Recieved Food', 'Leadership', 'Exersize', 'Mental Health', 'Volunteering', 'One On One', 'Comments', 'Date', 'Time'];
    row = table.insertRow(-1);
    for (header of fields) {
        row.insertCell(-1).innerHTML = header;
    }

    for (i in attendance) {
        currRow = table.insertRow(-1);
        currLine = attendance[i];
        for (i in currLine) {
            currRow.insertCell(-1).innerHTML = currLine[i];
        }
    }
}

function selectActivity(name, column, date) {
    console.log("selecting activity");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/selectActivity");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&column=" + column + "&date=" + date);
}

function onAddRow() {
    var keywordElement = document.getElementById('keyword').value;
    var optionFound = false;
    var datalist = document.getElementById("suggestedStudents");
    for (var j = 0; j < datalist.options.length; j++) {
        if (keywordElement == datalist.options[j].value) {
            optionFound = true;
            break;
        }
    }
    //var date = getCurrentDate();
    if (optionFound) {

        document.getElementById("keyword").value = "";

        // eventually pass an id or get first and last name from keywordElement

        var name = keywordElement.split(" ");
        addAttendant(name[0], name[1]);

    } else {
        alert("Please enter an existing student");
    }
    //var str = "How are you doing today?";

}

function showAttendeeProfile(fullName) {
    document.getElementById('keywordStudentSearch').value = fullName;
    document.getElementById("suggestedStudents").innerHTML = "<option>" + fullName + "</option>\n";
    showStudentProfile();

    document.getElementById("studentProfileTab").click();
}

function createNewAttendance() {
    var date = getCurrentDate();
    document.getElementById("storeDate").innerHTML = date;
    var readable = makeDateReadable(date);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet: " + readable;
    
    fillAttendanceTable();
    
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
}

function fillAttendanceTable() {
    getRequest("/getAttendanceColumns", "", fillAttendanceTableHelper);
}

function fillAttendanceTableHelper(_, data) {
    console.log("got to helper");
    document.getElementById("columns").innerHTML = data;
    var table = document.getElementById("Attendance-Table");
    
    
    table.innerHTML = "";
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = "Name";
    var myData = JSON.parse(data);
    for (i in myData) {
        if (myData[i][1]) {
            var newHeader = makeHeaderReadable(myData[i][2]);
            row.insertCell(-1).innerHTML = newHeader;
        }
    }
    
    // Fill attendance table with recorded attendants
    var table_date = document.getElementById("storeDate").innerHTML;
    getRequest("/getAttendance/" + table_date, "", fillAttendance);
}

function refreshAttendanceTable() {
    var date = document.getElementById("storeDate").innerHTML;
    displayAttendanceTable(date);
}

function displayAttendanceTable(table_date) {
    document.getElementById("storeDate").innerHTML = table_date;
    
    fillAttendanceTable();
    
    var readable = makeDateReadable(table_date);
    var sql = makeDateSQL(readable);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet: " + readable;
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
    
    return false;
}

function createListOfAttendanceDates(_, dates) {
    var myData = JSON.parse(dates);
    console.log(myData);
    var list = document.getElementById("attendanceList");
    list.innerHTML = "";
    for (i in myData) {
        var date = myData[i][0];
        if (date != null) {
            var readable = makeDateReadable(date);
            var entry = document.createElement('li');
            entry.innerHTML = '<span style="cursor:pointer" onclick="displayAttendanceTable(\'' + date + '\')">' + readable + '</span>';
            list.appendChild(entry);
        }
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
    console.log(columnData);

    for (i in myData) {
        var row = table.insertRow(-1);
        row.insertCell(-1).innerHTML = myData[i][0];
        row.insertCell(-1).innerHTML = myData[i][1];
        for (j in columnData) {

            if (columnData[j][1] == true) {
                var val = myData[i][parseInt(j) + 2];
                if (val == null) {
                    val = 0;
                }
                row.insertCell(-1).innerHTML = val;
            }
        }
    }

    //masterDataPlot(xaxis, yaxis);
    //activitiesPlot(xaxis, yaxisArt, yaxisMadeFood, yaxisRecievedFood, yaxisLeadership, yaxisExersize, yaxisMentalHealth, yaxisVolunteering, yaxisOneOnOne);


}

function activitiesPlot(xaxis, yaxisArt, yaxisMadeFood, yaxisRecievedFood, yaxisLeadership, yaxisExersize, yaxisMentalHealth, yaxisVolunteering, yaxisOneOnOne) {
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
        layout_autorange_after: false

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
    var monthStr = date.substr(5, 7).substr(0, 2);
    var monthInt = parseInt(monthStr);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[monthInt - 1];

    var day = date.substr(8, 10);
    var year = date.substr(0, 4);

    var newDate = month + " " + day + ", " + year;
    var newDateDashes = monthStr + "/" + day + "/" + year;
    return newDateDashes;
}

function makeDateSQL(date) {
    var month = date.substr(0, 2);
    var day = date.substr(3, 4);
    var year = date.substr(6, 9);
    var newDate = year + "-" + month + "-" + day.substr(0, 2);
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

//used with date picker in index.html
function getDate() {
    var date = document.getElementById("datePicker").value;
    console.log(date);
    displayAttendanceTable(date);
    return false;
}

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
    for (i in myData) {
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
    if (start == "") {
        alert("Please enter a start date");
        return false;
    }
    if (end == "") {
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
    xmlhttp.open("POST", urlBase + "/sendFeedback");
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

// fills the code text box under the table in an attendance sheet
function fillTextBox() {
    getRequest("/static/cityspan.js", "", textBoxCallback)
}

// callback for fillTextBox
function textBoxCallback(_, js) {
    document.getElementById("codeTextBox").innerHTML = js;
}