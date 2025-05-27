// components/IncidenciasEstudiantesCard.jsx
import { Card } from "antd";
import { useState, useEffect } from "react";

export default function IncidenciasEstudiantesCard() {
  const [data, setData] = useState({ total: 0, loading: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reemplaza con tu endpoint
        const response = await fetch('/api/incidencias-estudiantes');
        const result = await response.json();
        setData({ total: result.total, loading: false });
      } catch (error) {
        console.error('Error fetching estudiantes data:', error);
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