import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase-client";
import { Chart } from "react-charts";
import Form from "../Form";

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();

    const channel = supabase
      .channel("deal-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_deals",
        },
        (payload) => {
          // Action
          console.log(payload.new);
          console.log("Event:", payload.eventType);
          console.log("New:", payload.new);
          console.log("Old:", payload.old);
        }
      )
      .subscribe((status) => {
        console.log("subscription status:", status);
      });

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
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
    <div className="dashboard-wrapper grid grid-cols-1 place-items-center">
      <div className="chart-container w-3/4">
        <h2 className="text-2xl text-black my-5 text-center">
          Total Sales This Quarter
        </h2>
        <div style={{ flex: 1, height: "300px" }}>
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
            <div className="text-center mt5">No data available</div>
          )}
        </div>
      </div>
      <Form metrics={metrics} />
    </div>
  );
};

export default Dashboard;
