import React from 'react';
import './AlertBanner.css';

function AlertBanner({ machines }) {
  const criticalMachine = machines.find(
    m => m.temperature > 85 || m.vibration > 5 || m.current > 15
  );

  if (!criticalMachine) return null;

  return (
    <div className="alert">
      ⚠️ {criticalMachine.name} is in Critical state!
    </div>
  );
}

export default AlertBanner;
