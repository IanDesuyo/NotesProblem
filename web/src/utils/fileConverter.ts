interface ConvertedFile {
  fileBody: string;
  fileType: string;
}

/**
 * Convert a file to base64 encoded string
 * @param file
 * @returns Base64 encoded string
 */
const fileConverter = (file: File): Promise<ConvertedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const body = (reader.result as string).split(",")[1];

      resolve({ fileBody: body, fileType: file.type });
    };
    reader.onerror = error => {
      reject(error);
    };
  });
};

export default fileConverter;
