export const fetchTransactions = () => (
  $.ajax({
    url: "/api/transactions"
  })
);

export const createTransaction = transaction => (
  $.ajax({
    method: "POST",
    url: "/api/transactions",
    data: { transaction }
  })
);