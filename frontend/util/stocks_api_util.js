export const fetchStocks = () => (
  $.ajax({
    url: "/api/stocks"
  })
);