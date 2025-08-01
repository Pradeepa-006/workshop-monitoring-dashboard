import React from 'react';
import './MachineCard.css';

const getStatus = ({ temperature, vibration, current }) => {
  if (temperature > 85 || vibration > 5 || current > 15) return 'Critical';
  if (temperature > 65 || vibration > 3 || current > 12) return 'Warning';
  return 'Normal';
};

const statusColors = {
  Normal: 'green',
  Warning: 'orange',
  Critical: 'red'
};

function MachineCard({ name, temperature, vibration, current }) {
  const status = getStatus({ temperature, vibration, current });

  return (
    <div className="machine-card">
      <h3>{name}</h3>
      <span className={`status ${status.toLowerCase()}`}>{status}</span>
      <p>Temperature: {temperature} °C</p>
      <p>Vibration: {vibration}</p>
      <p>Current: {current} A</p>
    </div>
  );
}

export default MachineCard;
