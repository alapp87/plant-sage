import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import * as ImagePicker from "expo-image-picker";
import Button from "./components/Button";
import ImageViewer from "./components/ImageViewer";
import { useState } from "react";
import { generateInfoAndCareRoutine, identifyPlantByImage } from "./api";

const PlaceholderImage = require("./assets/adaptive-icon.png");

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantSpecies, setPlantSpecies] = useState("Unknown");
  const [plantInfo, setPlantInfo] = useState("...");
  const [plantCare, setPlantCare] = useState([]);
  // const devices = useCameraDevices();
  // const device = devices.back;

  const showToast = (subject, body = "", type = "success") => {
    Toast.show({
      type,
      text1: subject,
      text2: body,
    });
  };

  // const getCameraPermissionStatus = async () => {
  //   return await Camera.getCameraPermissionStatus();
  // };

  // const requestCameraPermission = async () => {
  //   return await Camera.requestCameraPermission();
  // };

  // const startCamera = () => {
  //   getCameraPermissionStatus().then(
  //     (cameraPermissionStatus) => {
  //       console.log(`Camera Permission is ${cameraPermissionStatus}`);
  //       showToast("Camera Permission", cameraPermissionStatus);

  //       if (cameraPermissionStatus != "authorized") {
  //         console.log(`Camera Permission is needed!`);
  //         showToast("Camera Permission Needed");

  //         requestCameraPermission().then(
  //           (newCameraPermission) => {
  //             if (newCameraPermission != "authorized") {
  //               console.log(`Camera Permission not granted but is needed!`);
  //               showToast("Camera Permission", "Camera permission required!");
  //             }
  //           },
  //           (reason) => {
  //             console.log(`Rejected :: ${reason}`);
  //           }
  //         );
  //       }
  //     },
  //     (reason) => {
  //       console.log(`Rejected :: ${reason}`);
  //     }
  //   );
  // };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      asset = result.assets[0];
      console.log(`Selected asset :: ${JSON.stringify(asset)}`);
      setSelectedImage(asset.uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const onIdentifyPlantClick = async () => {
    try {
      console.log(`Identifying from image = ${selectedImage}`);
      identifyPlantByImage(selectedImage).then(
        (response) => {
          console.log(response);
          plant_species_name = response.plant_species[0].name;
          setPlantSpecies(plant_species_name);

          generateInfoAndCareRoutine(plant_species_name).then(
            (response) => {
              setPlantInfo(response.info);

              components = [];
              careRoutine = response.care_routine;

              for (let subject in careRoutine) {
                console.log(subject);
                console.log(careRoutine[subject]);

                components.push(
                  <Text key={subject} style={styles.subheader}>
                    {capitalizeSubject(subject)}
                  </Text>
                );
                components.push(
                  <Text key={`${subject}-info`} style={styles.plantInfoText}>
                    {careRoutine[subject]}
                  </Text>
                );
              }

              setPlantCare(components);
            },
            (error) => {
              showToast("Error", error);
            }
          );
        },
        (error) => {
          showToast("Error", error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const capitalizeSubject = (text) => {
    let capText = "";
    words = text.split("_");
    for (let w of words) {
      capText = `${capText} ${w[0].toUpperCase()}${w.substring(1)}`;
    }
    return capText;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle="alignItems:center"
    >
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button
          theme="primary"
          label="Choose a photo"
          onPress={pickImageAsync}
        />
        <Button
          theme="primary"
          label="Identify from this photo"
          onPress={onIdentifyPlantClick}
        />
        <Text style={styles.header}>Plant Species</Text>
        <Text style={styles.plantSpeciesText}>{plantSpecies}</Text>
        <Text style={styles.header}>Info</Text>
        <Text style={styles.plantInfoText}>{plantInfo}</Text>
        <Text style={styles.header}>Care Routine</Text>
        {plantCare}
      </View>
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
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  subheader: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  plantSpeciesText: {
    color: "#fff",
    fontSize: 17,
  },
  plantInfoText: {
    color: "#fff",
    fontSize: 15,
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
