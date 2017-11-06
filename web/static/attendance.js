

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
    var date = year + "-" + month + "-" + day;
    var time = hour + ":" + minute + ":" + seconds
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/addAttendant/");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("firstName=" + first + "&lastName=" + last +"&art=FALSE&madeFood=FALSE&recievedFood=FALSE&leadership=FALSE&exercise=FALSE&mentalHealth=FALSE&volunteering=FALSE&oneOnOne=FALSE&comments=FALSE&date="+ date + "&time=" + time +"&id=");
        

}

// Called when a user clicks submit on the add new student dialogue. checks
//that both values have been entered then adds them to the database
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

function deleteAttendant(date, name) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/deleteAttendant");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send("name=" + name + "&date=" + date);
    displayAttendanceTable(date);
    console.log("got here");
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
        console.log("doing this");
        addRowHelper(myData[i][1], myData[i][2], myData[i][3], myData[i][4], myData[i][5],myData[i][6],myData[i][7],myData[i][8],myData[i][9],myData[i][10])
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
function addRowHelper(first, last, art, madeFood, recievedFood, leadership, exersize, mentalHealth, volunteering, oneOnOne) {
    var table = document.getElementById("Attendance-Table");
    var keywordElement = document.getElementById('keyword').value;
    
    var date = getCurrentDate();
    //document.getElementById("keyword").value = "";
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    
    if (art) {
        str = "<input type=\"checkbox\" checked  onclick=\"selectActivity('" + first + " " + last + "', 'art', '" + date + "')\">";
    } else {
        str = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'art', '" + date + "')\">";
    }
    if (madeFood) {
        console.log("got to madefood");
        str2 = "<input type=\"checkbox\" checked onclick=\"selectActivity('" + first + " " + last + "', 'madeFood', '" + date + "')\">";
        console.log(str2);
    } else {
        str2 = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'madeFood', '" + date + "')\">";
    }
    if (recievedFood) {
        str3 = "<input type=\"checkbox\" checked onclick=\"selectActivity('" + first + " " + last + "', 'recievedFood', '" + date + "')\">";
    } else {
        console.log("got to here");
        str3 = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'recievedFood', '" + date + "')\">";
        console.log(str3);
    }
    if (leadership) {
        str4 = "<input type=\"checkbox\" checked onclick=\"selectActivity('" + first + " " + last + "', 'leadership', '" + date + "')\">";
    } else {
        str4 = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'leadership', '" + date + "')\">";
    }
    if (exersize) {
        str5 = "<input type=\"checkbox\" checked onclick=\"selectActivity('" + first + " " + last + "', 'exersize', '" + date + "')\">";
    } else {
        str5 = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'exersize', '" + date + "')\">";
    }
    if (mentalHealth) {
        str6 = "<input type=\"checkbox\" checked onclick=\"selectActivity('" + first + " " + last + "', 'mentalHealth', '" + date + "')\">";
    } else {
        str6 = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'mentalHealth', '" + date + "')\">";
    }
    if (volunteering) {
        str7 = "<input type=\"checkbox\" checked onclick=\"selectActivity('" + first + " " + last + "', 'volunteering', '" + date + "')\">";
    } else {
        str7 = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'volunteering', '" + date + "')\">";
    }
    if (oneOnOne) {
        str8 = "<input type=\"checkbox\" checked onclick=\"selectActivity('" + first + " " + last + "', 'oneOnOne', '" + date + "')\">";
    } else {
        str8 = " <input type=\"checkbox\" onclick=\"selectActivity('" + first + " " + last + "', 'oneOnOne', '" + date + "')\">";
    }
    str9 = "<button type=\"button\" onclick=\"deleteAttendant('" + date + "', '" + first + " " + last + "')\">Delete<button/>"

    cell1.innerHTML = first + " " + last;
    cell2.innerHTML = str;
    cell3.innerHTML = str2;
    cell4.innerHTML = str3;
    cell5.innerHTML = str4;
    cell6.innerHTML = str5;
    cell7.innerHTML = str6;
    cell8.innerHTML = str7;
    cell9.innerHTML = str8;
    cell10.innerHTML = str9;
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
    var date = getCurrentDate();
    if (optionFound){
    document.getElementById("keyword").value = "";
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    str = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'art', '" + date + "')\">";
    str2 = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'madeFood', '" + date + "')\">";
    str3 = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'recievedFood', '" + date + "')\">";
    str4 = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'leadership', '" + date + "')\">";
    str5 = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'exersize', '" + date + "')\">";
    str6 = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'mentalHealth', '" + date + "')\">";
    str7 = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'volunteering', '" + date + "')\">";
    str8 = "<input type=\"checkbox\" onclick=\"selectActivity('" + keywordElement + "', 'oneOnOne', '" + date + "')\">";

    var entry = document.createElement('button');
    entry.innerHTML = 'onclick=\"deleteAttendant(\"' + date + '\", \"' + keywordElement + '\")\">Delete\"';
    //list.appendChild(entry);
    
    str9 = "<button type=\"button\" onclick=\"deleteAttendant('" + date + "', '" + keywordElement + "')\">Delete </button>"
    cell1.innerHTML = keywordElement;
    cell2.innerHTML = str;
    cell3.innerHTML = str2;
    cell4.innerHTML = str3;
    cell5.innerHTML = str4;
    cell6.innerHTML = str5;
    cell7.innerHTML = str6;
    cell8.innerHTML = str7;
    cell9.innerHTML = str8;
    cell10.innerHTML = str9;
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
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    cell1.innerHTML = "Name";
    cell2.innerHTML = "Art";
    cell3.innerHTML = "Made Food";
    cell4.innerHTML = "Recieved Food";
    cell5.innerHTML = "Leadership";
    cell6.innerHTML = "Exersize";
    cell7.innerHTML = "Mental Health";
    cell8.innerHTML = "Volunteering";
    cell9.innerHTML = "One On One";
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
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    cell1.innerHTML = "Name";
    cell2.innerHTML = "Art";
    cell3.innerHTML = "Made Food";
    cell4.innerHTML = "Recieved Food";
    cell5.innerHTML = "Leadership";
    cell6.innerHTML = "Exersize";
    cell7.innerHTML = "Mental Health";
    cell8.innerHTML = "Volunteering";
    cell9.innerHTML = "One On One";
    var readable = makeDateReadable(table_date);
    var sql = makeDateSQL(readable);
    console.log(sql);
    document.getElementById("attendanceName").innerHTML = "Attendance Sheet " +readable;
    var popUp = document.getElementById('attendanceDiv');
    popUp.style.display = "block";
    var list = document.getElementById('attendanceListDiv');
    list.style.display = "none";
    console.log("got here");
    /*var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://ec2-35-160-216-144.us-west-2.compute.amazonaws.com:5000/tempAdd");
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
    getRequest("/getMasterAttendance", "", masterAttendanceHelper);
}

function masterAttendanceHelper(_, masterData) {
    console.log(masterData);
    var myData = JSON.parse(masterData);
    var table = document.getElementById("masterAttendanceTable");
    table.innerHTML = "";
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);
    var cell10 = row.insertCell(9);
    cell1.innerHTML = "Date";
    cell2.innerHTML = "# Attendees";
    cell3.innerHTML = "# Art";
    cell4.innerHTML = "# Make Food";
    cell5.innerHTML = "# Recieved Food";
    cell6.innerHTML = "# Leadership";
    cell7.innerHTML = "# Exersize";
    cell8.innerHTML = "# Mental Health";
    cell9.innerHTML = "# Volunteering";
    cell10.innerHTML = "# One On One";
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
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        var cell10 = row.insertCell(9);
        cell1.innerHTML = myData[i][0];
        cell2.innerHTML = myData[i][1];
        cell3.innerHTML = myData[i][2];
        cell4.innerHTML = myData[i][3];
        cell5.innerHTML = myData[i][4];
        cell6.innerHTML = myData[i][5];
        cell7.innerHTML = myData[i][6];
        cell8.innerHTML = myData[i][7];
        cell9.innerHTML = myData[i][8];
        cell10.innerHTML = myData[i][9];
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
    console.log(max);
    console.log(change);

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
    console.log(xaxis);
    console.log(yaxis);
    var max = Math.max.apply(Math, yaxis);
    var min = Math.min.apply(Math, yaxis);
    var change = Math.ceil((max - min) / xaxis.lenth);
    change = 10;
    console.log(max);
    console.log(change);

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
    console.log(loginData);
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
    var rows = [];
    rows.push(["things", "things2", "thing3"]);
    rows.push(["things4", "things5", "thing6"]);
    rows.push(["things7", "things8", "thing9"]);
    exportToCsv("testFile", rows);
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
