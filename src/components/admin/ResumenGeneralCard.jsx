// components/ResumenGeneralCard.jsx
import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
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
  const [data, setData] = useState({ loading: true, chartData: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reemplaza con tu endpoint
        const response = await fetch('/api/resumen-general');
        const result = await response.json();
        
        setData({ 
          loading: false, 
          chartData: {
            labels: result.labels || ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
            datasets: [{
              label: result.label || "Estadísticas 2024",
              data: result.data || [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 205, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 205, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            }]
          }
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
        // Datos por defecto en caso de error
        setData({ 
          loading: false, 
          chartData: {
            labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
            datasets: [{
              label: "Estadísticas 2024",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 205, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 205, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            }]
          }
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.chartData || data.loading) return;

    const createChart = () => {
      if (!chartRef.current) return;

      const ctx = chartRef.current.getContext("2d");

      // Destruir gráfica anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      // Asegurarse de que no hay charts existentes en este canvas
      const existingChart = ChartJS.getChart(chartRef.current);
      if (existingChart) {
        existingChart.destroy();
      }

      // Crear nueva gráfica
      chartInstance.current = new ChartJS(ctx, {
        type: "bar",
        data: data.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Estadísticas Mensuales",
              font: {
                size: 14
              }
            },
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 12
                }
              }
            },
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 11
                }
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 11
                }
              }
            },
          },
          layout: {
            padding: {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
            }
          }
        },
      });
    };

    createChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
      
      if (chartRef.current) {
        const existingChart = ChartJS.getChart(chartRef.current);
        if (existingChart) {
          existingChart.destroy();
        }
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
        border: "1px solid red",
      }}
      styles={{
        body: {
          padding: "16px",
          height: "calc(100% - 60px)", // Resta la altura del header
          overflow: "hidden",
        }
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