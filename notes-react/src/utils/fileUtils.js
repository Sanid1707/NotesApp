// // Converts a File to Base64
// export const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result); // Return the Base64 string
//       reader.onerror = (error) => reject(error);
//       reader.readAsDataURL(file);
//     });
//   };



// Converts a File to Base64
export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // Base64 with header
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  