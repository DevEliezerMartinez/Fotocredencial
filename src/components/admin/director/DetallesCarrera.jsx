import { Card, List, Progress, Typography } from "antd";
import React from "react";
import { Link, useParams } from "react-router-dom";

const { Text } = Typography;

function DetallesCarrera() {
  const { slug } = useParams(); // Obtenemos el slug del plantel de la URL actual

  // Datos simulados de carreras (ahora sin URLs hardcodeadas)
  const carreras = [
    {
      id: "ingenieria-software",
      nombre: "Ingeniería de Software",
      progreso: 75
    },
    {
      id: "medicina",
      nombre: "Medicina",
      progreso: 40
    },
    {
      id: "derecho",
      nombre: "Derecho",
      progreso: 60
    },
    {
      id: "arquitectura",
      nombre: "Arquitectura",
      progreso: 30
    },
    {
      id: "administracion-empresas",
      nombre: "Administración de Empresas",
      progreso: 90
    },
    // Más elementos para demostrar el scroll
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `carrera-${i + 6}`,
      nombre: `Carrera Adicional ${i + 1}`,
      progreso: Math.floor(Math.random() * 100)
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
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Detalles de Carreras</span>
            <Text type="secondary">
              Plantel actual: <Text strong>{slug}</Text>
            </Text>
          </div>
        </div>
        
        <List
          dataSource={carreras}
          style={{
            maxHeight: 400,
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className="hide-scrollbar"
          renderItem={(carrera) => (
            <List.Item style={{ padding: "8px 0" }}>
              <Link 
                to={`/admin/planteles/${slug}/${carrera.id}`} 
                style={{ width: '100%', display: 'block' }}
              >
                <div style={{ 
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 4,
                  color: "#1890ff"
                }}>
                  {carrera.nombre}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Text type="secondary">
                    Ruta: /admin/planteles/<Text strong>{slug}</Text>/
                    <Text strong>{carrera.id}</Text>
                  </Text>
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