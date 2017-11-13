function checkByName(firstName, lastName, rows) {
    var query = lastName + ", " + firstName;
    for (row of rows) {
        if (row.getElementsByClassName('record').length == 0) {
            continue;
        }
        name = row.firstChild.innerHTML;
        if (name == query)  {
            var checkboxContainer = row.getElementsByClassName('record')[1]
            console.log(checkboxContainer)
            if(checkboxContainer.firstElementChild != undefined) {
                checkboxContainer.firstElementChild.checked = true
                return true;
            }
        }
    }
    return false;
}

function getRows() {
    var tables = document.firstChild.lastElementChild.firstElementChild.contentDocument.lastChild.getElementsByTagName('table')
    var rows = tables[tables.length - 1].getElementsByTagName('tr');
    return rows;
}

function checkNames(names) {
    var rows = getRows();
    for (firstLast of names) {
        var first = firstLast[0];
        var last  = firstLast[1];
        if (!checkByName(first, last, rows) {
            console.log("Failed on: " + first + ", " + last ".");
        }
    }
}
