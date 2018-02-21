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

// AS/MISC?
// Formats date for SQL.
function makeDateSQL(date) {
    var month = date.substr(0, 2);
    var day = date.substr(3, 4);
    var year = date.substr(6, 9);
    var newDate = year + "-" + month + "-" + day.substr(0, 2);
    return newDate;
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
