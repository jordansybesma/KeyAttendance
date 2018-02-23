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