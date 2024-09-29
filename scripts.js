// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIuQ9cSsOyBdxzRsFUUG1cxEEwAVMQ3Uw",
    authDomain: "datameasuringdb.firebaseapp.com",
    databaseURL: "https://datameasuringdb-default-rtdb.firebaseio.com",
    projectId: "datameasuringdb",
    storageBucket: "datameasuringdb.appspot.com",
    messagingSenderId: "554867866432",
    appId: "1:554867866432:web:6a56c089f49aecd53ed8a5",
    measurementId: "G-SZJQ83WFP1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Reference to the sensor_data node
  const database = firebase.database();
  const sensorDataRef = database.ref('sensor_data');
  
  // Get buttons and display area
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const dataList = document.getElementById('dataList');
  
  // Variable to hold the Firebase listener reference
  let dataListener = null;

  // Chart.js setup
  const ctx = document.getElementById('sensorChart').getContext('2d');
  
  // Create a Chart.js line chart
  const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],  // X-axis labels (timestamps)
      datasets: [{
        label: 'Temperature',
        borderColor: 'rgb(255, 99, 132)',
        data: [],  // Temperature values
        fill: false
      }, {
        label: 'Humidity',
        borderColor: 'rgb(54, 162, 235)',
        data: [],  // Humidity values
        fill: false
      }, {
        label: 'Light Intensity',
        borderColor: 'rgb(255, 206, 86)',  // Yellow color for light intensity
        data: [],  // Light Intensity values
        fill: false
      }, {
        label: 'Height',
        borderColor: 'rgb(75, 192, 192)',  // Teal color for height
        data: [],  // Height values
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
            type: 'time',  // Use time scale for the X-axis
            time: {
              unit: 'day',  // Change this to 'auto' or 'day' to handle multiple days
              tooltipFormat: 'MMM d, yyyy, h:mm:ss a',  // Tooltip format for better readability
              displayFormats: {
                second: 'h:mm:ss a',  // How to display time for second-level granularity
                minute: 'h:mm a',     // For minute-level granularity
                hour: 'MMM d, h a',   // Hour-level granularity
                day: 'MMM d',         // Day-level granularity
              }
            },
          title: {
            display: true,
            text: 'Time'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });
  
  // Function to start fetching data
  function startFetching() {
    // Attach a listener to fetch data
    dataListener = sensorDataRef.on('child_added', (snapshot) => {
      const data = snapshot.val();
      addDataToChart(data);
    });
  
    // Disable Start button and enable Stop button
    startButton.disabled = true;
    stopButton.disabled = false;
  }
  
  // Function to stop fetching data
  function stopFetching() {
    // Remove the Firebase listener
    sensorDataRef.off('child_added', dataListener);
  
    // Disable Stop button and enable Start button
    startButton.disabled = false;
    stopButton.disabled = true;
  }
  
  // Function to add data to the chart
  function addDataToChart(data) {
    // Convert timestamp to Date object
    const timestamp = new Date(data.timestamp * 1000);
  
    // Add new data points to the chart
    sensorChart.data.labels.push(timestamp);
    sensorChart.data.datasets[0].data.push(data.temperature);  // Temperature
    sensorChart.data.datasets[1].data.push(data.humidity);  // Humidity
    sensorChart.data.datasets[2].data.push(data.lightIntensity);  // Light Intensity
    sensorChart.data.datasets[3].data.push(data.height);  // Height
  
    // Update the chart with the new data
    sensorChart.update();
  }
  
  // Add event listeners to the buttons
  startButton.addEventListener('click', startFetching);
  stopButton.addEventListener('click', stopFetching);