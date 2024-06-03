export const Print = (text) => {
  const screen = window.open("about:blank");
  if(screen) {
    screen.document.write(text);
    screen.window.print();
    screen.window.close();
  }
};

export const accessControlTitles = (type) => {
  if (type === "receive" || type === "CREDITO") {
    return "TRC";
  } else {
    return "TPG";
  }
};

export const caracterLimit = (str, limit) => {
  let arr = str.split("");

  arr = arr
    .map((letter, i) => i <= limit - 1 && letter)
    .filter((letter) => letter);

  return arr.join("");
};

export const convertToAge = (age) => {
  if (!age) {
    return "-";
  }

  const totalDays = age * 365;

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = Math.floor(totalDays - years * 365 - months * 30);

  return `${years} anos, ${months} meses e ${days} dias`;
};

export const convertFileToBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => callback(reader.result);
}