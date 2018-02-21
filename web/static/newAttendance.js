var urlBase = window.location.origin;
// localSite = "http://127.0.0.1:5000";
// scottSite = "https://attendance.unionofyouth.org";

// R
// Returns students who attended for the num-th time between a start and end date using getTimesAttendedHelper.
function getTimesAttended() {
    startDate = document.getElementById("startDateReport").value;
    endDate = document.getElementById("endDateReport").value;
    num = document.getElementById("numTimesAttended").value;
    console.log(startDate);
    console.log(endDate);
    console.log(num);
    addOn = startDate + " " + endDate + " " + num
    console.log("got to times attended");
    console.log(addOn);
    getRequest("/getNumberAttended/" + addOn, "", getTimesAttendedHelper);

}

// R
// Downloads a CSV file of students who attended for num-th time using exportToCSV.
function getTimesAttendedHelper(_, students) {
    var students = JSON.parse(students);
    console.log(students);
    rows = [];
    for (i in students) {
        rows.push(students[i]);
    }
    filename = "whateverForNow.csv";


    exportToCsv(filename, rows);
}


// R
function giveReport() {
    getRequest("/getStudentColumns", "", reportHelper);
}

// R
function reportHelper(_, columns) {
    var studColumns = JSON.parse(columns);
    var columnData = document.getElementById("columns").innerHTML;
    var activities = JSON.parse(columnData);
}

// AS
// Adds a new attendee to current sheet
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

// AS
// Adds a new attendee to the daily attendance table
// Function does not use database info (that's being stored right before displayNewAttendant() is called in addAttendant())
function displayNewAttendant(first, last, time) {
    // Get data about columns
    var columnData = document.getElementById("columns").innerHTML;
    var myColumns = JSON.parse(columnData);

    // Make attendee array correct length
    var colLength = myColumns.length;
    var arrayLength = 3 + colLength;
    var attendantData = new Array(arrayLength);

    // Add data to array
    attendantData[0] = 1
    attendantData[1] = time;
    attendantData[2] = first;
    attendantData[3] = last;

    // atKey column defaulted to true
    attendantData[4] = true;
    var i;
    for (i = 5; i < arrayLength; i++) {
        attendantData[i] = false;
    }
    var table = document.getElementById("Attendance-Table");
    fillRowAttendance(table, myColumns, attendantData);
}

// AS
// Called when a user clicks submit on the add new student dialogue.
// Checks that both values have been entered then adds them to the database.
function addNewStudent() {

    var first = document.getElementById("newStudentFirst").value.trim();
    var last = document.getElementById("newStudentLast").value.trim();

    // Check if input is valid
    if (first === "") {
        alert("Please enter a first name");
        return;
    }
    if (last == "") {
        alert("Please enter a last name");
        return;
    }

    first = capitalizeFirstLetter(first);
    last = capitalizeFirstLetter(last);

    // Adds student to student table
    sendNewStudent(first, last);

    // Adds student to daily attendance table
    addAttendant(first, last);

    // Closes popup
    closeAddNewStudent();
}

// AS
// Capitalizes first letter of string
// Thanks to https://paulund.co.uk/capitalize-first-letter-string-javascript
function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// AS
// Opens the add new student popup
function openAddNewStudent() {
    var popUp = document.getElementById('studentDiv');
    popUp.style.display = "block";
}

// AS
// Called when a user exits the add new student popup window
function closeAddNewStudent() {
    document.getElementById("newStudentFirst").value = "";
    document.getElementById("newStudentLast").value = "";
    var popUp = document.getElementById('studentDiv');
    popUp.style.display = "none";
}

// AS
// Creates a new student and adds them to the table of all students.
function sendNewStudent(firstname, lastname) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/addNewStudent/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + firstname + "&lastName=" + lastname);
}

// AS
// Deletes all instances of attendant at specified date.
// (Ideally would use ID, but hard to do for adding new student to table without an ID).
function deleteAttendant(date, name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/deleteAttendant");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&date=" + date);
    displayAttendanceTable(date);
}

// MISC
// Asynchronously calls the database and returns data to callback, which is a function.
// That callback function's signature looks like "function [name of callback](_, [data]){...}
function getRequest(urlAddon, callbackState, callback) {
    xmlHttpRequest = new XMLHttpRequest();
    var url = urlBase + urlAddon;
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

// MISC
// SQL can't handle strings with spaces.
// This method adds spaces in strings with camel case and replaces underscores with spaces.
// Example: "HelloWorld" and "Hello_World" become "Hello World"
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

// MP
// Displays Manage Profile tab, using showManageProfileHelper to retrieve column data from the database.
function showManageProfile() {
    table = document.getElementById("studentColumnsTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = "Column Name";
    row.insertCell(-1).innerHTML = "Show in Profile";
    row.insertCell(-1).innerHTML = "Show in Quick Add";
    getRequest("/getStudentColumns", "", showManageProfileHelper);
}

// MP
// For each element in data (an aspect of student profile such as gender), display as a row in the table.
function showManageProfileHelper(_, data) {
    var myData = JSON.parse(data);
    var table = document.getElementById("studentColumnsTable");
    for (i in myData) {
        var row = table.insertRow(-1);
        fillRowManageProfile(row, myData[i]);
    }
}

// MP
// Displays aspect of student profile in a row.
// isShowing indicates whether the demographic shows up in student profile.
// isQuick indicates whether the demographic shows up in the add new student popup in attendance sheet.
function fillRowManageProfile(row, rowData) {
    var name = rowData[3];
    var isShowing = rowData[1];
    var isQuick = rowData[2];

    var checkBoxIsShowing = "<input type=\"checkbox\" "
        + (isShowing ? "checked" : "")
        + " onclick=\"selectStudentColumn('" + name + "', 'is_showing')\">";

    var checkBoxIsQuick = "<input type=\"checkbox\" "
        + (isQuick ? "checked" : "")
        + " onclick=\"selectStudentColumn('" + name + "', 'quick_add')\">";

    var deleteButton = "<button type=\"button\" onclick=\"deleteStudentColumn('" + name + "')\">Delete </button>";

    row.insertCell(-1).innerHTML = name;
    row.insertCell(-1).innerHTML = checkBoxIsShowing;
    row.insertCell(-1).innerHTML = checkBoxIsQuick;
    row.insertCell(-1).innerHTML = deleteButton;
}

// MP
// Alters whether an aspect of student profile (like gender) is showing or is available in add new student popup in attendance sheet.
function selectStudentColumn(name, column) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/alterStudentColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&column=" + column);
}

// MP
// Deletes aspect of student profile (like gender) from database.
function deleteStudentColumn(name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/deleteStudentColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name);
    showProfileManage()
}

// AC
// Displays Attendance Columns tab by retrieving data on attendance columns and passing it to showAttendanceManageHelper.
//should be fine
function showAttendanceManage() {
    getRequest("/getAttendanceColumns", "", showAttendanceManageHelper);

}

// AC
// Displays the data of attendance columns in the Attendance Columns tab.
function showAttendanceManageHelper(_, data) {

    // Clear table, display column names
    var table = document.getElementById("attendanceColumnsTable");
    table.innerHTML = "";
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = "Column Name";
    row.insertCell(-1).innerHTML = "Currently in Use";

    // Insert data into table
    var myData = JSON.parse(data);
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

// Ac
// Toggles whether the selected attendance column shows up in the attendance table (when checkbox becomes checked/unchecked).
function selectColumn(name) {
    console.log("got here");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/updateAttendanceColumn");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name);
}

// AC
// Deletes an attendance column.
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

// AC
// Changes order of appearance of attendance columns, displays inputted col one spot earlier.
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

// AC
// Changes order of appearance of attendance columns, displays inputted col one spot later.
//not implemented yet...
function moveAttendanceColumnDown(name) {
    alert("go down down down");
    return false;
}

// MP
// Adds new demographic element to student profiles.
function addStudentColumn() {
    var name = document.getElementById("studentColumnName").value;
    var type = document.getElementById("studentColumnType").value;
    if (isValidColumnName(name) === false) {
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

// AC
// Adds new column to available columns of attendance tables.
function addColumn() {
    var name = document.getElementById("newColumn").value;
    if (isValidColumnName(name) === false) {
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

// MISC
// Checks if input name contains any of the characters in badSubstring. If yes, returns false, else returns true.
function isValidColumnName(name) {
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

// AS
// If enter key is hit, tries to add student to attendance table
// If any other key is hit, suggests students with names similar to input
function handleAddBox(e, curText) {
    var enterKey = 13;
    if (e.keyCode === enterKey) {
        onAddRow();
    }
    else {
        showSuggestions(curText);
    }
}

// AS
// Adds attendee to attendance table if input (from textbox) is a student.
function onAddRow() {
    var input = document.getElementById('keyword').value;
    var optionFound = false;
    var datalist = document.getElementById("suggestedStudents");
    for (var j = 0; j < datalist.options.length; j++) {
        if (input == datalist.options[j].value) {
            optionFound = true;
            break;
        }
    }
    if (optionFound) {

        document.getElementById("keyword").value = "";

        // eventually pass an id or get first and last name from input

        var name = input.split(" ");
        addAttendant(name[0], name[1]);

    } else {
        alert("Please enter an existing student");
    }
}

// SP
// If enter key is hit, tries to open student profile of input
// If any other key is hit, suggests students with names similar to input
function handleProfileBox(e, curText) {
    var enterKey = 13;
    if (e.keyCode === enterKey) {
        showStudentProfile();
    }
    else {
        showSuggestions(curText);
    }
}

// MISC
// Retrieves all students with names similar to curText, passes that data to modifyAutofillList()
function showSuggestions(curText) {
    getRequest("/autofill/" + curText, "", modifyAutofillList);
}

// MISC
// Displays suggested students in a dropdown list from the textbox
function modifyAutofillList(_, studentNames) {
    var list = document.getElementById("suggestedStudents");
    var myData = JSON.parse(studentNames);
    inner = "";
    for (i in myData) {
        inner += "<option>" + myData[i][0] + " " + myData[i][1] + "</option>\n";
    }
    list.innerHTML = inner;
}

// SP
// Displays a student profile by using information stored in the HTML
function showStudentProfile() {

    var profileSpace = document.getElementById('studentProfileText');
    profileSpace.innerHTML = ("");
    var nameSpace = document.getElementById('studentName');
    nameSpace.innerHTML = ("");
    var userInput = document.getElementById('keywordStudentSearch').value;

    var optionFound = false;
    var datalist = document.getElementById("suggestedStudents");
    for (var j = 0; j < datalist.options.length; j++) {
        if (userInput == datalist.options[j].value) {
            optionFound = true;
            break;
        }
    }

    // Open student profile
    if (optionFound) {
        nameSpace.innerHTML += (userInput);
        profileSpace.innerHTML += ("\n");
        getRequest("/getStudentInfo/" + userInput, "", showDemographics);
    }
}

// SP
// Stores student's demographic information and retrieves/passes the active elements of demographics as specified in Manage Profile
function showDemographics(_, data) {
    var parsedData = JSON.parse(data);
    console.log(parsedData);
    document.getElementById("saveStudentData").innerHTML = data;

    getRequest("/getStudentColumns", "", demographicsHelper);

}

// SP
// Displays all active demographics for student.
function demographicsHelper(_, columns) {

    var data = document.getElementById("saveStudentData").innerHTML;
    document.getElementById("saveStudentColumnData").innerHTML = columns;
    var studentInfo = JSON.parse(data);
    var columnInfo = JSON.parse(columns);
    var keywordElement = document.getElementById('keywordStudentSearch').value;
    var div = document.getElementById("demographics");
    div.innerHTML = "<button type=\"button\" onclick=\"openEditProfile()\">Edit Profile</button>";

    for (i in columnInfo) {
        var isShowing = columnInfo[i][1];
        if (isShowing) {
            var colName = columnInfo[i][3];
            var info = studentInfo[0][parseInt(i) + 1];
            var type = columnInfo[i][4];

            displayStudentInfo(colName, info, type);
        }
    }
    getRequest("/getStudentAttendance/" + keywordElement + "/", "", showStudentAttendance);
}

// SP
// Displays the edit profile popup.
function openEditProfile() {
    console.log("gets to here");
    var name = document.getElementById('keywordStudentSearch').value;
    var studentInfo = document.getElementById("saveStudentData").innerHTML;
    var columns = document.getElementById("saveStudentColumnData").innerHTML;
    var keywordElement = document.getElementById('keywordStudentSearch').value;
    var div = document.getElementById("editProfile");
    div.style.display = "block";
    var studentData = JSON.parse(studentInfo);
    var studData = studentData[0];
    var columnData = JSON.parse(columns);
    var updateString = "";
    for (i in columnData) {
        console.log("outer loop");

        var colIsShowing = columnData[i][1];
        if (colIsShowing) {
            console.log("next loop");
            var col = columnData[i][3];
            var form = document.createElement("form");
            var type = columnData[i][4];
            form.setAttribute('onSubmit', 'return false;');
            if ((type == "varchar") || (type == "int")) {
                console.log("got to last loop");
                var value = studData[parseInt(i) + 1];
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
                var value = studData[parseInt(i) + 1];
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
                var str = col + ": "
                if (studData[parseInt(i) + 1]) {
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

// SP
// Closes edit profile popup.
function returnToProfile() {
    var div = document.getElementById("editProfile");
    div.innerHTML = "";
    div.style.display = "none";
    showStudentProfile();
}

// SP
// Updates profile.
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

// SP
// Displays student info such as age and gender.
function displayStudentInfo(colName, info, type) {
    var parent = document.getElementById("demographics");
    var node = document.createElement("p");
    var displayName = makeHeaderReadable(colName);
    console.log(type);
    if (info == null) {
        var text = document.createTextNode(displayName + ": ");
    } else if (type == "varchar") {
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

// SP
// Shows "Recent Attendance" and "Attendance Times" plots on student profile.
function showStudentAttendance(_, data) {

    var parsedData = JSON.parse(data);
    console.log("got to showstudentattendance");
    console.log(parsedData);

    var dateCounts = [0, 0, 0, 0, 0, 0, 0];

    var dateTimes = [[], [], [], [], [], [], []];

    var scatterx = [];
    var scattery = [];

    for (i = 0; i < parsedData.length; i++) {
        if (parsedData[i][1] != null) {


            var dateString = parsedData[i][0];
            console.log(dateString);
            var dateList = dateString.split("-")
            var myDate = new Date(parseInt(dateList[0]), parseInt(dateList[1]), parseInt(dateList[2]), 1, 1, 1, 1);
            var day = myDate.getDay();
            dateCounts[day] = dateCounts[day] + 1;
            console.log(myDate.getDay());

            var time = parsedData[i][1];
            console.log(time);
            var timeList = time.split(":");
            var hour = parseInt(timeList[0]);
            scatterx.push(convertDay(day));
            scattery.push(hour);
        }
    }
    console.log(dateTimes);

    graphStudentAttendance(dateCounts);

    scatterStudentAttendance(scatterx, scattery);

    getRequest("/frequentPeers/" + document.getElementById("studentName").innerHTML, "", showFrequentPeers);
}

// SP
// On student's profile, shows other students who show up at similar times.
//RUSS needs to update this + python
function showFrequentPeers(_, data) {
    var peerSpace = document.getElementById("frequentPeers");
    peerSpace.innerHTML = ("");
    peerSpace.innerHTML += ("Frequently Attends With:<br/><br/>");

    //var nameButton = '<span style="cursor:pointer" onclick=\"showAttendeeProfile(\''+ fullName +'\')\">'+ fullName +'</span>';

    // peerSpace.innerHTML += (data.join())

    var nameString = data.replace(/\[/g, "").replace(/\'/g, "").replace(/\]/g, "");
    var nameList = nameString.split(", ");

    for (var i in nameList) {
        var nameButton = '<span style="cursor:pointer" onclick=\"showAttendeeProfile(\'' + nameList[i] + '\')\">' + nameList[i] + '</span><br/>';
        peerSpace.innerHTML += nameButton;
    }
    getRequest("/getJustID/" + document.getElementById("studentName").innerHTML, "", getStudentPicture);
}

// SP
// Take an id and pass on the path to the image.
function getStudentPicture(_, data) {
  console.log("arrived at get student picture")
  console.log(data);
  // var photoSpace = document.getElementById("studentPhoto");
  // photoSpace.src = "/static/resources/images/No-image-found.jpg";
  getRequest("/getPhoto/" + data, "", placeStudentPicture);
}

function placeStudentPicture(_, data) {
  console.log("arrived at placeStudentPicture")
  var photoSpace = document.getElementById("studentPhoto");
  photoSpace.src = data;
}

// SP
// Converts int to day of the week.
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

// SP
// Shows "Attendance Times" plot on student profile.
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

// SP
// Shows "Recent Attendance" plot on student profile.
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

// ASP
// Basically opens showStudentProfile, inputting the relevant information into the HTML document object.
function showAttendeeProfile(fullName) {
    document.getElementById('keywordStudentSearch').value = fullName;
    document.getElementById("suggestedStudents").innerHTML = "<option>" + fullName + "</option>\n";
    showStudentProfile();

    document.getElementById("studentProfileTab").click();
}

// AS
// Opens new attendance for current day.
function createNewAttendance() {
    var date = getCurrentDate();
    document.getElementById("storeDate").innerHTML = date;
    var readableTitle = makeDateReadable(date);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet: " + readableTitle;

    fillAttendanceTable();

    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
}

// AS
// Grabs the data for an attendance table and fills the table, using fillAttendanceTableHelper
function fillAttendanceTable() {
    getRequest("/getAttendanceColumns", "", fillAttendanceTableHelper);
}

// AS
// Called through a getRequest from fillAttendanceTable.
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

// AS
// Iterates through the attendants on a given day and populates the attendance table with them.
// Called through a getRequest in fillAttendanceTableHelper.
function fillAttendance(_, attendance) {
    var myData = JSON.parse(attendance);
    var columnData = document.getElementById("columns").innerHTML;
    var myColumns = JSON.parse(columnData);
    var table = document.getElementById("Attendance-Table");
    for (i in myData) {
        fillRowAttendance(table, myColumns, myData[i]);
    }
}

// AS
// Inserts a row into the attendance table with name, timestamp, checkboxes, and delete button.
// The name links to a student profile.
function fillRowAttendance(table, columns, attendeeEntry) {
    var date = document.getElementById("storeDate").innerHTML;
    document.getElementById("keyword").value = "";

    var row = table.insertRow(1);

    var fullName = attendeeEntry[2] + " " + attendeeEntry[3];
    var nameButton = '<span style="cursor:pointer" onclick=\"showAttendeeProfile(\'' + fullName + '\')\">' + fullName + '</span>';
    var time = attendeeEntry[1];
    row.insertCell(-1).innerHTML = time + "  -  " + nameButton;

    for (i in columns) {
        var colActive = columns[i][1];
        if (colActive == true) {
            var checkbox = getCheckboxString(i, attendeeEntry, columns, date, fullName);
            row.insertCell(-1).innerHTML = checkbox;
        }
    }

    var deleteButton = "<button type=\"button\" onclick=\"deleteAttendant('" + date + "', '" + fullName + "')\">Delete </button>";
    row.insertCell(-1).innerHTML = deleteButton;
}

// AS
// Helper function for fillRowAttendance.
// Returns a checkbox to be added to the row with the correct status (checked or unchecked).
function getCheckboxString(i, attendeeEntry, columns, date, fullName) {

    // The offset of 3 is dependent on the first 3 elements of attendeeEntry being non-activities (firstName, lastName, time)
    var index = parseInt(i) + 4;

    var hasDoneActivity = attendeeEntry[index];
    var col = columns[i][2];

    var box = "<input type=\"checkbox\" "
        + (hasDoneActivity ? "checked" : "")
        + " onclick=\"selectActivity('" + fullName + "','" + col + "', '" + date + "')\">";

    return box;
}

// AS
// Toggles whether a student has done the specified activity (when checkbox becomes checked/unchecked).
function selectActivity(name, column, date) {
    console.log("selecting activity");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", urlBase + "/selectActivity");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&column=" + column + "&date=" + date);
}

// AS
// Refreshes current attendance table.
function refreshAttendanceTable() {
    var date = document.getElementById("storeDate").innerHTML;
    displayAttendanceTable(date);
}

// AS
// Shows attendance table at specified date table_date.
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

// AS
// Retrieves data on attendance tables to display using createListofAttendanceDates.
function returnAttendance() {
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "none";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "block";
    var list = document.getElementById("attendanceList");
    list.innerHTML = '';
    getRequest("/getDates", "", createListOfAttendanceDates);
}

// AS
// Displays the dates of the ten latest attendance tables as links to those tables.
function createListOfAttendanceDates(_, dates) {
    var myData = JSON.parse(dates);
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

// AO
// Ultimately displays master table with aggregate data.
// Retrieves data on attendance columns to display header for master table.
// Passes data to makeMasterTableHeader, which in turn calls masterAttendanceHelper to populate table.
function displayMasterAttendance() {
    var table = document.getElementById("masterAttendanceTable");
    table.innerHTML = "";
    getRequest("/getAttendanceColumns", "", makeMasterTableHeader);
}

// AO
// Displays header for master table, retrieves and passes data on masterAttendance to masterAttendanceHelper.
function makeMasterTableHeader(_, columns) {
    table = document.getElementById("masterAttendanceTable");
    var row = table.insertRow(-1);
    document.getElementById("columnData").innerHTML = columns;
    row.insertCell(-1).innerHTML = "Date";
    row.insertCell(-1).innerHTML = "Attendees";
    var myData = JSON.parse(columns);
    for (i in myData) {
        var colIsShowing = myData[i][1];
        var colName = myData[i][2];
        if (colIsShowing) {
            var newHeader = makeHeaderReadable(colName);
            row.insertCell(-1).innerHTML = newHeader;
        }
    }
    getRequest("/getMasterAttendance", "", masterAttendanceHelper);
}

// AO
// Populates master attendance table with data.
function masterAttendanceHelper(_, masterData) {

    var myData = JSON.parse(masterData);
    var columns = document.getElementById("columnData").innerHTML;
    columnData = JSON.parse(columns);

    for (i in myData) {
        var row = table.insertRow(-1);
        for (j in myData[i]) {
            row.insertCell(-1).innerHTML = myData[i][j];
        }
    }
}

// MISC
// Formats date for humans.
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

// AS/MISC?
// Formats date for SQL.
function makeDateSQL(date) {
    var month = date.substr(0, 2);
    var day = date.substr(3, 4);
    var year = date.substr(6, 9);
    var newDate = year + "-" + month + "-" + day.substr(0, 2);
    return newDate;
}

// MISC
// Retrieves current date using the Date object.
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

// AS
// Displays the attendance table of the date from date picker (in index.html).
function getDate() {
    var date = document.getElementById("datePicker").value;
    console.log(date);
    displayAttendanceTable(date);
    return false;
}

// AS
// Using createFileHelper and exportToCSV, downloads a csv file of attendance table at specified date in storeDate.
function createFile() {
    var date = document.getElementById("storeDate").innerHTML;
    getRequest("/getAttendance/" + date, "", createFileHelper);
//    var rows = [];
//    rows.push(["things", "things2", "thing3"]);
//    rows.push(["things4", "things5", "thing6"]);
//    rows.push(["things7", "things8", "thing9"]);
//    exportToCsv("testFile.csv", rows);
}

// AS
// Formats attendance table data into a file.
function createFileHelper(_, attendance) {
    var rows = [];
    var columns = JSON.parse(document.getElementById("columns").innerHTML);
    console.log(columns);
    var nameRow = [];
    nameRow.push("Time", "First", "Last");

    for (i in columns) {
        console.log(columns[i][1]);
        var colIsShowing = columns[i][1];
        if (colIsShowing) {
            console.log(columns[i][2]);
            nameRow.push(columns[i][2]);
        }
    }
    rows.push(nameRow);
    console.log(rows);
    var myData = JSON.parse(attendance);
    for (i in myData) {
        newRow = []
        for (j in myData[i]) {
            if (j > 0) {
                if (myData[i][j] === parseInt(myData[i][j], 10)) {
                    newRow.push("Y");
                }
                else if (myData[i][j] == null) {
                    newRow.push("N");
                }
                else {
                    newRow.push(myData[i][j]);
                }
            }
        }
        rows.push(newRow);
    }
    console.log(rows);
    var date = document.getElementById("storeDate").innerHTML;
    var filename = "Attendance_" + date + ".csv";

    exportToCsv(filename, rows);

}

// AO
// Downloads all attendance tables by passing master attendance data to downloadAllMasterHelper.
function downloadAllMaster() {
    getRequest("/getMasterAttendance", "", downloadAllMasterHelper);
    return false;
}

// AO
// Downloads all attendance tables between 2 specified dates by passing attendance data to downloadAllMasterHelper.
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

// AO
// Processes data into a coherent set of rows to be exported into a CSV file.
function downloadAllMasterHelper(_, data) {
    var rows = [];
    columns = JSON.parse(document.getElementById("columns").innerHTML);
    console.log(columns);
    var nameRow = [];
    nameRow.push("Date", "#Attended")
    for (i in columns) {
        console.log(columns[i][1]);
        if (columns[i][1]) {
            console.log(columns[i][2]);
            nameRow.push(columns[i][2]);
        }
    }
    rows.push(nameRow);
    console.log(rows);
    var myData = JSON.parse(data);
    for (i in myData) {
        rows.push(myData[i]);
    }
    var date = getCurrentDate();
    var filename = "Master_Attendance_" + date + ".csv";
    exportToCsv(filename, rows);
    return false;
}

// MISC
// Converts rows into CSV file and downloads that file.
// Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
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

// AS
// Fills the code text box under the table in an attendance sheet.
function fillTextBox() {
    getRequest("/static/cityspan.js", "", textBoxCallback)
}

// AS
// Callback for fillTextBox.
function textBoxCallback(_, js) {
    document.getElementById("codeTextBox").innerHTML = js;
}
