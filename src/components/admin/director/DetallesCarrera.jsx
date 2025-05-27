import { Card, List, Progress } from "antd";
import React from "react";
import { Link } from "react-router-dom";

function DetallesCarrera() {
  // Datos simulados de carreras
  const carreras = [
    {
      id: 1,
      nombre: "Ingeniería de Software",
      progreso: 75,
      url: "/admin/carreras/ingenieria-software"
    },
    {
      id: 2,
      nombre: "Medicina",
      progreso: 40,
      url: "/admin/carreras/medicina"
    },
    {
      id: 3,
      nombre: "Derecho",
      progreso: 60,
      url: "/admin/carreras/derecho"
    },
    {
      id: 4,
      nombre: "Arquitectura",
      progreso: 30,
      url: "/admin/carreras/arquitectura"
    },
    {
      id: 5,
      nombre: "Administración de Empresas",
      progreso: 90,
      url: "/admin/carreras/administracion-empresas"
    },
    // Más elementos para demostrar el scroll
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 6,
      nombre: `Carrera Adicional ${i + 1}`,
      progreso: Math.floor(Math.random() * 100),
      url: `/carreras/adicional-${i + 1}`
    }))
  ];

  return (
    <div
      style={{
        gridColumn: "1 / span 2",
        gridRow: "2 / span 2",
      }}
    >
      <Card>
        <div className="card-header">Detalles de Carreras</div>
        <List
          dataSource={carreras}
          style={{
            maxHeight: 400,
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none", // Para Firefox
            msOverflowStyle: "none" // Para IE
          }}
          className="hide-scrollbar" // Añade esto en tu CSS global
          renderItem={(carrera) => (
            <List.Item style={{ padding: "8px 0" }}>
              <Link to={carrera.url} style={{ width: '100%', display: 'block' }}>
                <div style={{ 
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "#1890ff" // Color azul similar a los links
                }}>
                  {carrera.nombre}
                </div>
                <Progress 
                  percent={carrera.progreso} 
                  status="active"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  showInfo={true}
                  style={{ margin: 0 }}
                />
              </Link>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}



export default DetallesCarrera;