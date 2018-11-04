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
	activityData.sort(compareActivities) // Make sure that our columns are in a consistent order

	// Make sure we got the data we came for.
	if (attendanceData.length === 0 || activityData.length === 0) {
		return
	}

	// Build activity lookup table
	var activities = {}
	for (var i = 0; i < activityData.length; i++) {
		if (activityData[i].is_showing) {
			activities[activityData[i].name] = {'id': activityData[i].activity_id, 'ordering': activityData[i].ordering}
		}
	}

	// Combine attendance items. Need to sort by date and student id.
	var entries = {}
	for (var i = 0; i < attendanceData.length; i++) {
		if (entries[`${attendanceData[i].student_id}${attendanceData[i].date}`] == null) {
			entries[`${attendanceData[i].student_id}${attendanceData[i].date}`] = {'date':attendanceData[i].date, 'id': attendanceData[i].student_id}
		}
		entries[`${attendanceData[i].student_id}${attendanceData[i].date}`][attendanceData[i].activity_id] = 'Y'
	}

	// Build spreadsheet
	var sheet = []
	var columns = ['Date','First', 'Last', 'Student Key']
	for (var i = 0; i < activityData.length; i++) {
		columns.push(activityData[i].name)
	}
	const keys = Object.keys(entries)
	for (var i = 0; i < keys.length ; i++) {
		var row = []
		for (var j = 0; j < columns.length; j++) {
			switch (columns[j]) {
				case 'Date':
					row[j] = entries[keys[i]].date
					break;
				case 'First':
					row[j] = 'N/A' // Needs student data to match ids to
					break;
				case 'Last':
					row[j] = 'N/A'
					break;
				case 'Student Key':
					row[j] = 'N/A' // Needs student keys to be added to the database
					break;
				default:
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

	// Put data in a CSV
	var papa = require('papaparse') // a strangely named but fairly effective CSV library
	var csvString = papa.unparse({
		fields: columns,
		data: sheet
	});

	// Download - it's a lil janky but it works. Thanks, stackoverflow!
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString));
	element.setAttribute('download', `Attendance_${(startDate === endDate || endDate === null) ? startDate : `${startDate}_${endDate}`}.csv`);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

export { downloadAttendanceCSV }