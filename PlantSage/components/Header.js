import { StyleSheet, View, Text } from "react-native";

export default Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Plant Sage AI</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 5,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "500",
  },
});
