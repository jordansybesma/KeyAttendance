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