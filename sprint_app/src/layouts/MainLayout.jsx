import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import "./MainLayout.css";

export default function MainLayout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-root">
      <Sidebar collapsed={collapsed} />

      <div className="app-main" style={{ marginLeft: collapsed ? 78 : 230 }}>
        <TopBar title={title} onToggleSidebar={() => setCollapsed((s) => !s)} />
        <main className="layout-page-content">
          <div className="page-content-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
