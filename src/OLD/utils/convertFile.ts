export const convertFile = async (file) => {
  let src = file.url;

  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);

      reader.onload = () => resolve(reader.result);
    });
  }

  return src;

};
