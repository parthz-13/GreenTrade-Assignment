import { useState, useEffect } from "react";
import { getAnalytics } from "../services/api";
import StatsCard from "../components/StatsCard";
import "./Dashboard.css";

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button className="btn btn-primary" onClick={loadAnalytics}>
          Retry
        </button>
      </div>
    );
  }

  const certifiedCount =
    analytics.products_by_certification.find(
      (c) => c.certification_status === "Certified",
    )?.count || 0;
  const pendingCount =
    analytics.products_by_certification.find(
      (c) => c.certification_status === "Pending",
    )?.count || 0;
  const notCertifiedCount =
    analytics.products_by_certification.find(
      (c) => c.certification_status === "Not Certified",
    )?.count || 0;

  const maxCategoryCount = Math.max(
    ...analytics.products_by_category.map((c) => c.count),
    1,
  );

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview of your sustainable supply chain
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Suppliers"
          value={analytics.total_suppliers}
          icon={<span>👥</span>}
          color="primary"
        />
        <StatsCard
          title="Total Products"
          value={analytics.total_products}
          icon={<span>📦</span>}
          color="info"
        />
        <StatsCard
          title="Certified Products"
          value={certifiedCount}
          icon={<span>✅</span>}
          color="success"
        />
        <StatsCard
          title="Pending Certification"
          value={pendingCount}
          icon={<span>⏳</span>}
          color="warning"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Products by Category</h3>
          <div className="bar-chart">
            {analytics.products_by_category.map((item, index) => (
              <div className="bar-item" key={index}>
                <div className="bar-label">{item.category}</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(item.count / maxCategoryCount) * 100}%`,
                    }}
                  >
                    <span className="bar-value">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Certification Status</h3>
          <div className="donut-chart">
            <div className="donut-visual">
              <svg viewBox="0 0 36 36" className="donut-svg">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeDasharray={`${(certifiedCount / Math.max(analytics.total_products, 1)) * 100} 100`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray={`${(pendingCount / Math.max(analytics.total_products, 1)) * 100} 100`}
                  strokeDashoffset={`${100 - (certifiedCount / Math.max(analytics.total_products, 1)) * 100 + 25}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeDasharray={`${(notCertifiedCount / Math.max(analytics.total_products, 1)) * 100} 100`}
                  strokeDashoffset={`${100 - ((certifiedCount + pendingCount) / Math.max(analytics.total_products, 1)) * 100 + 25}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="donut-center">
                <span className="donut-total">{analytics.total_products}</span>
                <span className="donut-label">Total</span>
              </div>
            </div>
            <div className="donut-legend">
              <div className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: "#22C55E" }}
                ></span>
                <span className="legend-label">Certified</span>
                <span className="legend-value">{certifiedCount}</span>
              </div>
              <div className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: "#F59E0B" }}
                ></span>
                <span className="legend-label">Pending</span>
                <span className="legend-value">{pendingCount}</span>
              </div>
              <div className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: "#EF4444" }}
                ></span>
                <span className="legend-label">Not Certified</span>
                <span className="legend-value">{notCertifiedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
