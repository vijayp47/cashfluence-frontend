import React from "react";

const AnalyticsPage = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 style={{ textAlign: "center" }}>Google Analytics Dashboard</h2>
      <iframe
        src="https://analytics.google.com/analytics/web/"
        width="100%"
        height="90%"
        style={{ border: "none" }}
        title="Google Analytics"
      />
    </div>
  );
};

export default AnalyticsPage;
