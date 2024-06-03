import axios from "axios";

const getAddressByPostalCode = async (postalCode = "") =>
  await axios.get(`https://viacep.com.br/ws/${postalCode}/json/`);

export const viacepService = {
  getAddressByPostalCode
};
