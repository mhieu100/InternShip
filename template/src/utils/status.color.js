export const getColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "green";
    case "PENDING":
      return "blue";
    case "CANCELLED":
      return "red";
    default:
      return "primary";
  }
};