import type { PickerLocale } from 'antd/es/date-picker/generatePicker'
import CalendarLocale from 'rc-picker/lib/locale/vi_VN'
import TimePickerLocale from 'antd/es/time-picker/locale/vi_VN'

const myViLocale: PickerLocale = {
  lang: {
    placeholder: 'Chọn ngày',
    yearPlaceholder: 'Chọn năm',
    monthPlaceholder: 'Chọn tháng',
    weekPlaceholder: 'Chọn tuần',
    rangePlaceholder: ['Từ ngày', 'Đến ngày'],
    shortWeekDays: [
      'CN',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy'
    ],

    shortMonths: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ],

    ...CalendarLocale
  },
  timePickerLocale: {
    ...TimePickerLocale
  }
}

export default myViLocale
