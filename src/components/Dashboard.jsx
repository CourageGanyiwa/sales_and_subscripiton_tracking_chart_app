import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Chart } from "react-charts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetchMetrics();
    console.log("Fetched metrics:", metrics);
  }, []);

  console.log("Processed metrics:", metricsArray);

  async function fetchMetrics() {
    try {
      const response = await supabase
        .from("sales_deals")
        .select(` name, total:value.sum()`)
        .order("name", { ascending: false })
        .limit(6);

      const { data, error } = response;

      if (error) {
        throw error;
      }

      const metricsArray = await (async () => {
        const totals = data.reduce((acc, item) => {
          if (!acc[item.name]) acc[item.name] = 0;
          acc[item.name] += Number(item.value) || 0;
          return acc;
        }, {});
        return Object.entries(totals).map(([name, total]) => ({
          name,
          total,
        }));
      })();

      console.log("Processed metrics:", metricsArray);
      console.log("Fetched data:", data);
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error.message);
      return;
    }
  }

  const y_max = React.useMemo(() => {
    if (!metrics.length) return undefined;

    const values = metrics.map((m) => Number(m.total)).filter((v) => !isNaN(v));
    if (!values.length) return undefined;

    return Math.max(...values) + 2000;
  }, [metrics]);

  const chartData = [
    {
      data: metrics.map((metric) => ({
        primary: metric.name,
        secondary: metric.total,
      })),
    },
  ];

  const primaryAxis = {
    getValue: (d) => d.primary,
    scaleType: "band",
    padding: 0.2,
    position: "bottom",
  };

  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: "linear",
      min: 0,
      ...(y_max > 0 && { max: Number(y_max) }),
      padding: {
        top: 20,
        bottom: 40,
      },
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2
          style={{
            color: "#333",
          }}
        >
          Total Sales This Quarter
        </h2>
        <div style={{ flex: 1 }}>
          {metrics.length > 0 ? (
            <Chart
              options={{
                data: chartData,
                primaryAxis,
                secondaryAxes,
                type: "bar",
                defaultColors: ["#58d675"],
                tooltip: {
                  show: false,
                },
              }}
            />
          ) : (
            <div>
              <div className="text-center mt-10">Loading chart...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
