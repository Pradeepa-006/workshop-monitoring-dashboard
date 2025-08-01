import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';
Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

function ChartPanel({ data }) {
  const [machine, setMachine] = useState("3D Printer");
  const [sensor, setSensor] = useState("temperature");

  const filtered = data.filter(d => d.machine_id === machine && d.sensor_type === sensor);

  const chartData = {
    labels: filtered.map(d => d.timestamp),
    datasets: [{
      label: `${machine} - ${sensor}`,
      data: filtered.map(d => d.sensor_value),
      borderColor: "#5E60CE",
      backgroundColor: "rgba(94,96,206,0.2)",
      fill: true,
      tension: 0.4,
    }]
  };

  return (
    <div className="chart-panel">
      <div className="dropdowns">
        <select onChange={(e) => setMachine(e.target.value)} value={machine}>
          <option>3D Printer</option>
          <option>CNC Mill</option>
          <option>Air Compressor</option>
        </select>
        <select onChange={(e) => setSensor(e.target.value)} value={sensor}>
          <option>temperature</option>
          <option>vibration</option>
          <option>current</option>
        </select>
      </div>
      <Line data={chartData} />
    </div>
  );
}

export default ChartPanel;
