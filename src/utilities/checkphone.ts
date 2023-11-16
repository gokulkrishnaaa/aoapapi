export default function isValidPhone(number) {
  // Define a regular expression pattern for Indian mobile numbers
  var regex = /^[0-9]{4,}$/;

  // Check if the input matches the pattern
  return regex.test(number);
}
