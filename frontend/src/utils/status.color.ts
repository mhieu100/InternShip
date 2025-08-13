export const getColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'green'
    case 'PENDING':
      return 'blue'
    case 'CANCELLED':
      return 'red'
    default:
      return 'primary'
  }
}

export interface IProps {
  [key: string]: string
}

export const getCameraStatusColor = (status: string) => {
  const colors: IProps = {
    ['ONLINE']: 'success',
    ['OFFLINE']: 'error',
    ['MAINTENANCE']: 'warning',
    ['ERROR']: 'error'
  }
  return colors[status]
}

export const getCameraStatusText = (status: string) => {
  const texts: IProps = {
    ['ONLINE']: 'online',
    ['OFFLINE']: 'offline',
    ['MAINTENANCE']: 'maintenance',
    ['ERROR']: 'error'
  }
  return texts[status]
}
