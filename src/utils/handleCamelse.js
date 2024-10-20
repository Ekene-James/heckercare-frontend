export function toCamelCase(inputString) {
  // Split the input string into words using spaces as the delimiter
  const words = inputString.split(" ");

  // Capitalize the first letter of each word (except the first one)
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }

  // Join the words back together and return the camelCase string
  return words.join("");
}

export function fromCamelCase(camelCaseString) {
  return camelCaseString.replace(/([a-z])([A-Z])/g, "$1 $2");
}
