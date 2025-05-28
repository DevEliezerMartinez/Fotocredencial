import { Card, Progress, Divider } from "antd";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";

export default function ObjetivoCard() {
  const [data, setData] = useState({
    totalAlumnos: 0,
    registrados: 0,
    faltantes: 0,
    porcentaje: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("admin/objetivos");
        const { total_alumnos_visibles, total_registros, faltantes } = response.data;

        const totalAlumnos = total_alumnos_visibles || 0;
        const registrados = total_registros || 0;
        const faltantesCalculados = faltantes || 0;

        const porcentaje = totalAlumnos > 0 ? Math.round((registrados / totalAlumnos) * 100) : 0;

        setData({
          totalAlumnos: totalAlumnos,
          registrados: registrados,
          faltantes: faltantesCalculados,
          porcentaje: porcentaje,
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error("Error fetching objetivo data:", error);
        setData((prevData) => ({
          ...prevData,
          loading: false,
          error: true,
        }));
      }
    };

    fetchData();
  }, []);

  return (
    <Card
      title="🎯 Objetivo"
      style={{
        gridColumn: "3",
        gridRow: "1 / span 3",
        overflowY: "auto",
        padding: "16px",
        minHeight: "500px",
      }}
      loading={data.loading}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Objetivo
      </h2>

      <p style={{ fontSize: "0.9rem", marginBottom: "12px" }}>
        Total de alumnos: {data.totalAlumnos.toLocaleString()}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Progress type="dashboard" percent={data.porcentaje} />
      </div>

      <Divider />

      <p
        style={{
          fontWeight: "bold",
          fontSize: "0.95rem",
          marginBottom: "4px",
        }}
      >
        Registrados: {data.registrados.toLocaleString()}
      </p>
      <p style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
        Faltantes: {data.faltantes.toLocaleString()}
      </p>
    </Card>
  );
}