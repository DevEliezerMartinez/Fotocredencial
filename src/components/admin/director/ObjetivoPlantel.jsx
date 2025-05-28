import { Card, Divider, Progress, Typography } from "antd";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/axios";
import { useParams } from "react-router-dom";


function DetallesCarrera() {
    const { slug } = useParams();

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
        const response = await apiClient.get(`admin/objetivos/${slug}`);
        const { total_alumnos_visibles, alumnos_con_registro, faltantes } = response.data;

        const totalAlumnos = total_alumnos_visibles || 0;
        const registrados = alumnos_con_registro || 0;
        const faltantesCalculados = faltantes || 0;

        const porcentaje = totalAlumnos > 0 ? Math.round((registrados / totalAlumnos) * 100) : 0;

        setData({
          totalAlumnos: totalAlumnos,
          registrados: alumnos_con_registro,
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
    <div
      style={{
        gridColumn: "5 / span 2",
        gridRow: "2 / span 2",
        border: "1px solid #d9d9d9",
      }}
    >
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          minHeight: "430px",
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
