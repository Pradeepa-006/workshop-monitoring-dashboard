import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="user-info">
        <img src="https://i.pravatar.cc/50" alt="user" />
        <h4>David Grey H</h4>
        <span>Project Manager</span>
      </div>
      <ul className="sidebar-menu">
        <li className="active">Dashboard</li>
        <li>Page Layouts</li>
        <li>Charts</li>
        <li>Forms</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
}
