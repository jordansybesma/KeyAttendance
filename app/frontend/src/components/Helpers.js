import { join } from 'path';

// Store helper functions that we'll probably re-use here!

function compareActivities(a,b) {
	if (a.ordering < b.ordering)
	  return -1;
	if (a.ordering > b.ordering)
	  return 1;
	return 0;
}

async function downloadAttendanceCSV(startDate, endDate=null) {
	// Get data
	const url = (startDate === endDate || endDate === null) ? `http://127.0.0.1:8000/api/attendance?day=${startDate}` : `http://127.0.0.1:8000/api/attendance?startdate=${startDate}&enddate=${endDate}`;
	const rawAttendanceData = await fetch(url); 
	const attendanceData = await rawAttendanceData.json();
	const rawActivityData = await fetch(`http://127.0.0.1:8000/api/activities`);
	const activityData = await rawActivityData.json();
	activityData.sort(compareActivities)

	// TODO: Error checking? Otherwise this will either break or download an empty file for anything other than a 200 OK from the server.

	// Build activity lookup
	var activities = {}
	for (var i = 0; i < activityData.length; i++) {
		if (activityData[i].is_showing) {
			activities[activityData[i].name] = {'id': activityData[i].activity_id, 'ordering': activityData[i].ordering}
		}
	}

	// Combine attendance data
	var entries = {}
	for (var i = 0; i < attendanceData.length; i++) {
		if (entries[attendanceData[i].student_id] == null) {
			entries[attendanceData[i].student_id] = {}
		}
		entries[attendanceData[i].student_id][attendanceData[i].activity_id] = 'Y'
	}

	// Build spreadsheet
	var sheet = []
	var columns = ['First', 'Last', 'Student Key'] // Build spreadsheet columns
	for (var i = 0; i < activityData.length; i++) {
		columns.push(activityData[i].name)
	}
	const keys = Object.keys(entries)
	for (var i = 0; i < keys.length ; i++) { // Fill in the rows
		var row = []
		for (var j = 0; j < columns.length; j++) {
			switch (columns[j]) {
				case 'First':
					row[j] = 'N/A' // needs student data to match ids to
					break;
				case 'Last':
					row[j] = 'N/A'
					break;
				case 'Student Key':
					row[j] = keys[i]
					break;
				default: // The rest of the columns are activities
					// If this row has a value for this column, put it in the table. Else plop an 'N' in this column.
					if (entries[keys[i]][activities[columns[j]].id] != null) {
						row[j] = entries[keys[i]][activities[columns[j]].id];
					} else {
						row[j] = 'N';
					}
			}
		}
		sheet.push(row);
	}

	console.log(sheet)

	// Put data in a CSV
	var papa = require('papaparse') // why it's named this i have no idea, but it makes more sense than other node.js libraries
	var csvString = papa.unparse({
		fields: columns,
		data: sheet
	});
	console.log(csvString);

	var csv = papa.unparse([
		{
			"Column 1": "foo",
			"Column 2": "bar"
		},
		{
			"Column 1": "abc",
			"Column 2": "def"
		}
	]);

	console.log(csv);

	// Download
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString));
	element.setAttribute('download', `Attendance_${(startDate === endDate || endDate === null) ? startDate : `${startDate}-${endDate}`}.csv`);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

export { downloadAttendanceCSV }