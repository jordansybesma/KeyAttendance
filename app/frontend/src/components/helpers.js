//Helper functions for date selection in data visualizations

// Returns date obj for the date that is "days ago" number of days ago
//from today's date
//. E.g. if daysAgo equals 3 the date string will be the date 
// three days ago. If daysAgo = 0 the string is today's date.
export function getEarlierDate(daysAgo) {
    if (daysAgo < 0) {
      console.error("Expected daysAgo to be a value >= 0 but recieved ", daysAgo);
      daysAgo = -daysAgo;
    }
    var earlierDate = new Date();
    earlierDate.setDate(earlierDate.getDate() - daysAgo);
    return earlierDate;
}

//Returns date obj for previous sunday from given date
//(or the date itself if the date falls on a sunday)
export function getPrevSunday(date) {
    var offset = date.getDay();
    date.setDate(date.getDate() - offset);
    return date;
}

//Returns date obj for following saturday from given date
//(or the date itself if the date falls on a saturday)
export function getNextSaturday(date) {
    var offset = 6 - date.getDay();
    date.setDate(date.getDate() + offset);
    return date;
}

// Creates a date string of the form yyyy-mm-dd for the date
export function dateToString(date){
    var dateString = date.getFullYear().toString() + "-" + (date.getMonth()+1).toString() + "-" + date.getDate().toString();
    return dateString;
}