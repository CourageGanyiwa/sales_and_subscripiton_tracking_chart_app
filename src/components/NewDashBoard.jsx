import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase-client";
import { Chart } from "react-charts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Fetch data and calculate totals
  async function fetchMetrics() {
    try {
      setLoading(true);

      // 1️⃣ Fetch raw data from Supabase
      const { data, error } = await supabase
        .from("sales_deals")
        .select("name, value"); // ensure columns exist

      if (error) throw error;
      if (!data || data.length === 0) {
        setMetrics([]);
        setLoading(false);
        return;
      }

      console.log("Raw data from Supabase:", data);

      // 2️⃣ Aggregate totals per name
      const totals = data.reduce((acc, item) => {
        if (!acc[item.name]) acc[item.name] = 0;
        acc[item.name] += Number(item.value) || 0;
        return acc;
      }, {});

      const metricsArray = Object.entries(totals).map(([name, total]) => ({
        name,
        total,
      }));

      console.log("Processed metrics:", metricsArray);

      // 3️⃣ Update state
      setMetrics(metricsArray);
    } catch (error) {
      console.error("Error fetching metrics:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // Calculate max value for Y-axis
  const y_max = useMemo(() => {
    if (!metrics.length) return undefined;
    const values = metrics.map((m) => Number(m.total)).filter((v) => !isNaN(v));
    return values.length ? Math.max(...values) + 2000 : undefined;
  }, [metrics]);

  // Chart data
  const chartData = useMemo(
    () => [
      {
        data: metrics.map((metric) => ({
          primary: metric.name,
          secondary: Number(metric.total) || 0,
        })),
      },
    ],
    [metrics]
  );

  console.log(chartData);

  // X-axis
  const primaryAxis = useMemo(
    () => ({
      getValue: (d) => d.primary,
      scaleType: "band",
      padding: 0.2,
      position: "bottom",
    }),
    []
  );

  // Y-axis
  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (d) => d.secondary,
        scaleType: "linear",
        min: 0,
        ...(y_max !== undefined && y_max > 0 ? { max: y_max } : {}),
        padding: { top: 20, bottom: 40 },
      },
    ],
    [y_max]
  );

  console.log(primaryAxis, secondaryAxes);

  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2 style={{ color: "#333" }}>Total Sales This Quarter</h2>
        <div style={{ flex: 1, height: "400px" }}>
          {loading ? (
            <div className="text-center mt-10">Loading chart...</div>
          ) : metrics.length > 0 ? (
            <Chart
              options={{
                data: chartData,
                primaryAxis,
                secondaryAxes,
                type: "bar",
                defaultColors: ["#05b22dff"],
                tooltip: { show: false },
              }}
            />
          ) : (
            <div className="text-center mt-10">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
