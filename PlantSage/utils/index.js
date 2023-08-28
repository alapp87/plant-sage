import { Toast } from "react-native-toast-message/lib/src/Toast";

export function showToast(
  subject,
  body = "",
  type = "success",
  visibilityTime = 6000
) {
  Toast.show({
    type,
    text1: subject,
    text2: body,
    visibilityTime,
  });
}
