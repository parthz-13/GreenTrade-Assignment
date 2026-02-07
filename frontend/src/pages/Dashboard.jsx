import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
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
        <p>Might be due to cold-start because of Render's free-tier infrastructure. If not resolved after 30s, please reload the website.</p>
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


  const certificationData = [
    { name: "Certified", value: certifiedCount, color: "#22C55E" },
    { name: "Pending", value: pendingCount, color: "#F59E0B" },
    { name: "Not Certified", value: notCertifiedCount, color: "#EF4444" },
  ].filter((item) => item.value > 0);

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
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.products_by_category}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Certification Status</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={certificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {certificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
