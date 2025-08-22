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

export const getCameraStatusColor = (
  status: string
): 'success' | 'error' | 'default' => {
  switch (status) {
    case 'ONLINE':
      return 'success'
    case 'OFFLINE':
      return 'error'
    default:
      return 'default'
  }
}

export const getCameraStatusText = (
  status: string
): 'online' | 'offline' | 'default' => {
  switch (status) {
    case 'ONLINE':
      return 'online'
    case 'OFFLINE':
      return 'offline'
    default:
      return 'default'
  }
}

export const getRoleColor = (role: string) => {
  const colors: IProps = {
    admin: 'red',
    editor: 'blue',
    author: 'green',
    subscriber: 'default'
  }
  return colors[role] || 'default'
}
