import React from "react";

const AnalyticsPage = () => {
  const openAnalytics = () => {
    window.open("https://analytics.google.com/analytics/web/", "_blank");
  };

  return (
    <div style={{ width: "100%", height: "100vh", textAlign: "center", paddingTop: "20px" }}>
      <h2>Google Analytics Dashboard</h2>
      <button
        onClick={openAnalytics}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Open Google Analytics
      </button>
    </div>
  );
};

export default AnalyticsPage;
