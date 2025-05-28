// components/IncidenciasEstudiantesCard.jsx
import { Card } from "antd";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios";


export default function IncidenciasEstudiantesCard() {
  const [data, setData] = useState({ total: 0, loading: true });

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await apiClient.get('admin/incidencias_estudiantes/total');
          setData({ total: response.data.total_incidencias_estudiantes, loading: false });
        } catch (error) {
          console.error('Error fetching plantel data:', error);
          setData({ total: 0, loading: false, error: true });
        }
      };
  
      fetchData();
    }, []);

  return (
    <Card
      title="👨‍🎓 Incidencias de estudiantes"
      style={{ gridColumn: "2", gridRow: "1" }}
      loading={data.loading}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <span
            className="montserrat"
            style={{
              fontWeight: "bold",
              fontSize: "2.5rem",
              display: "block",
            }}
          >
            {data.total}
          </span>
          <span style={{ color: "gray", fontSize: "0.8rem" }}>
            incidencias en total
          </span>
        </div>
      </div>
    </Card>
  );
}