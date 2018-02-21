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
