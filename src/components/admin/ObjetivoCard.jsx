// components/ObjetivoCard.jsx
import { Card, Progress, Divider } from "antd";
import { useState, useEffect } from "react";

export default function ObjetivoCard() {
  const [data, setData] = useState({ 
    totalAlumnos: 0, 
    registrados: 0, 
    faltantes: 0, 
    porcentaje: 0, 
    loading: true,
    error: false
  });

  useEffect(() => {
    // Simular llamada a API con setTimeout
    const fetchDataSimulada = () => {
      setTimeout(() => {
        // Datos simulados que el API retornaría
        const result = {
          totalAlumnos: 45000,
          registrados: 22500,
        };

        const porcentaje = Math.round((result.registrados / result.totalAlumnos) * 100);

        setData({
          totalAlumnos: result.totalAlumnos,
          registrados: result.registrados,
          faltantes: result.totalAlumnos - result.registrados,
          porcentaje,
          loading: false,
          error: false
        });
      }, 1500); // Simula retraso de 1.5 segundos
    };

    fetchDataSimulada();
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
