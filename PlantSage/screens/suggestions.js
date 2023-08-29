import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
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

  const roundPercentage = (percentage) => {
    return (percentage * 100).toFixed(1);
  };

  const buildPlantThumbnailImage = (item) => {
    console.log("Buildin thumbnail for ", item);
    if (item && item.similar_images) {
      return (
        <Image
          src={item.similar_images[0].url_small}
          style={styles.suggestionThumbnailImage}
        />
      );
    }
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
          data={plantSuggestions.suggestions}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text
                style={styles.item}
                onPress={() => onSuggestionPress(item.name)}
              >
                {item.name} ({roundPercentage(item.probability)}%)
              </Text>
              {buildPlantThumbnailImage(item)}
            </View>
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
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    height: 60,
  },
  item: {
    // padding: 10,
    fontSize: 18,
    // height: 60,
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
  suggestionThumbnailImage: {
    alignSelf: "center",
    width: 58,
    height: 58,
    borderRadius: 5,
  },
});
