// import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Tooltip,
//   Filler,
// } from "chart.js";
// import "./App.css";

// Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

// const App = () => {
//   const [activeTab, setActiveTab] = useState("Dashboard");
//   const [data, setData] = useState([]);
//   const [latest, setLatest] = useState({});
//   const [machine, setMachine] = useState("3D Printer");
//   const [sensor, setSensor] = useState("temperature");

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchData = async () => {
//     const res = await fetch("/sensor_data.json");
//     const json = await res.json();
//     setData(json);

//     const grouped = {};
//     json.forEach((row) => {
//       const { machine_id, sensor_type, sensor_value } = row;
//       if (!grouped[machine_id]) grouped[machine_id] = {};
//       grouped[machine_id][sensor_type] = sensor_value;
//     });

//     setLatest(grouped);
//   };

//   const getStatus = ({ temperature = 0, vibration = 0, current = 0 }) => {
//     if (temperature > 85 || vibration > 5 || current > 15) return "Critical";
//     if (temperature > 65 || vibration > 3 || current > 12) return "Warning";
//     return "Normal";
//   };

//   const machines = ["3D Printer", "CNC Mill", "Air Compressor"];

//   const filtered =
//     Array.isArray(data) &&
//     data.filter(
//       (d) => d.machine_id === machine && d.sensor_type === sensor
//     );

//   const chartData = {
//     labels: filtered.map((d) => d.timestamp),
//     datasets: [
//       {
//         label: `${machine} - ${sensor}`,
//         data: filtered.map((d) => d.sensor_value),
//         borderColor: "#5E60CE",
//         backgroundColor: "rgba(94,96,206,0.2)",
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   return (
//     <div className="app-layout">
//       <div className="sidebar">
//         <h2>Workshop-Watch</h2>
//         {["Dashboard", "Machine Logs", "Settings"].map((tab) => (
//           <div
//             key={tab}
//             className={`tab ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </div>
//         ))}
//       </div>
//       <div className="content">
//       <div className="main-panel">
//         {activeTab === "Dashboard" && (
//           <>
//             <h1>Dashboard</h1>
//             <div className="card-grid">
//               {machines.map((machineId) => {
//                 const sensors = latest[machineId] || {};
//                 const status = getStatus(sensors);
//                 return (
//                   <div
//                     key={machineId}
//                     className={`card ${status.toLowerCase()}`}
//                   >
//                     <h3>{machineId}</h3>
//                     <p className="status-label">{status}</p>
//                     <p>🌡️ Temperature: {sensors.temperature ?? 0} °C</p>
//                     <p>🔊 Vibration: {sensors.vibration ?? 0}</p>
//                     <p>⚡ Current: {sensors.current ?? 0} A</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="chart-box">
//               <div className="dropdowns">
//                 <select
//                   value={machine}
//                   onChange={(e) => setMachine(e.target.value)}
//                 >
//                   {machines.map((m) => (
//                     <option key={m}>{m}</option>
//                   ))}
//                 </select>
//                 <select
//                   value={sensor}
//                   onChange={(e) => setSensor(e.target.value)}
//                 >
//                   <option value="temperature">Temperature</option>
//                   <option value="vibration">Vibration</option>
//                   <option value="current">Current</option>
//                 </select>
//               </div>
//               <Line data={chartData} />
//             </div>
//           </>
//         )}

//         {activeTab === "Machine Logs" && (
//           <h2>Machine Logs Page (Coming Soon)</h2>
//         )}
//         {activeTab === "Settings" && <h2>Settings Page (Coming Soon)</h2>}
//       </div>
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  AlertTriangle, 
  Activity, 
  Upload, 
  Download, 
  Settings, 
  Wifi, 
  WifiOff,
  Clock,
  TrendingUp,
  FileText,
  Bell
} from 'lucide-react';
import './App.css';

const WorkshopWatch = () => {
  // State management
  const [machines, setMachines] = useState({
    '3d_printer': {
      name: '3D Printer',
      status: 'normal',
      temperature: 45,
      vibration: 0.2,
      current: 2.1,
      lastUpdate: new Date(),
      healthScore: 85
    },
    'cnc_mill': {
      name: 'CNC Mill',
      status: 'warning',
      temperature: 68,
      vibration: 0.8,
      current: 5.2,
      lastUpdate: new Date(),
      healthScore: 72
    },
    'air_compressor': {
      name: 'Air Compressor',
      status: 'critical',
      temperature: 78,
      vibration: 1.2,
      current: 8.5,
      lastUpdate: new Date(),
      healthScore: 45
    }
  });

  const [historicalData, setHistoricalData] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('3d_printer');
  const [selectedSensor, setSelectedSensor] = useState('temperature');
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [maintenanceLogs, setMaintenanceLogs] = useState({});
  const [newLogEntry, setNewLogEntry] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef(null);

  // Thresholds configuration
  const thresholds = {
    temperature: { warning: 60, critical: 75 },
    vibration: { warning: 0.5, critical: 1.0 },
    current: { warning: 6.0, critical: 8.0 }
  };

  // Generate mock historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 59; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60000);
        Object.keys(machines).forEach(machineId => {
          const machine = machines[machineId];
          data.push({
            timestamp: timestamp.toISOString(),
            machine_id: machineId,
            machine_name: machine.name,
            temperature: machine.temperature + (Math.random() - 0.5) * 10,
            vibration: Math.max(0, machine.vibration + (Math.random() - 0.5) * 0.3),
            current: Math.max(0, machine.current + (Math.random() - 0.5) * 2)
          });
        });
      }
      setHistoricalData(data);
    };

    generateHistoricalData();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(machineId => {
          const machine = updated[machineId];
          // Simulate sensor fluctuations
          machine.temperature += (Math.random() - 0.5) * 2;
          machine.vibration = Math.max(0, machine.vibration + (Math.random() - 0.5) * 0.1);
          machine.current = Math.max(0, machine.current + (Math.random() - 0.5) * 0.5);
          machine.lastUpdate = new Date();
          
          // Update status based on thresholds
          const tempStatus = getStatusFromValue(machine.temperature, 'temperature');
          const vibStatus = getStatusFromValue(machine.vibration, 'vibration');
          const currentStatus = getStatusFromValue(machine.current, 'current');
          
          const statuses = [tempStatus, vibStatus, currentStatus];
          if (statuses.includes('critical')) machine.status = 'critical';
          else if (statuses.includes('warning')) machine.status = 'warning';
          else machine.status = 'normal';
          
          // Calculate health score
          machine.healthScore = calculateHealthScore(machine);
        });
        return updated;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const getStatusFromValue = (value, sensorType) => {
    const threshold = thresholds[sensorType];
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning) return 'warning';
    return 'normal';
  };

  const calculateHealthScore = (machine) => {
    const tempScore = Math.max(0, 100 - (machine.temperature / thresholds.temperature.critical) * 100);
    const vibScore = Math.max(0, 100 - (machine.vibration / thresholds.vibration.critical) * 100);
    const currentScore = Math.max(0, 100 - (machine.current / thresholds.current.critical) * 100);
    
    return Math.round(0.4 * tempScore + 0.3 * vibScore + 0.3 * currentScore);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getFilteredChartData = () => {
    return historicalData
      .filter(d => d.machine_id === selectedMachine)
      .map(d => ({
        time: formatTimestamp(d.timestamp),
        value: d[selectedSensor],
        timestamp: d.timestamp
      }))
      .slice(-20); // Show last 20 data points
  };

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   // Here you would typically send the file to your backend
  //   // For demo purposes, we'll just show a success message
  //   console.log('File uploaded:', file.name);
  //   alert(`File "${file.name}" uploaded successfully! The backend will process this data.`);

  //   setShowUpload(false);
  // };

  const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    alert(`✅ ${result.message || 'File uploaded successfully!'}`);
  } catch (error) {
    console.error(error);
    alert('❌ Error uploading file.');
  }

  setShowUpload(false);
};


  const exportReport = () => {
    // Simulate PDF export
    alert('Report export feature would generate a PDF with current machine status and alerts.');
  };

  const addMaintenanceLog = (machineId) => {
    if (!newLogEntry.trim()) return;
    
    setMaintenanceLogs(prev => ({
      ...prev,
      [machineId]: [
        ...(prev[machineId] || []),
        {
          timestamp: new Date().toISOString(),
          note: newLogEntry,
          operator: 'Current User'
        }
      ]
    }));
    setNewLogEntry('');
  };

 const MachineCard = ({ machineId, machine }) => (
  <div className={`machine-card machine-card--${machine.status}`}>
    <div className="machine-card__header">
      <h3 className="machine-card__title">{machine.name}</h3>
      <div className="machine-card__status">
        <div className={`status-indicator status-indicator--${machine.status}`}></div>
        <span className="status-text">{machine.status}</span>
      </div>
    </div>

    <div className="sensor-grid">
      <div className="sensor-item">
        <div className="sensor-value">{machine.temperature.toFixed(1)}°C</div>
        <div className="sensor-label">Temperature</div>
      </div>
      <div className="sensor-item">
        <div className="sensor-value">{machine.vibration.toFixed(2)}g</div>
        <div className="sensor-label">Vibration</div>
      </div>
      <div className="sensor-item">
        <div className="sensor-value">{machine.current.toFixed(1)}A</div>
        <div className="sensor-label">Current</div>
      </div>
    </div>

    <div className="health-section">
      <div className="health-score">
        <span className="health-label">Health Score:</span>
        <span className={`health-value health-value--${
          machine.healthScore > 70 ? 'good' :
          machine.healthScore > 40 ? 'warning' : 'critical'
        }`}>
          {machine.healthScore}%
        </span>
      </div>
      <div className="last-update">
        Last update: {machine.lastUpdate.toLocaleTimeString()}
      </div>
    </div>

    <div className="maintenance-section">
      <div className="maintenance-label">Add Maintenance Note:</div>
      <div className="maintenance-input-group">
        <input
          type="text"
          value={newLogEntry}
          onChange={(e) => setNewLogEntry(e.target.value)}
          className="maintenance-input"
          placeholder="Enter maintenance note..."
        />
        <button
          onClick={() => addMaintenanceLog(machineId)}
          className="btn btn--primary btn--small"
        >
          Add
        </button>
      </div>

      {maintenanceLogs[machineId] && maintenanceLogs[machineId].length > 0 && (
        <div className="maintenance-logs">
          {maintenanceLogs[machineId].slice(-2).map((log, idx) => (
            <div key={idx} className="maintenance-log-entry">
              <span className="log-timestamp">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>: {log.note}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);


  return (
    <div className="workshop-watch">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <Activity className="logo-icon" />
            <h1 className="app-title">Workshop-Watch</h1>
            <div className="connection-status">
              {isConnected ? (
                <Wifi className="connection-icon connection-icon--connected" />
              ) : (
                <WifiOff className="connection-icon connection-icon--disconnected" />
              )}
              <span className="connection-text">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="header-actions">
            <button
              onClick={() => setShowUpload(true)}
              className="btn btn--primary"
            >
              <Upload className="btn-icon" />
              <span>Upload Data</span>
            </button>
            <button
              onClick={exportReport}
              className="btn btn--success"
            >
              <Download className="btn-icon" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
  {/* Machine Status Cards */}
  <div className="machines-grid">
    {Object.entries(machines).map(([machineId, machine]) => (
      <MachineCard key={machineId} machineId={machineId} machine={machine} />
    ))}
  </div>
  
  {/* Charts Section */}
  <div className="charts-grid">
    
    {/* Historical Chart */}
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Historical Trends</h2>
        <div className="chart-controls">
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="select-input"
          >
            {Object.entries(machines).map(([id, machine]) => (
              <option key={id} value={id}>{machine.name}</option>
            ))}
          </select>
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="select-input"
          >
            <option value="temperature">Temperature</option>
            <option value="vibration">Vibration</option>
            <option value="current">Current</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={getFilteredChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Health Score Distribution */}
    <div className="chart-container">
      <h2 className="chart-title">Health Score Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={Object.entries(machines).map(([id, machine]) => ({
              name: machine.name,
              value: machine.healthScore,
              fill: machine.healthScore > 70 ? '#22c55e' : machine.healthScore > 40 ? '#f59e0b' : '#ef4444'
            }))}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Alerts Section */}
  <div className="alerts-section">
    <div className="alerts-header">
      <Bell className="alerts-icon" />
      <h2 className="alerts-title">Active Alerts</h2>
    </div>
    
    <div className="alerts-list">
      {Object.entries(machines)
        .filter(([_, machine]) => machine.status === 'critical' || machine.status === 'warning')
        .map(([machineId, machine]) => (
          <div key={machineId} className={`alert-item alert-item--${machine.status}`}>
            <div className="alert-content">
              <div className="alert-info">
                <AlertTriangle className={`alert-icon alert-icon--${machine.status}`} />
                <div className="alert-details">
                  <div className="alert-machine">{machine.name}</div>
                  <div className="alert-message">
                    {machine.status === 'critical' ? 'Critical' : 'Warning'} status detected
                  </div>
                </div>
              </div>
              <div className="alert-time">
                {machine.lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

      {Object.values(machines).every(machine => machine.status === 'normal') && (
        <div className="no-alerts">
          <Activity className="no-alerts-icon" />
          <div className="no-alerts-title">All Systems Normal</div>
          <div className="no-alerts-subtitle">No active alerts at this time</div>
        </div>
      )}
    </div>
  </div>
</main>


      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Upload Sensor Data</h3>
            <p className="modal-description">
              Upload Excel or JSON files with sensor data. Expected format: timestamp, machine_id, sensor_type, sensor_value
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.json,.csv"
              className="file-input"
            />
            
            <div className="modal-actions">
              <button
                onClick={() => setShowUpload(false)}
                className="btn btn--secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn--primary"
              >
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopWatch;