import { StyleSheet } from "react-native";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export const STYLE = {
  menuIcon: {
    width: responsiveWidth(8),
    height: responsiveHeight(2),
    resizeMode: "stretch",
  },
  rightMenuIcon: {
    width: responsiveWidth(4.4),
    height: responsiveHeight(2.8),
    resizeMode: "stretch",
  },
};
