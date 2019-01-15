// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {scaleLinear} from 'd3-scale';

import {XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries} from 'react-vis';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const data = alphabet.reduce((acc, letter1, idx) => {
  return acc.concat(
    alphabet.map((letter2, jdx) => ({
      x: `${letter1}1`,
      y: `${letter2}2`,
      color: (idx + jdx) % Math.floor(jdx / idx) || idx
    }))
  );
}, []);
const {min, max} = data.reduce(
  (acc, row) => ({
    min: Math.min(acc.min, row.color),
    max: Math.max(acc.max, row.color)
  }),
  {min: Infinity, max: -Infinity}
);


function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
function compareTime(time1, time2) {
  return new Date(time1) > new Date(time2); // true if time1 is later
}

async function formatData(){
  try {
    console.log("Hit the endpoint with studentid=906, startdate=2018-01-28, enddate=2018-03-03");
    var studentId = "906";
    var startDateString = "2018-01-28";
    var endDateString = "2018-03-03";
    const heatMapData = await fetch('http://127.0.0.1:8000/api/reports/individualHeatmap/?student_id=' + studentId + '&startdate=' + startDateString + '&enddate=' + endDateString);
    const heatMapJson = await heatMapData.json();
    console.log(heatMapJson);
   //replace hyphens in date string with slashes b/c javascript Date object requires this (weird)
   var startDate = new Date(startDateString.replace(/-/g, '\/'));
   var endDate = new Date(endDateString.replace(/-/g, '\/'));
   var dateToCompare = startDate;
   var currEntryDate;
   var currIdx = 0;
   //Add dummy date entries for missing dates (dates with no engagements) to json btwn start and end date
   //dateToCompare always incremented by 1
   while (compareTime(dateToCompare, endDate) == false){
    //if reached the end of json but there's still dates to fill in up to the end date, stay on end entry
    if(currIdx > heatMapJson.length-1){
      currIdx = heatMapJson.length-1;
    }

    currEntryDate = new Date(heatMapJson[currIdx]["date"].replace(/-/g, '\/'));
    //identified missing date, so add dummy date entry for missing date
    if (sameDay(dateToCompare, currEntryDate) == false){
      var dateEntryZeroEngagements = {"date": dateToCompare.toISOString().slice(0, 10), "daily_visits": 0};
      //add entry in place if not at end of json OR final date entry has not been added yet/surpassed
      //else add to very end of json 
      if(currIdx != heatMapJson.length-1 || compareTime(currEntryDate, dateToCompare)){
        heatMapJson.splice(currIdx, 0, dateEntryZeroEngagements);
      }else{
        heatMapJson.splice(currIdx+1, 0, dateEntryZeroEngagements);
      }
    }
    dateToCompare.setDate(dateToCompare.getDate() + 1);
    currIdx++;
   }

  //Time to convert updated JSON with missing dates added in into
  //a list called processedData of {"x": integer day of week, "y": integer week # of month, "color": int num engagements per day} objs
  var processedData = [];
  var dayOfWeek, weekNum, dayEntry;
  var currDateObj;
  var mdyArray;
  var m, d ,y;
  var strDays = ["Sun", "Mon", "Tues","Wed", "Thurs","Fri", "Sat"];
  for (var i = 0; i < heatMapJson.length; i++) {
      currDateObj = new Date(heatMapJson[i]['date'].replace(/-/g, '\/'));
      dayOfWeek = strDays[currDateObj.getDay()];
      weekNum = Math.floor(i/7);
      mdyArray = heatMapJson[i]['date'].split(/\s*\-\s*/g);
      y = mdyArray[0];
      m = mdyArray[1];
      d = mdyArray[2];
      dayEntry = {"x": dayOfWeek, "y": weekNum, "numEngagements": heatMapJson[i]['daily_visits'], "month": m, "day": d,"year": y};
      processedData.push(dayEntry);
    }
    console.log(processedData);
  }
  catch (e) {
    console.log(e);
  }
}

export default function LabeledHeatmap() {
  formatData();
  const exampleColorScale = scaleLinear()
    .domain([min, (min + max) / 2, max])
    .range(['orange', 'white', 'cyan']);
  return (
    <XYPlot
      xType="ordinal"
      xDomain={alphabet.map(letter => `${letter}1`)}
      yType="ordinal"
      yDomain={alphabet.map(letter => `${letter}2`).reverse()}
      margin={50}
      width={500}
      height={500}
    >
      <XAxis orientation="top" />
      <YAxis />
      <HeatmapSeries
        colorType="literal"
        getColor={d => exampleColorScale(d.color)}
        style={{
          stroke: 'white',
          strokeWidth: '2px',
          rectStyle: {
            rx: 10,
            ry: 10
          }
        }}
        className="heatmap-series-example"
        data={data}
      />
      <LabelSeries
        data={data}
        labelAnchorX="middle"
        labelAnchorY="baseline"
        getLabel={d => `${d.color}`}
      />
    </XYPlot>
  );
}