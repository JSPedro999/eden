// Smart Plant Monitor Dashboard - Supabase Integration

class PlantMonitor {
    constructor() {
        // Supabase configuration
        this.supabaseUrl = 'https://hlfjotqhfzkcrbmvpdzq.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZmpvdHFoZnprY3JibXZwZHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzMxNzMsImV4cCI6MjA2OTkwOTE3M30.zEWorM6qdbsoSaajn5Sb9WLj_uZsmFUy-EY8-OC-LGI';
        this.supabase = null;
        
        // Sensor data structure
        this.sensorData = {
            light: { current: 0, min: 0, max: 1000, optimal: [300, 700] },
            moisture: { current: 0, min: 0, max: 100, optimal: [30, 70] },
            ph: { current: 0, min: 0, max: 14, optimal: [6.0, 7.5] },
            temperature: { current: 0, min: 0, max: 50, optimal: [18, 25] }
        };
        
        this.updateInterval = null;
        this.isConnected = false;
        
        this.init();
    }
    
    async init() {
        await this.initializeSupabase();
        this.setupEventListeners();
        this.startDataFetching();
        this.updateRecommendations();
    }
    
    // Initialize Supabase client
    async initializeSupabase() {
        try {
            // Credentials are now configured
            
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            
            // Test connection
            const { data, error } = await this.supabase
                .from('sensor_data')
                .select('*')
                .limit(1);
            
            if (error) {
                console.error('Supabase connection error:', error);
                this.showConnectionError('Failed to connect to database');
                return;
            }
            
            this.isConnected = true;
            this.updateConnectionStatus(true);
            console.log('✅ Connected to Supabase successfully');
            
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.showConnectionError('Connection failed');
        }
    }
    
    // Fetch latest sensor data from Supabase
    async fetchSensorData() {
        if (!this.isConnected || !this.supabase) {
            console.warn('Supabase not connected');
            return;
        }
        
        try {
            // Fetch the latest record from your sensor data table
            const { data, error } = await this.supabase
                .from('sensor_data')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(1);
            
            if (error) {
                console.error('Error fetching sensor data:', error);
                return;
            }
            
            if (data && data.length > 0) {
                const latestData = data[0];
                
                // Update sensor data with your table column names
                this.sensorData.light.current = latestData.light_level || 0;
                this.sensorData.moisture.current = latestData.soil_moisture || 0;
                this.sensorData.ph.current = latestData.ph || 0;
                this.sensorData.temperature.current = latestData.soil_temp || 0;
                
                // Update UI
                this.updateSensorDisplay();
                this.updateGauges();
                this.updateRecommendations();
                this.updatePlantHealthStatus();
                
                console.log('📊 Updated sensor data:', this.sensorData);
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    // Start periodic data fetching
    startDataFetching() {
        // Initial fetch
        this.fetchSensorData();
        
        // Fetch every 5 seconds (adjust as needed)
        this.updateInterval = setInterval(() => {
            this.fetchSensorData();
        }, 5000);
    }
    
    // Update sensor display values
    updateSensorDisplay() {
        document.getElementById('light-value').textContent = 
            Math.round(this.sensorData.light.current);
        document.getElementById('moisture-value').textContent = 
            Math.round(this.sensorData.moisture.current);
        document.getElementById('ph-value').textContent = 
            this.sensorData.ph.current.toFixed(1);
        document.getElementById('temp-value').textContent = 
            Math.round(this.sensorData.temperature.current);
    }
    
    // Update gauge visualizations
    updateGauges() {
        // Light gauge
        const lightPercent = (this.sensorData.light.current / this.sensorData.light.max) * 100;
        document.getElementById('light-gauge').style.width = `${lightPercent}%`;
        
        // Moisture gauge
        const moisturePercent = this.sensorData.moisture.current;
        document.getElementById('moisture-gauge').style.width = `${moisturePercent}%`;
        
        // pH gauge (normalized to 0-100)
        const phPercent = (this.sensorData.ph.current / this.sensorData.ph.max) * 100;
        document.getElementById('ph-gauge').style.width = `${phPercent}%`;
        
        // Temperature gauge (normalized to 0-100)
        const tempPercent = (this.sensorData.temperature.current / this.sensorData.temperature.max) * 100;
        document.getElementById('temp-gauge').style.width = `${tempPercent}%`;
        
        // Update gauge colors based on optimal ranges
        this.updateGaugeColors();
    }
    
    // Update gauge colors based on optimal ranges
    updateGaugeColors() {
        const gauges = {
            light: document.getElementById('light-gauge'),
            moisture: document.getElementById('moisture-gauge'),
            ph: document.getElementById('ph-gauge'),
            temp: document.getElementById('temp-gauge')
        };
        
        // Light gauge colors
        if (this.sensorData.light.current < this.sensorData.light.optimal[0]) {
            gauges.light.style.background = 'linear-gradient(90deg, #FF5722, #E64A19)';
        } else if (this.sensorData.light.current > this.sensorData.light.optimal[1]) {
            gauges.light.style.background = 'linear-gradient(90deg, #FF9800, #F57C00)';
        } else {
            gauges.light.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        }
        
        // Moisture gauge colors
        if (this.sensorData.moisture.current < this.sensorData.moisture.optimal[0]) {
            gauges.moisture.style.background = 'linear-gradient(90deg, #FF5722, #E64A19)';
        } else if (this.sensorData.moisture.current > this.sensorData.moisture.optimal[1]) {
            gauges.moisture.style.background = 'linear-gradient(90deg, #2196F3, #1976D2)';
        } else {
            gauges.moisture.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        }
        
        // pH gauge colors
        if (this.sensorData.ph.current < this.sensorData.ph.optimal[0]) {
            gauges.ph.style.background = 'linear-gradient(90deg, #FF5722, #E64A19)';
        } else if (this.sensorData.ph.current > this.sensorData.ph.optimal[1]) {
            gauges.ph.style.background = 'linear-gradient(90deg, #9C27B0, #7B1FA2)';
        } else {
            gauges.ph.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        }
        
        // Temperature gauge colors
        if (this.sensorData.temperature.current < this.sensorData.temperature.optimal[0]) {
            gauges.temp.style.background = 'linear-gradient(90deg, #2196F3, #1976D2)';
        } else if (this.sensorData.temperature.current > this.sensorData.temperature.optimal[1]) {
            gauges.temp.style.background = 'linear-gradient(90deg, #FF5722, #E64A19)';
        } else {
            gauges.temp.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        }
    }
    
    // Update plant health status based on sensor data
    updatePlantHealthStatus() {
        const statusBadge = document.querySelector('.status-badge');
        const healthStatus = this.calculatePlantHealth();
        
        // Remove all existing classes
        statusBadge.classList.remove('healthy', 'warning', 'critical');
        
        // Add appropriate class and update text
        statusBadge.classList.add(healthStatus.status);
        statusBadge.textContent = healthStatus.text;
        
        console.log('🌱 Plant Health Status:', healthStatus);
    }
    
    // Calculate overall plant health
    calculatePlantHealth() {
        let criticalIssues = 0;
        let warningIssues = 0;
        let optimalConditions = 0;
        
        // Check light
        if (this.sensorData.light.current < this.sensorData.light.optimal[0] || 
            this.sensorData.light.current > this.sensorData.light.optimal[1]) {
            if (this.sensorData.light.current < 200 || this.sensorData.light.current > 800) {
                criticalIssues++;
            } else {
                warningIssues++;
            }
        } else {
            optimalConditions++;
        }
        
        // Check moisture
        if (this.sensorData.moisture.current < this.sensorData.moisture.optimal[0] || 
            this.sensorData.moisture.current > this.sensorData.moisture.optimal[1]) {
            if (this.sensorData.moisture.current < 20 || this.sensorData.moisture.current > 80) {
                criticalIssues++;
            } else {
                warningIssues++;
            }
        } else {
            optimalConditions++;
        }
        
        // Check pH
        if (this.sensorData.ph.current < this.sensorData.ph.optimal[0] || 
            this.sensorData.ph.current > this.sensorData.ph.optimal[1]) {
            if (this.sensorData.ph.current < 5.0 || this.sensorData.ph.current > 8.0) {
                criticalIssues++;
            } else {
                warningIssues++;
            }
        } else {
            optimalConditions++;
        }
        
        // Check temperature
        if (this.sensorData.temperature.current < this.sensorData.temperature.optimal[0] || 
            this.sensorData.temperature.current > this.sensorData.temperature.optimal[1]) {
            if (this.sensorData.temperature.current < 15 || this.sensorData.temperature.current > 30) {
                criticalIssues++;
            } else {
                warningIssues++;
            }
        } else {
            optimalConditions++;
        }
        
        // Determine overall health status
        if (criticalIssues > 0) {
            return {
                status: 'critical',
                text: 'Critical',
                description: `${criticalIssues} critical issue(s) detected`
            };
        } else if (warningIssues > 0) {
            return {
                status: 'warning',
                text: 'Warning',
                description: `${warningIssues} condition(s) need attention`
            };
        } else {
            return {
                status: 'healthy',
                text: 'Healthy',
                description: 'All conditions optimal'
            };
        }
    }
    
    // Update plant care recommendations
    updateRecommendations() {
        const recommendations = {
            watering: this.getWateringRecommendation(),
            light: this.getLightRecommendation(),
            temperature: this.getTemperatureRecommendation()
        };
        
        document.getElementById('watering-recommendation').textContent = recommendations.watering;
        document.getElementById('light-recommendation').textContent = recommendations.light;
        document.getElementById('temp-recommendation').textContent = recommendations.temperature;
    }
    
    // Get watering recommendation
    getWateringRecommendation() {
        const moisture = this.sensorData.moisture.current;
        if (moisture < 20) {
            return "Water your plant immediately! Soil is very dry.";
        } else if (moisture < 30) {
            return "Time to water your plant. Soil is getting dry.";
        } else if (moisture > 80) {
            return "Stop watering! Soil is too wet and may cause root rot.";
        } else if (moisture > 70) {
            return "Hold off on watering. Soil moisture is high.";
        } else {
            return "Soil moisture is optimal. No action needed.";
        }
    }
    
    // Get light recommendation
    getLightRecommendation() {
        const light = this.sensorData.light.current;
        if (light < 200) {
            return "Move plant to a brighter location. Light is too low.";
        } else if (light < 300) {
            return "Consider moving plant closer to a light source.";
        } else if (light > 800) {
            return "Move plant away from direct sunlight to prevent burning.";
        } else if (light > 700) {
            return "Light is bright but manageable. Monitor for leaf burn.";
        } else {
            return "Light conditions are perfect for your plant!";
        }
    }
    
    // Get temperature recommendation
    getTemperatureRecommendation() {
        const temp = this.sensorData.temperature.current;
        if (temp < 15) {
            return "Temperature is too cold! Move plant to a warmer area.";
        } else if (temp < 18) {
            return "Temperature is cool. Consider moving to a warmer spot.";
        } else if (temp > 30) {
            return "Temperature is too hot! Move plant to a cooler area.";
        } else if (temp > 25) {
            return "Temperature is warm. Ensure good air circulation.";
        } else {
            return "Temperature is ideal for your plant's growth!";
        }
    }
    
    // Update connection status in UI
    updateConnectionStatus(connected) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-indicator span:last-child');
        
        if (connected) {
            statusDot.classList.remove('offline');
            statusDot.classList.add('online');
            statusText.textContent = 'Connected';
        } else {
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = 'Disconnected';
        }
    }
    
    // Show connection error
    showConnectionError(message) {
        this.updateConnectionStatus(false);
        console.error('Connection Error:', message);
        
        // You can add a more user-friendly error display here
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff5722;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        errorDiv.textContent = `⚠️ ${message}`;
        document.body.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Sensor card interactions
        document.querySelectorAll('.sensor-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showSensorDetails(card);
            });
        });
        
        // Recommendation card interactions
        document.querySelectorAll('.recommendation-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showRecommendationDetails(card);
            });
        });
        
        // Modal close functionality
        this.setupModalListeners();
        
        // Add hover effects for better UX
        document.querySelectorAll('.sensor-card, .recommendation-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Setup modal event listeners
    setupModalListeners() {
        // Close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModals();
            });
        });
        
        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }
    
    // Close all modals
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Show sensor details modal
    showSensorDetails(card) {
        const modal = document.getElementById('sensor-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalCurrentValue = document.getElementById('modal-current-value');
        const modalUnit = document.getElementById('modal-unit');
        const modalOptimalRange = document.getElementById('modal-optimal-range');
        const parameterDetails = document.getElementById('parameter-details');
        const sensorRecommendation = document.getElementById('sensor-recommendation');
        
        let sensorType, sensorData, unit, parameterInfo, recommendation;
        
        if (card.classList.contains('light')) {
            sensorType = 'Light Level';
            sensorData = this.sensorData.light;
            unit = 'lux';
            parameterInfo = this.getLightParameterInfo();
            recommendation = this.getLightRecommendation();
        } else if (card.classList.contains('moisture')) {
            sensorType = 'Soil Moisture';
            sensorData = this.sensorData.moisture;
            unit = '%';
            parameterInfo = this.getMoistureParameterInfo();
            recommendation = this.getWateringRecommendation();
        } else if (card.classList.contains('ph')) {
            sensorType = 'pH Level';
            sensorData = this.sensorData.ph;
            unit = 'pH';
            parameterInfo = this.getPHParameterInfo();
            recommendation = this.getPHRecommendation();
        } else {
            sensorType = 'Soil Temperature';
            sensorData = this.sensorData.temperature;
            unit = '°C';
            parameterInfo = this.getTemperatureParameterInfo();
            recommendation = this.getTemperatureRecommendation();
        }
        
        // Update modal content
        modalTitle.textContent = sensorType;
        modalCurrentValue.textContent = sensorType === 'pH Level' ? 
            sensorData.current.toFixed(1) : Math.round(sensorData.current);
        modalUnit.textContent = unit;
        modalOptimalRange.textContent = `${sensorData.optimal[0]} - ${sensorData.optimal[1]} ${unit}`;
        parameterDetails.innerHTML = parameterInfo;
        sensorRecommendation.textContent = recommendation;
        
        // Show modal
        modal.style.display = 'block';
    }
    
    // Show recommendation details modal
    showRecommendationDetails(card) {
        const modal = document.getElementById('recommendation-modal');
        const modalTitle = document.getElementById('recommendation-modal-title');
        const currentStatus = document.getElementById('recommendation-current-status');
        const detailedContent = document.getElementById('detailed-recommendation-content');
        const careTipsContent = document.getElementById('care-tips-content');
        
        let recommendationType, statusInfo, detailedInfo, careTips;
        
        // Determine which recommendation card was clicked
        const cardTitle = card.querySelector('h3').textContent;
        
        if (cardTitle === 'Watering') {
            recommendationType = 'Watering Recommendations';
            statusInfo = this.getWateringStatusInfo();
            detailedInfo = this.getDetailedWateringInfo();
            careTips = this.getWateringCareTips();
        } else if (cardTitle === 'Light') {
            recommendationType = 'Light Management';
            statusInfo = this.getLightStatusInfo();
            detailedInfo = this.getDetailedLightInfo();
            careTips = this.getLightCareTips();
        } else {
            recommendationType = 'Temperature Control';
            statusInfo = this.getTemperatureStatusInfo();
            detailedInfo = this.getDetailedTemperatureInfo();
            careTips = this.getTemperatureCareTips();
        }
        
        // Update modal content
        modalTitle.textContent = recommendationType;
        currentStatus.innerHTML = statusInfo;
        detailedContent.innerHTML = detailedInfo;
        careTipsContent.innerHTML = careTips;
        
        // Show modal
        modal.style.display = 'block';
    }
    
    // Stop data fetching
    stopUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    // Get current sensor data
    getSensorData() {
        return this.sensorData;
    }
    
    // Parameter information methods for sensor modals
    getLightParameterInfo() {
        return `
            <p>Light is crucial for photosynthesis and healthy plant growth. Here's what different light levels mean:</p>
            <ul>
                <li><strong>0-200 lux:</strong> Very low light - Most plants will struggle, may become leggy</li>
                <li><strong>200-500 lux:</strong> Low light - Suitable for low-light plants like pothos and snake plants</li>
                <li><strong>500-1000 lux:</strong> Medium light - Suitable for most houseplants</li>
                <li><strong>1000+ lux:</strong> Bright light - Ideal for flowering plants and succulents</li>
            </ul>
            <p>For reference: indirect sunlight near a window is typically 1000-5000 lux, while direct sunlight can be 10,000+ lux.</p>
        `;
    }
    
    getMoistureParameterInfo() {
        return `
            <p>Soil moisture is critical for plant health. Too little or too much can cause serious problems:</p>
            <ul>
                <li><strong>0-20%:</strong> Very dry - Immediate watering needed, risk of plant stress</li>
                <li><strong>20-40%:</strong> Dry - Time to water most plants!</li>
                <li><strong>40-70%:</strong> Optimal - Perfect most plants</li>
                <li><strong>70-85%:</strong> Moist - Good for humidity-loving plants, but monitor closely!</li>
                <li><strong>85%+:</strong> Too wet - Risk of root rot, reduce watering</li>
            </ul>
            <p>The optimal range varies by plant type. Succulents prefer 20-40%, while tropical plants like 50-70%.</p>
        `;
    }
    
    getPHParameterInfo() {
        return `
            <p>Soil pH affects nutrient availability and plant health. Most plants prefer slightly acidic to neutral soil:</p>
            <ul>
                <li><strong>pH 3.0-5.5:</strong> Very acidic - May cause nutrient deficiencies</li>
                <li><strong>pH 5.5-6.5:</strong> Slightly acidic - Preferred by many plants like blueberries and azaleas</li>
                <li><strong>pH 6.0-7.0:</strong> Optimal range - Best for most houseplants and vegetables</li>
                <li><strong>pH 7.0-7.5:</strong> Slightly alkaline - Still acceptable for most plants</li>
                <li><strong>pH 7.5+:</strong> Alkaline - May cause iron deficiency and yellowing leaves</li>
            </ul>
            <p>pH affects how well plants can absorb nutrients. Even if nutrients are present, the wrong pH can make them unavailable to your plant.</p>
        `;
    }
    
    getTemperatureParameterInfo() {
        return `
            <p>Soil temperature affects root growth, nutrient uptake, and overall plant health:</p>
            <ul>
                <li><strong>Below 10°C:</strong> Too cold - Root growth slows, risk of cold damage</li>
                <li><strong>10-15°C:</strong> Cool - Slow growth, most plants dormant</li>
                <li><strong>15-25°C:</strong> Optimal - Perfect for most houseplants and active growth</li>
                <li><strong>25-30°C:</strong> Warm - Good for tropical plants, monitor water needs</li>
                <li><strong>Above 30°C:</strong> Too hot - Risk of root damage and increased water stress</li>
            </ul>
            <p>Soil temperature is usually more stable than air temperature but follows similar patterns. Root health depends heavily on consistent and appropriate temperatures.</p>
        `;
    }
    
    getPHRecommendation() {
        const ph = this.sensorData.ph.current;
        if (ph < 5.5) {
            return "pH is too acidic. Consider adding lime or wood ash to raise pH. Check with pH strips before making adjustments.";
        } else if (ph > 7.5) {
            return "pH is too alkaline. Consider adding sulfur, peat moss, or acidic fertilizer to lower pH gradually.";
        } else {
            return "pH is in the optimal range for most plants. Maintain current soil conditions.";
        }
    }
    
    // Status information methods for recommendation modals
    getWateringStatusInfo() {
        const moisture = this.sensorData.moisture.current;
        let statusClass, statusText;
        
        if (moisture < 30) {
            statusClass = 'critical';
            statusText = 'Needs Water';
        } else if (moisture > 70) {
            statusClass = 'warning';
            statusText = 'Too Wet';
        } else {
            statusClass = 'good';
            statusText = 'Optimal Moisture';
        }
        
        return `
            <div class="status-indicator ${statusClass}">
                <span>${statusText}</span>
            </div>
            <p>Current soil moisture: <strong>${Math.round(moisture)}%</strong></p>
            <p>Optimal range: <strong>30-70%</strong></p>
        `;
    }
    
    getLightStatusInfo() {
        const light = this.sensorData.light.current;
        let statusClass, statusText;
        
        if (light < 300) {
            statusClass = 'warning';
            statusText = 'Low Light';
        } else if (light > 700) {
            statusClass = 'warning';
            statusText = 'Very Bright';
        } else {
            statusClass = 'good';
            statusText = 'Good Light';
        }
        
        return `
            <div class="status-indicator ${statusClass}">
                <span>${statusText}</span>
            </div>
            <p>Current light level: <strong>${Math.round(light)} lux</strong></p>
            <p>Optimal range: <strong>300-700 lux</strong></p>
        `;
    }
    
    getTemperatureStatusInfo() {
        const temp = this.sensorData.temperature.current;
        let statusClass, statusText;
        
        if (temp < 18) {
            statusClass = 'warning';
            statusText = 'Too Cool';
        } else if (temp > 25) {
            statusClass = 'warning';
            statusText = 'Too Warm';
        } else {
            statusClass = 'good';
            statusText = 'Perfect Temperature';
        }
        
        return `
            <div class="status-indicator ${statusClass}">
                <span>${statusText}</span>
            </div>
            <p>Current temperature: <strong>${Math.round(temp)}°C</strong></p>
            <p>Optimal range: <strong>18-25°C</strong></p>
        `;
    }
    
    // Detailed information methods
    getDetailedWateringInfo() {
        const moisture = this.sensorData.moisture.current;
        
        if (moisture < 20) {
            return `
                <div class="action-steps">
                    <h4>Immediate Action Required</h4>
                    <p>Your plant needs water immediately. Follow these steps:</p>
                </div>
                <ol>
                    <li>Water slowly until water drains from the bottom</li>
                    <li>Check soil moisture after 30 minutes</li>
                    <li>If still dry, water again lightly</li>
                    <li>Monitor daily until moisture stabilizes</li>
                </ol>
                <p><strong>Warning:</strong> Severely dry soil can repel water. Water slowly to ensure proper absorption.</p>
            `;
        } else if (moisture > 80) {
            return `
                <div class="action-steps">
                    <h4>Reduce Watering</h4>
                    <p>Soil is too wet and may cause root rot:</p>
                </div>
                <ol>
                    <li>Stop watering immediately</li>
                    <li>Ensure proper drainage holes</li>
                    <li>Improve air circulation around plant</li>
                    <li>Wait for soil to dry to 60-70% before next watering</li>
                    <li>Check for signs of root rot (mushy roots, bad smell)</li>
                </ol>
                <p><strong>Prevention:</strong> Always check soil moisture before watering.</p>
            `;
        } else {
            return `
                <p>Your watering schedule is working well! Here's how to maintain optimal moisture:</p>
                <ul>
                    <li>Check soil moisture every 2-3 days</li>
                    <li>Water when moisture drops to 30-40%</li>
                    <li>Water thoroughly but allow for drainage</li>
                    <li>Adjust frequency based on season and temperature</li>
                </ul>
                <p><strong>Tip:</strong> Plants need less water in winter and more in summer.</p>
            `;
        }
    }
    
    getDetailedLightInfo() {
        const light = this.sensorData.light.current;
        
        if (light < 200) {
            return `
                <div class="action-steps">
                    <h4>Increase Light Exposure</h4>
                    <p>Your plant needs more light for healthy growth:</p>
                </div>
                <ul>
                    <li>Move closer to a bright window (within 3 feet)</li>
                    <li>Consider a grow light (LED recommended)</li>
                    <li>Clean windows to maximize light transmission</li>
                    <li>Use light-colored reflective surfaces nearby</li>
                    <li>Rotate plant weekly for even light exposure</li>
                </ul>
                <p><strong>Note:</strong> Increase light gradually to avoid shock.</p>
            `;
        } else if (light > 800) {
            return `
                <div class="action-steps">
                    <h4>Reduce Light Intensity</h4>
                    <p>Too much direct light can burn leaves:</p>
                </div>
                <ul>
                    <li>Move away from direct sunlight</li>
                    <li>Use sheer curtains to filter light</li>
                    <li>Place plant 3-6 feet from window</li>
                    <li>Watch for signs of light burn (brown, crispy leaves)</li>
                    <li>Consider east or north-facing windows</li>
                </ul>
                <p><strong>Tip:</strong> Morning sun is gentler than afternoon sun.</p>
            `;
        } else {
            return `
                <p>Your plant is receiving excellent light! Here's how to maintain it:</p>
                <ul>
                    <li>Keep plant in current location</li>
                    <li>Monitor for seasonal changes in light</li>
                    <li>Rotate plant weekly for even growth</li>
                    <li>Clean leaves monthly for better light absorption</li>
                    <li>Watch for stretching (move closer) or burning (move further)</li>
                </ul>
                <p><strong>Seasonal tip:</strong> You may need to move plants closer to windows in winter.</p>
            `;
        }
    }
    
    getDetailedTemperatureInfo() {
        const temp = this.sensorData.temperature.current;
        
        if (temp < 15) {
            return `
                <div class="action-steps">
                    <h4>Warm Up Your Plant</h4>
                    <p>Cold temperatures slow growth and can damage plants:</p>
                </div>
                <ul>
                    <li>Move away from cold windows or drafts</li>
                    <li>Use a space heater nearby (not directly on plant)</li>
                    <li>Insulate pot with decorative cover</li>
                    <li>Reduce watering (cold plants need less water)</li>
                    <li>Avoid temperature fluctuations</li>
                </ul>
                <p><strong>Warning:</strong> Sudden temperature changes can shock plants.</p>
            `;
        } else if (temp > 30) {
            return `
                <div class="action-steps">
                    <h4>Cool Down Your Plant</h4>
                    <p>High temperatures increase water stress and can damage plants:</p>
                </div>
                <ul>
                    <li>Move away from heat sources (heaters, direct sun)</li>
                    <li>Increase humidity around plant</li>
                    <li>Ensure good air circulation</li>
                    <li>Water more frequently but don't overwater</li>
                    <li>Use mulch to insulate soil</li>
                </ul>
                <p><strong>Tip:</strong> Higher temperatures mean faster water evaporation.</p>
            `;
        } else {
            return `
                <p>Perfect temperature for healthy growth! Here's how to maintain it:</p>
                <ul>
                    <li>Keep plant away from heating/cooling vents</li>
                    <li>Avoid placing near windows in extreme weather</li>
                    <li>Maintain consistent temperatures</li>
                    <li>Monitor seasonal changes</li>
                    <li>Group plants together for stable microclimate</li>
                </ul>
                <p><strong>Ideal range:</strong> Most houseplants thrive in 18-25°C (65-77°F).</p>
            `;
        }
    }
    
    // Care tips methods
    getWateringCareTips() {
        return `
            <ul>
                <li><strong>Finger test:</strong> Stick your finger 1-2 inches into soil to check moisture</li>
                <li><strong>Drainage:</strong> Always ensure pots have drainage holes</li>
                <li><strong>Water quality:</strong> Use filtered or distilled water if your tap water is heavily chlorinated</li>
                <li><strong>Time of day:</strong> Water in the morning so plants can absorb water during the day</li>
                <li><strong>Seasonal adjustments:</strong> Water less in winter, but more in summer</li>
                <li><strong>Plant-specific:</strong> Research your specific plant's water needs</li>
                <li><strong>Signs of overwatering:</strong> Yellow leaves, musty smell, and fungus gnats</li>
                <li><strong>Signs of underwatering:</strong> Wilting, dry crispy leaves, and soil pulling away from pot</li>
            </ul>
        `;
    }
    
    getLightCareTips() {
        return `
            <ul>
                <li><strong>Window direction:</strong> South = brightest, North = lowest, East/West = moderate</li>
                <li><strong>Distance matters:</strong> Light intensity decreases rapidly with distance from windows</li>
                <li><strong>Seasonal changes:</strong> Sun angle changes throughout the year</li>
                <li><strong>Artificial light:</strong> LED grow lights are energy-efficient and effective</li>
                <li><strong>Light duration:</strong> Most plants need 12-16 hours of light daily</li>
                <li><strong>Signs of too little light:</strong> Leggy growth, pale leaves, and slow growth</li>
                <li><strong>Signs of too much light:</strong> Brown/white spots on leaves and wilting despite moist soil</li>
                <li><strong>Acclimation:</strong> Gradually increase light when moving plants to brighter spots</li>
            </ul>
        `;
    }
    
    getTemperatureCareTips() {
        return `
            <ul>
                <li><strong>Consistency is key:</strong> Avoid rapid temperature changes</li>
                <li><strong>Nighttime drop:</strong> Many plants prefer 5-10°F cooler temperatures at night</li>
                <li><strong>Humidity correlation:</strong> Higher temperatures require higher humidity</li>
                <li><strong>Air circulation:</strong> Good airflow helps plants manage temperature stress</li>
                <li><strong>Microclimate:</strong> Group plants to create stable temperature zones</li>
                <li><strong>Monitor extremes:</strong> Check near windows, heaters, and AC vents</li>
                <li><strong>Winter care:</strong> Move plants away from cold windows</li>
                <li><strong>Summer care:</strong> Provide extra humidity and air circulation</li>
            </ul>
        `;
    }
}

// Initialize the plant monitor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const plantMonitor = new PlantMonitor();
    
    // Make it globally accessible for debugging
    window.plantMonitor = plantMonitor;
    
    // Add some additional interactive features
    addInteractiveFeatures();
});

// Additional interactive features
function addInteractiveFeatures() {
    // Add loading animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    document.querySelectorAll('.sensor-card, .recommendation-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Additional keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            // Allow enter/space to activate clickable elements
            if (e.target.classList.contains('sensor-card') || e.target.classList.contains('recommendation-card')) {
                e.preventDefault();
                e.target.click();
            }
        }
    });
}

// Add offline status styling and health status colors
const style = document.createElement('style');
style.textContent = `
    .status-dot.offline {
        background: #ff5722;
    }
    
    .status-badge.healthy {
        background: #4CAF50;
        color: white;
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }
    
    .status-badge.warning {
        background: #FF9800;
        color: white;
        box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
    }
    
    .status-badge.critical {
        background: #FF5722;
        color: white;
        box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
        animation: pulse-warning 2s infinite;
    }
    
    @keyframes pulse-warning {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
        }
        50% { 
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(255, 87, 34, 0.5);
        }
    }
`;
document.head.appendChild(style); 