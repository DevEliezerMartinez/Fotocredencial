import { Card, Divider, Progress, Typography } from "antd";
import React, { useEffect, useState } from "react";

function DetallesCarrera() {
  const [data, setData] = useState({
    totalAlumnos: 0,
    registrados: 0,
    faltantes: 0,
    porcentaje: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    // Simular llamada a API con setTimeout
    const fetchDataSimulada = () => {
      setTimeout(() => {
        const result = {
          totalAlumnos: 45000,
          registrados: 22500,
        };

        const porcentaje = Math.round(
          (result.registrados / result.totalAlumnos) * 100
        );

        setData({
          totalAlumnos: result.totalAlumnos,
          registrados: result.registrados,
          faltantes: result.totalAlumnos - result.registrados,
          porcentaje,
          loading: false,
          error: false,
        });
      }, 1500);
    };

    fetchDataSimulada();
  }, []);

  return (
    <div
      style={{
        gridColumn: "3",
        gridRow: "2 / span 3",
      }}
    >
      <Card
        style={{
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography.Title
          level={2}
          style={{
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Objetivo
        </Typography.Title>

        <Typography.Text
          style={{
            display: "block",
            fontSize: 16,
            marginBottom: 24,
          }}
        >
          Total de alumnos: {data.totalAlumnos.toLocaleString()}
        </Typography.Text>

        <Progress
          type="dashboard"
          percent={data.porcentaje}
          style={{ marginBottom: 24 }}
        />

        <Divider style={{ width: "80%" }} />

        <div style={{ width: "100%", maxWidth: "300px" }}>
          <Typography.Text
            strong
            style={{
              display: "block",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Registrados: {data.registrados.toLocaleString()}
          </Typography.Text>

          <Typography.Text
            strong
            style={{
              display: "block",
              fontSize: 16,
            }}
          >
            Faltantes: {data.faltantes.toLocaleString()}
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}

export default DetallesCarrera;
