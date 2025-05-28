import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
import apiClient from "@/lib/axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

export default function ResumenGeneralCard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState({
    loading: true,
    chartData: null,
    error: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("admin/resumen");
        const rawData = response.data;

        // Crear etiquetas y datasets
        const labels = rawData.map((item) => item.plantel);
        const totalAlumnos = rawData.map((item) => item.total_alumnos);
        const totalRegistros = rawData.map((item) => item.total_registros);

        const chartData = {
          labels,
          datasets: [
            {
              label: "Total Alumnos",
              data: totalAlumnos,
              backgroundColor: "#1890ff9c",
            },
            {
              label: "Total Registros",
              data: totalRegistros,
              backgroundColor: "#6be450",
            },
          ],
        };

        setData({
          chartData,
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error("Error fetching objetivo data:", error);
        setData({
          chartData: null,
          loading: false,
          error: true,
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.chartData || data.loading) return;

    const createChart = () => {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      chartInstance.current = new ChartJS(ctx, {
        type: "bar",
        data: data.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Resumen por Plantel",
              font: { size: 16 },
            },
            legend: {
              display: true,
              position: "top",
              labels: { font: { size: 12 } },
            },
          },
          scales: {
            x: {
              stacked: false,
              ticks: { font: { size: 11 } },
            },
            y: {
              beginAtZero: true,
              ticks: { font: { size: 11 } },
            },
          },
        },
      });
    };

    createChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <Card
      title="📌 Resumen general"
      style={{
        gridColumn: "1 / span 2",
        gridRow: "2 / span 2",
        height: "100%",
      }}
      styles={{
        body: {
          padding: "16px",
          height: "calc(100% - 60px)",
          overflow: "hidden",
        },
      }}
      loading={data.loading}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            minWidth: "400px",
            width: "100%",
            height: "280px",
            padding: "8px",
          }}
        >
          <canvas
            ref={chartRef}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    </Card>
  );
}
