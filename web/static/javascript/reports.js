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
