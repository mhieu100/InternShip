export const BAR_CHART_CONFIG = {
  dimensions: {
    width: 600,
    height: 280,
    margin: {
      top: 40,
      right: 30,
      bottom: 70,
      left: 60
    }
  },

  bars: {
    padding: 0.2,
    borderRadius: 2,
    colors: {
      default: '#4e79a7',
      Fruit_Shelf: '#59a14f',
      Dairy_Shelf: '#e15759',
      Bakery_Shelf: '#edc948',
      Vegetable_Shelf: '#76b7b2',
      Meat_Shelf: '#b07aa1'
    }
  },

  // Text labels
  labels: {
    fontSize: 10,
    color: '#333',
    offset: 5 // Khoảng cách từ đỉnh cột đến label
  },

  // Tiêu đề biểu đồ
  title: {
    fontSize: 14,
    offset: 20 // Khoảng cách từ top
  }
}

export type ChartConfig = typeof BAR_CHART_CONFIG
