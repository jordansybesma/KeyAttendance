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

import React, {Component} from 'react';
import PropTypes from "prop-types";
import { scaleLinear } from 'd3-scale';

import { XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries } from 'react-vis';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';

class Heatmap extends Component {
  // const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // const testData = [{ x: 'Sun', y: 0, color: -1 }, { x: 'Mon', y: 0, color: 2 }, { x: 'Tue', y: 0, color: 5 }, { x: 'Wed', y: 0, color: 7 }, { x: 'Thu', y: 0, color: 10 }, { x: 'Fri', y: 0, color: 12 }, { x: 'Sat', y: 0, color: 15 },
  // { x: 'Sun', y: 1, color: 0 }, { x: 'Mon', y: 1, color: 2 }, { x: 'Tue', y: 1, color: 5 }, { x: 'Wed', y: 1, color: 0 }, { x: 'Thu', y: 1, color: 2 }, { x: 'Fri', y: 1, color: 5 }, { x: 'Sat', y: 1, color: 3 },
  // { x: 'Sun', y: 2, color: 0 }, { x: 'Mon', y: 2, color: 2 }, { x: 'Tue', y: 2, color: 5 }, { x: 'Wed', y: 2, color: 0 }, { x: 'Thu', y: 2, color: 2 }, { x: 'Fri', y: 2, color: 5 }, { x: 'Sat', y: 2, color: 3 },
  // { x: 'Sun', y: 3, color: 0 }, { x: 'Mon', y: 3, color: 2 }, { x: 'Tue', y: 3, color: 5 }, { x: 'Wed', y: 3, color: 0 }, { x: 'Thu', y: 3, color: 2 }, { x: 'Fri', y: 3, color: 5 }, { x: 'Sat', y: 3, color: 3 }];


  static propTypes = {
    heatMapJson: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    heatMapJson: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      heatMapJson: props.heatMapJson
    };
  }


  sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }


  compareTime(time1, time2) {
    return new Date(time1) > new Date(time2); // true if time1 is later
  }

  formatData() {
    try {

      //replace hyphens in date string with slashes b/c javascript Date object requires this (weird)
      var studentId = "906";
      var startDateString = "2018-01-28";
      var endDateString = "2018-03-03";
      var startDate = new Date(startDateString.replace(/-/g, '\/'));
      var endDate = new Date(endDateString.replace(/-/g, '\/'));
      var dateToCompare = startDate;
      var currEntryDate;
      var currIdx = 0;
      var heatMapJson = this.state.heatMapJson;
      console.log(heatMapJson);

      //Add dummy date entries for missing dates (dates with no engagements) to json btwn start and end date
      //dateToCompare always incremented by 1
      while (this.compareTime(dateToCompare, endDate) == false) {
        //if reached the end of json but there's still dates to fill in up to the end date, stay on end entry
        if (currIdx > heatMapJson.length - 1) {
          currIdx = heatMapJson.length - 1;
        }

        currEntryDate = new Date(heatMapJson[currIdx]["date"].replace(/-/g, '\/'));
        //identified missing date, so add dummy date entry for missing date
        if (this.sameDay(dateToCompare, currEntryDate) == false) {
          var dateEntryZeroEngagements = { "date": dateToCompare.toISOString().slice(0, 10), "daily_visits": 0 };
          //add entry in place if not at end of json OR final date entry has not been added yet/surpassed
          //else add to very end of json 
          if (currIdx != heatMapJson.length - 1 || this.compareTime(currEntryDate, dateToCompare)) {
            heatMapJson.splice(currIdx, 0, dateEntryZeroEngagements);
          } else {
            heatMapJson.splice(currIdx + 1, 0, dateEntryZeroEngagements);
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
      var m, d, y;
      var strDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (var i = 0; i < heatMapJson.length; i++) {
        currDateObj = new Date(heatMapJson[i]['date'].replace(/-/g, '\/'));
        dayOfWeek = strDays[currDateObj.getDay()];
        weekNum = Math.floor(i / 7);
        mdyArray = heatMapJson[i]['date'].split(/\s*\-\s*/g);
        y = mdyArray[0];
        m = mdyArray[1];
        d = mdyArray[2];
        dayEntry = { "x": dayOfWeek, "y": weekNum, "color": heatMapJson[i]['daily_visits']};
        processedData.push(dayEntry);
      }
    }
    catch (e) {
      console.log(e);
    }

    return processedData;
  }

  render() {    
    var data = this.formatData();
    console.log(data);
    return (
      <XYPlot
        width={500}
        height={300}
        xType="ordinal"
        yDomain={[5, -1]}>
        <XAxis tickValues={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']} tickLabelAngle={-45} />
        <HeatmapSeries
          className="heatmap-series-example"
          colorRange={["white", "orange"]}
          data={data}
          style={{
            stroke: 'white',
            strokeWidth: '2px',
            rectStyle: {
              rx: 10,
              ry: 10
            }
          }} />

        <LabelSeries
          animation
          allowOffsetToBeReversed
          data={this.state.heatMapJson} />
      </XYPlot>
    );
  };
}

export default Heatmap
