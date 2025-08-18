// File: generateData.js
export let barData = []

const generateRandomData = () => {
  const newData = []
  for (let hour = 7; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 17 && minute > 0) break // Dừng ở 17h00
      newData.push({
        letter: `${hour}h${minute.toString().padStart(2, '0')}`,
        frequency: Math.floor(Math.random() * 100) + 1 // Random 1-100
      })
    }
  }
  return newData
}

// Cập nhật dữ liệu mỗi 2 giây
setInterval(() => {
  barData = generateRandomData()
  console.log('Data updated:', barData) // Kiểm tra trong console
}, 10000)

// Khởi tạo lần đầu
barData = generateRandomData()
