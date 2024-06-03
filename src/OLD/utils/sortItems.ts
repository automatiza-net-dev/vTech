export const sortItems = (arr, field) => {
  arr?.sort((a, b) => {
    if (a[field]?.toLowerCase() < b[field]?.toLowerCase()) {
      return -1;
    }

    if (a[field]?.toLowerCase() > b[field]?.toLowerCase()) {
      return 1;
    }

    return 0;
  });
};
