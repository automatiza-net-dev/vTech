import moment from "moment";
import { useEffect, useState } from "react";
import { financesService } from "@/OLD/services/finances.service";

export const useFinances = (filters, reload) => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("competence")) {
      newObj = {
        ...newObj,
        competence: moment(filters?.competence)?.format("MM/YYYY"),
      };
    }

    if (keys.includes("fromIssue")) {
      newObj = {
        ...newObj,
        fromIssue: moment(filters?.fromIssue).format("YYYY/MM/DD"),
        toIssue: moment(filters.toIssue).format("YYYY/MM/DD"),
      };
    }

    if (keys.includes("toExpiration")) {
      newObj = {
        ...newObj,
        fromExpiration: moment(filters?.fromExpiration).format("YYYY/MM/DD"),
        toExpiration: moment(filters.toExpiration).format("YYYY/MM/DD"),
      };
    }

    if (keys.includes("fromPayment")) {
      newObj = {
        ...newObj,
        fromPayment: moment(filters?.fromPayment).format("YYYY/MM/DD"),
        toPayment: moment(filters?.toPayment).format("YYYY/MM/DD"),
      };
    }

    financesService
      .getAllFinances(newObj)
      .then((res) => setFinances(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (filters.noSearch) {
      return;
    }
    fetchData();
  }, [reload]);

  return {
    finances,
    fetchFinances: fetchData,
    loadingFinances: loading,
  };
};

export const useShowFinance = (ids, reload, search = true) => {
  const [finances, setFinances] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!ids || ids.length === 0 || search === false) {
      return;
    }

    setLoading(true);
    financesService
      .getAllFinances({ ids: Array.isArray(ids) ? ids : [ids] })
      .then((res) => setFinances(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [ids, reload, search]);

  return {
    finances,
    fetchFinance: fetchData,
    loadingFinances: loading,
  };
};

export const useReducedFinances = (filters, reload) => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }
    console.log({filters})

    if (!filters?.fromIssue) {
      delete filters?.fromIssue;
      delete filters?.toIssue;
    }

    if (!filters?.fromExpiration) {
      delete filters?.fromExpiration;
      delete filters?.toExpiration;
    }

    if (!filters?.fromPayment) {
      delete filters?.fromPayment;
      delete filters?.toPayment;
    }

    if (!filters?.competence) {
      delete filters?.competence;
    }

    setLoading(true);
    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("competence")) {
      newObj = {
        ...newObj,
        competence:filters?.competence ? moment(filters?.competence)?.format("MM/YYYY") : undefined,
      };
    }

    if (keys.includes("fromAcceptDate")) {
      newObj = {
        ...newObj,
        fromAcceptDate: filters?.fromAcceptDate ? moment(filters?.fromAcceptDate).format("YYYY/MM/DD") : undefined,
        toAcceptDate: filters.toAcceptDate ? moment(filters.toAcceptDate).format("YYYY/MM/DD") : undefined,
      };
    }

    if (keys.includes("fromIssue")) {
      newObj = {
        ...newObj,
        fromIssue: filters?.fromIssue ?  moment(filters?.fromIssue).format("YYYY/MM/DD") : undefined,
        toIssue: filters?.toIssue ?  moment(filters.toIssue).format("YYYY/MM/DD") : undefined,
      };
    }

    if (keys.includes("toExpiration")) {
      newObj = {
        ...newObj,
        fromExpiration:filters?.fromExpiration ? moment(filters?.fromExpiration).format("YYYY/MM/DD") : undefined,
        toExpiration: filters.toExpiration ? moment(filters.toExpiration).format("YYYY/MM/DD") : undefined,
      };
    }

    if (keys.includes("fromPayment")) {
      newObj = {
        ...newObj,
        fromPayment: filters?.fromPayment ? moment(filters?.fromPayment).format("YYYY/MM/DD") : undefined,
        toPayment: filters?.toPayment ? moment(filters?.toPayment).format("YYYY/MM/DD") : undefined,
      };
    }

    financesService
      .getReducedFinances({
        ...newObj,
        accept: newObj?.accept === "all" ? "" : newObj?.accept,
      })
      .then((res) => setFinances(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    finances,
    loadingFinances: loading,
    fetchFinances: fetchData,
  };
};

export const useShowBordero = (id, filters, reload) => {
  const [bordero, setBordero] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    financesService
      .showBordero(id, filters)
      .then((res) => {
        setBordero(res.data);
      })
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters, id]);

  return {
    bordero,
    loadingBordero: loading,
    fetchBordero: fetchData,
  };
};

export const useGroupedFinances = (filters, reload) => {
  const [finances, setFinances] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (filters?.noSearch) {
      return;
    }

    if (!filters?.fromIssue) {
      delete filters?.fromIssue;
      delete filters?.toIssue;
    }

    if (!filters?.fromExpiration) {
      delete filters?.fromExpiration;
      delete filters?.toExpiration;
    }

    if (!filters?.fromPayment) {
      delete filters?.fromPayment;
      delete filters?.toPayment;
    }

    if (!filters?.competence) {
      delete filters?.competence;
    }

    setLoading(true);
    const keys = Object.keys(filters);
    let newObj = { ...filters };

    if (keys.includes("competence")) {
      newObj = {
        ...newObj,
        competence: moment(filters?.competence)?.format("MM/YYYY"),
      };
    }

    if (keys.includes("fromIssue")) {
      newObj = {
        ...newObj,
        fromIssue: moment(filters?.fromIssue).format("YYYY/MM/DD"),
        toIssue: moment(filters.toIssue).format("YYYY/MM/DD"),
      };
    }

    if (keys.includes("toExpiration")) {
      newObj = {
        ...newObj,
        fromExpiration: moment(filters?.fromExpiration).format("YYYY/MM/DD"),
        toExpiration: moment(filters.toExpiration).format("YYYY/MM/DD"),
      };
    }

    if (keys.includes("fromPayment")) {
      newObj = {
        ...newObj,
        fromPayment: moment(filters?.fromPayment).format("YYYY/MM/DD"),
        toPayment: moment(filters?.toPayment).format("YYYY/MM/DD"),
      };
    }
    financesService
      .getGroupedFinances({
        ...newObj,
        accept: newObj?.accept === "all" ? "" : newObj?.accept,
      })
      .then((res) => setFinances(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    finances,
    loadingFinances: loading,
    fetchFinances: fetchData,
  };
};

export const usePaymentGroup = (filters, reload) => {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    const keys = Object.keys(filters);
    let newObj = { ...filters };

    keys?.map((filter) => {
      if (!newObj[filter] && filter !== "paymentDate") {
        delete newObj[filter];
      }
    });

    setLoading(true);

    financesService
      .getPaymentGroup(newObj)
      .then((res) => setFinances(res.data))
      .catch((err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    finances,
    loadingFinances: loading,
    fetchFinances: fetchData,
  };
};

export const useFinancesBalance = (filters) => {
  const [balance, setBalance] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    financesService
      .getFinancesBalance(
        filters?.checkingAccountId
          ? { checkingAccountId: filters?.checkingAccountId }
          : {}
      )
      .then((res) => setBalance(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [filters?.checkingAccountId]);

  return {
    balance,
    loadingBalance: loading,
    fetchFinancesBalance: fetchData,
  };
};
