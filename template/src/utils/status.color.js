export const getColor = (status) => {
  switch (status) {
    case "COMPLETE":
      return "green";
    case "PENDING":
      return "green";
    case "CANCEL":
      return "red";
    default:
      return "primary";
  }
};