function fromBase64ToString(value: string | string[] | undefined) {
  if (!value) {
    return "";
  }

  try {
    const decodedString = Buffer.from(value as string, "base64").toString(
      "utf-8"
    );
    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Invalid base64 or JSON:", error);
    return undefined;
  }
}

function toBase64(value: unknown) {
  try {
    const objJsonStr = JSON.stringify(value);
    const base64 = Buffer.from(objJsonStr).toString("base64");

    if(base64 === "e30=") {
      return ""
    }

    return base64;
  } catch {
    return "";
  }
}

export { fromBase64ToString, toBase64 };
