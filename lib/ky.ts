import ky from "ky";

// This instance parses the key that ends with At like createdAt/ updatedAt into Date objects
const kyInstance = ky.create({
  parseJson: (text) => {
    // (key, value) => {} : this is the retriever function that is used to transform the object
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    });
  },
});

export default kyInstance;
