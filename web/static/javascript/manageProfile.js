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