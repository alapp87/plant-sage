import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export default function CareRoutine({ navigation }) {
  const route = useRoute();
  const name = route.params.name;
  const info = route.params.info;
  const careRoutine = route.params.careRoutine;
  let components = [];

  const capitalizeSubject = (text) => {
    let capText = "";
    words = text.split("_");
    for (let w of words) {
      capText = `${capText} ${w[0].toUpperCase()}${w.substring(1)}`;
    }
    return capText;
  };

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle="alignItems:center"
    >
      <View style={styles.infoContainer}>
        {/* <Text style={styles.mainHeader}>Plant Species</Text> */}
        <Text style={styles.mainHeader}>{name}</Text>
        <Text style={styles.header}>Info</Text>
        <Text style={styles.plantInfoText}>{info}</Text>
        <Text style={styles.header}>Care Routine</Text>
        {components}
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
  },
  infoContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 50,
  },
  mainHeader: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 5,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 5,
  },
  subheader: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  plantSpeciesText: {
    color: "#fff",
    fontSize: 19,
  },
  plantInfoText: {
    color: "#fff",
    fontSize: 15,
    paddingHorizontal: 10,
  },
});
