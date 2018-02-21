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