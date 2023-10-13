export default function isValidPhone(number) {
  // Define a regular expression pattern for Indian mobile numbers
  var regex = /^[789]\d{9}$/;

  // Check if the input matches the pattern
  return regex.test(number);
}
