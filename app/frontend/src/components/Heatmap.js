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

import { XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries, MarkSeries } from 'react-vis';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';

class Heatmap extends Component {

  static propTypes = {
    heatMapJson: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    data: [],

  };

  constructor(props) {
    super(props);

    this.state = {
      data: props.data
    };
  }

  render() {    
    return (
      <XYPlot
        width={500}
        height={300}
        xType="ordinal"
      >

        <XAxis/>
        <YAxis/>
        <MarkSeries data={this.state.data}/>
           
        <HeatmapSeries
              className="heatmap-series-example"
              colorRange={["white", "orange"]}
              data={this.state.data}
              style={{
                stroke: 'white',
                strokeWidth: '2px',
                rectStyle: {
                  rx: 10,
                  ry: 10
                }
              }} />



      </XYPlot>
    );
  };
}

export default Heatmap
