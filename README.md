# 🌱 Eden - Smart Plant Monitor Dashboard

A beautiful, modern web dashboard for monitoring smart plant pot sensors in real-time. This project provides an aesthetic and engaging user interface for tracking plant health metrics including light levels, soil moisture, pH levels, and soil temperature.

## ✨ Features

### 🌟 Real-time Sensor Monitoring
- **Light Level**: Tracks light intensity in lux with optimal range indicators
- **Soil Moisture**: Monitors water content percentage with visual gauges
- **pH Level**: Measures soil acidity/alkalinity for optimal plant growth
- **Soil Temperature**: Tracks root zone temperature for plant health

### 📊 Data Visualization
- **Interactive Charts**: 24-hour and weekly trend analysis using Chart.js
- **Visual Gauges**: Color-coded progress bars showing optimal ranges
- **Real-time Updates**: Data refreshes every 3 seconds with smooth animations

### 🎨 Modern UI/UX Design
- **Glassmorphism Design**: Beautiful frosted glass effect with backdrop blur
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects, transitions, and loading animations
- **Color-coded Status**: Visual indicators for optimal, warning, and critical levels

### 🌿 Smart Recommendations
- **Watering Advice**: Intelligent recommendations based on soil moisture
- **Light Management**: Suggestions for optimal light conditions
- **Temperature Control**: Guidance for maintaining ideal temperature ranges

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. The dashboard will automatically start with simulated sensor data

### File Structure
```
eden/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling with animations
├── script.js           # JavaScript functionality and data simulation
└── README.md           # Project documentation
```

## 🎯 How It Works

### Sensor Data Simulation
The dashboard currently uses simulated sensor data that updates every 3 seconds. The data follows realistic patterns:

- **Light Level**: 0-1000 lux (optimal: 300-700 lux)
- **Soil Moisture**: 0-100% (optimal: 30-70%)
- **pH Level**: 0-14 pH (optimal: 6.0-7.5 pH)
- **Soil Temperature**: 0-50°C (optimal: 18-25°C)

### Real-time Features
- **Live Updates**: Sensor values change gradually to simulate real conditions
- **Color-coded Gauges**: Green (optimal), Orange (warning), Red (critical)
- **Smart Recommendations**: Context-aware advice based on current readings
- **Historical Tracking**: Data is stored and visualized in charts

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Beautiful purple-blue gradient theme
- **Glassmorphism Cards**: Semi-transparent cards with backdrop blur
- **Icon Integration**: Font Awesome icons for intuitive navigation
- **Typography**: Inter font family for modern, clean appearance

### Interactive Elements
- **Hover Effects**: Cards lift and scale on hover
- **Smooth Transitions**: All animations use CSS transitions
- **Loading Animations**: Intersection Observer for scroll-triggered animations
- **Responsive Grid**: CSS Grid and Flexbox for perfect layouts

## 🔧 Customization

### Connecting Real Sensors
To connect real sensor data, modify the `updateSensorData()` method in `script.js`:

```javascript
// Replace simulated data with real sensor readings
this.sensorData.light.current = realLightSensorValue;
this.sensorData.moisture.current = realMoistureSensorValue;
this.sensorData.ph.current = realPHSensorValue;
this.sensorData.temperature.current = realTemperatureSensorValue;
```

### Styling Customization
- **Colors**: Modify CSS custom properties in `styles.css`
- **Layout**: Adjust grid and flexbox properties
- **Animations**: Customize transition durations and effects

### Adding New Sensors
1. Add HTML structure for new sensor card
2. Update CSS styling for new sensor type
3. Extend JavaScript data structure and update methods

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Adjusted spacing and single-column sensor cards
- **Mobile**: Stacked layout with touch-friendly interactions

## 🛠️ Technical Stack

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **JavaScript ES6+**: Class-based architecture with real-time updates
- **Chart.js**: Interactive data visualization
- **Font Awesome**: Icon library for intuitive UI

## 🎯 Future Enhancements

### Planned Features
- **User Authentication**: Multi-user support with plant profiles
- **Alert System**: Push notifications for critical conditions
- **Data Export**: CSV/PDF reports for plant care history
- **Plant Database**: Species-specific care recommendations
- **Mobile App**: Native mobile application
- **IoT Integration**: Direct sensor connectivity via APIs

### API Integration
The dashboard is designed to easily integrate with:
- **REST APIs**: For real sensor data
- **WebSocket**: For live data streaming
- **MQTT**: For IoT device communication
- **Database**: For historical data storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualization
- **Font Awesome** for comprehensive icon library
- **Inter Font** for modern typography
- **CSS Grid & Flexbox** for responsive layouts

---

**Built with ❤️ for plant lovers everywhere**

*Help your plants thrive with intelligent monitoring and care recommendations!* 