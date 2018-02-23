var urlBase = window.location.origin;

// Thanks to http://chapter31.com/2006/12/07/including-js-files-from-within-js-files/
// This function includes all necessary js files for the application
function include(file) {

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include any js files here */

// Tab-specific
include('attendanceSheets.js');
include('attendanceOverview.js');
include('studentProfiles.js');
include('attendanceColumns.js');
include('feedbackForum.js');
include('manageProfile.js');
include('reports.js');

// Not tab-specific
include('general.js');

//include('attendance.js');