function checkByName(firstName, lastName, rows) {
    var query = lastName + ", " + firstName;
    for (row of rows) {
        if (row.getElementsByClassName('record').length == 0) {
            continue;
        }
        name = row.firstChild.innerHTML;
        if (name == query)  {
            console.log("HOLY SHIT");
            var checkboxContainer = row.getElementsByClassName('record')[1]
            console.log(checkboxContainer)
            if(checkboxContainer.firstElementChild != undefined) {
                checkboxContainer.firstElementChild.checked = true
            }
        }
    }
}

var tables = document.firstChild.lastElementChild.firstElementChild.contentDocument.lastChild.getElementsByTagName('table')
var rows = tables[tables.length - 1].getElementsByTagName('tr');
