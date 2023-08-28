import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { generateInfoAndCareRoutine } from "../api";
import { showToast } from "../utils";
import { useState } from "react";

export default function Suggestions({ navigation }) {
  const [isLoading, setLoading] = useState(false);
  const route = useRoute();
  const plantSuggestions = route.params.plantSuggestions;

  const onSuggestionPress = async (plantSpeciesName) => {
    setLoading(true);

    generateInfoAndCareRoutine(plantSpeciesName).then(
      (response) => {
        setLoading(false);

        navigation.navigate("CareRoutine", {
          name: plantSpeciesName,
          info: response.info,
          careRoutine: response.care_routine,
        });
      },
      (error) => {
        setLoading(false);
        showToast("Error", error);
      }
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={"#fff"} />
          <Text style={styles.loadingText}>Generating care routine...</Text>
        </View>
      )}
      {!isLoading && (
        <FlatList
          data={plantSuggestions}
          renderItem={({ item }) => (
            <Text
              style={styles.item}
              onPress={() => onSuggestionPress(item.name)}
            >
              {item.name} ({item.probability * 100}%)
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#25292e",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 50,
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
});
