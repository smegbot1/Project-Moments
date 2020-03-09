import * as React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? "#46C1D5" : "#626060"}
    />
  );
}
