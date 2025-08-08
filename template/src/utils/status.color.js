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

export const getCameraStatusColor = (status) => {
  const colors = {
    ['ONLINE']: 'success',
    ['OFFLINE']: 'error',
    ['MAINTENANCE']: 'warning',
    ['ERROR']: 'error'
  }
  return colors[status]
}

export const getCameraStatusText = (status) => {
  const texts = {
    ["ONLINE"]: 'Trực tuyến',
    ["OFFLINE"]: 'Ngoại tuyến',
    ["MAINTENANCE"]: 'Bảo trì',
    ["ERROR"]: 'Lỗi'
  }
  return texts[status]
}