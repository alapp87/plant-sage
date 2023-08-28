import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import ImageViewer from "../components/ImageViewer";
import Header from "../components/Header";
import { useState } from "react";
import { identifyPlantByImage } from "../api";
import { showToast } from "../utils";

const PlaceholderImage = require("../assets/default-plant.jpg");

export default function Main({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [identifyButtonDisabled, setIdentifyButtonDisabled] = useState(true);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      console.log(`Selected asset :: ${JSON.stringify(asset)}`);
      setSelectedImage(asset.uri);
      setIdentifyButtonDisabled(false);
    } else {
      alert("You did not select any image.");
    }
  };

  const onIdentifyPlantClick = async () => {
    try {
      console.log(`Identifying from image = ${selectedImage}`);

      setIsLoading(true);

      identifyPlantByImage(selectedImage).then(
        (response) => {
          console.log(response);

          setIsLoading(false);

          navigation.navigate("Suggestions", {
            plantSuggestions: response.plant_species,
          });
        },
        (error) => {
          setIsLoading(false);
          showToast("Error", error);
        }
      );
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle="alignItems:center"
    >
      <Header />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={"#fff"} />
          <Text style={styles.loadingText}>Identifying plant...</Text>
        </View>
      )}
      {!isLoading && (
        <View>
          <View style={styles.imageContainer}>
            <ImageViewer
              placeholderImageSource={PlaceholderImage}
              selectedImage={selectedImage}
            />
          </View>
          <View style={styles.imageButtonContainer}>
            <Button
              theme="primary"
              label="Choose a photo"
              onPress={pickImageAsync}
            />
            <Button
              theme="primary"
              label="Identify from this photo"
              onPress={onIdentifyPlantClick}
              disabled={identifyButtonDisabled}
            />
          </View>
        </View>
      )}
      <StatusBar style="auto" />
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    // alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 58,
  },
  imageContainer: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 10,
  },
  imageButtonContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 15,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
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
