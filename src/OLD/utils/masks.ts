// @ts-nocheck

const Masks = {
  cpf(value) {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  },

  noDocument(value) {
    return value
      ?.replaceAll(".", "")
      .replaceAll("/", "")
      .replaceAll("-", "")
      .replaceAll("_", "")
      .replaceAll(" ", "");
  },

  cnpj(value) {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  },

  phone(value) {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
      .replace(/(-\d{4})\d+?$/, "$1");
  },

  noPhone(value) {
    return value.replace(/\D/g, "");
  },

  ncm(value) {
    const filtered = value.replace(/\D+/g, "");

    const first = filtered.substring(0, 4);
    const second = filtered.substring(4, 6);
    const last = filtered.substring(6, 8);

    if (filtered.length < 5) {
      return value;
    }

    if (filtered.length < 7) {
      return `${first}.${second}`;
    }

    return `${first}.${second}.${last}`;
  },

  cep(value) {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  },

  pis(value) {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{5})(\d)/, "$1.$2")
      .replace(/(\d{5}\.)(\d{2})(\d)/, "$1$2-$3")
      .replace(/(-\d)\d+?$/, "$1");
  },

  money(value) {
    const cleanValue = +value.replace(/\D+/g, "");
    const options = { style: "currency", currency: "BRL" };
    return new Intl.NumberFormat("pt-br", options).format(cleanValue / 100);
  },

  noMoney(value) {
    return value
      .replace("R$", "")
      .replaceAll(" ", "")
      .replaceAll(".", "")
      .replace(",", ".");
  },

  balanceFormat(value) {
    return {
      value: parseFloat(value).toFixed(2).toString().replace(".", ",")
    };
  },

  cardNumber(value) {
    return value
      .replace(/\D+/g, "")
      .replace(" ", "")
      .replace(/(\d{18})(\d)/, "$1");
  },

  cardValidate(value) {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  }
};

export default Masks;
