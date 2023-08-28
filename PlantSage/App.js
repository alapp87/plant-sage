import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./screens/main";
import Suggestions from "./screens/suggestions";
import CareRoutine from "./screens/care-routine";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Suggestions" component={Suggestions} />
        <Stack.Screen name="CareRoutine" component={CareRoutine} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
