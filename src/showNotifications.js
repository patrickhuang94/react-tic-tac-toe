import { notification } from 'antd'

export const showCellTakenNotification = () => {
  notification.open({
    message: 'The cell is already taken. Please select another move.',
    duration: 2,
    placement: 'topRight'
  })
}
