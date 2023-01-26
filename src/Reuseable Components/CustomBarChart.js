import React, {PureComponent} from 'react';
import {View, Dimensions, Image} from 'react-native';
import {Svg, G, Line, Rect, Text} from 'react-native-svg';
import * as d3 from 'd3';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const CustomBarChart = ({
  data,
  round,
  unit,
  width,
  height,
  barWidth,
  barRadius,
  barColor,
  axisColor,
  isPercentageVisible,
  isMiddleLineVisible,
  paddingBottom,
}) => {
  const GRAPH_MARGIN = 25;
  const GRAPH_BAR_WIDTH = barWidth ? barWidth : 5;
  const colors = {
    axis: axisColor ? axisColor : '#838383',
    bars: barColor ? barColor : '#15AD13',
  };
  // Dimensions
  //   const SVGHeight = 150;
  const SVGHeight = height;
  // const SVGWidth = 300;
  const SVGWidth = width;
  const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
  // const graphWidth = SVGWidth - 2 * GRAPH_MARGIN; // width of graph bars view
  const graphWidth = width; // width of graph bars view
  //   const data = data;

  // X scale point
  const xDomain = data.map(item => item.label);
  const xRange = [0, graphWidth];
  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

  // Y scale linear
  const maxValue = d3.max(data, d => d.value);
  const topValue = Math.ceil(maxValue / round) * round;
  const yDomain = [0, topValue];
  const yRange = [0, graphHeight];
  const y = d3.scaleLinear().domain(yDomain).range(yRange);

  // top axis and middle axis
  const middleValue = topValue / 2;

  return (
    <Svg width={SVGWidth + 10} height={SVGHeight + paddingBottom}>
      <G y={graphHeight + GRAPH_MARGIN}>
        {/* Top value label */}
        {/* <Text
          x={graphWidth}
          textAnchor="end"
          y={y(topValue) * -1 - 5}
          fontSize={12}
          fill="blue"
          fillOpacity={0.4}>
          {topValue + ' ' + unit}
        </Text> */}

        {/* top axis */}
        {/* <Line
          x1="0"
          y1={y(topValue) * -1}
          x2={graphWidth}
          y2={y(topValue) * -1}
          stroke={colors.axis}
          strokeDasharray={[3, 3]}
          strokeWidth="0.5"
        /> */}

        {/* ------- Middle Line----------- */}
        {isMiddleLineVisible && (
          <View>
            <Text
              x={graphWidth}
              textAnchor="end"
              //   y={y(middleValue) * -1.04}
              y={y(middleValue) * -0.98}
              fontSize={12}
              fill="#838383"
              fillOpacity={0.4}>
              <Image
                source={require('../../assets/images/flag1.png')}
                style={{
                  height: 10,
                  width: 10,
                  position: 'absolute',
                  right: 50,
                  top: height / 2.1,
                }}
              />
              {middleValue + ' ' + unit}
            </Text>
            {/* middle axis */}

            <Line
              x1="30" //line starting point
              y1={y(middleValue) * -1}
              x2={graphWidth - 52} // line ending point
              y2={y(middleValue) * -1}
              stroke={colors.axis}
              strokeDasharray={[4, 4]}
              strokeWidth="0.8"
            />
          </View>
        )}

        {/* bottom axis */}
        {/* <Line
          x1="0"
          y1="2"
          x2={graphWidth}
          y2="2"
          stroke={colors.axis}
          strokeWidth="0.5"
        /> */}

        {/* bars */}
        {data.map(item => (
          <Rect
            key={'bar' + item.label}
            x={x(item.label) - GRAPH_BAR_WIDTH / 2}
            y={y(item.value) * -1}
            rx={barRadius ? barRadius : 2.5}
            width={GRAPH_BAR_WIDTH + 2}
            height={y(item.value)}
            fill={colors.bars}
          />
        ))}

        {/* labels */}
        {data.map(item => (
          <Text
            key={'label' + item.label}
            fontSize="10"
            x={x(item.label)}
            y="15"
            fill={'#838383'}
            textAnchor="middle">
            {item.label}
          </Text>
        ))}
        {data.map(item => (
          <Text
            key={'label' + item.label}
            fontSize="10"
            fontWeight={'500'}
            x={x(item.label)}
            y="30"
            fill={'#000'}
            textAnchor="middle">
            {item.value}
          </Text>
        ))}
        {/* percentage label */}

        {isPercentageVisible &&
          data.map(item => (
            <Text
              key={'label' + item.label}
              fontSize="10"
              fontWeight={'600'}
              x={x(item.label)}
              y="45"
              fill={'#38ACFF'}
              textAnchor="middle">
              {item.percentage}
            </Text>
          ))}
      </G>
    </Svg>
  );
};

export default CustomBarChart;
