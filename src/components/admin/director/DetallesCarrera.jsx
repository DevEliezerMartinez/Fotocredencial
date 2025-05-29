import { Card, List, Progress, Typography, Spin, Alert, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "@/lib/axios";

const { Text } = Typography;

function DetallesCarrera() {
  const { slug } = useParams();
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`admin/carreras/${slug}`);
        setCarreras(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching carreras data:', error);
        setError('Error al cargar las carreras');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: '24px' }}
      />
    );
  }

  return (
    <div style={{ gridColumn: "1 / span 4", gridRow: "2 / span 3" }}>
      <Card style={{minHeight: '430px'}}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
            <span>Detalles de Carrera</span>
            <Text type="secondary">
              Plantel actual: <Text strong>{slug}</Text>
            </Text>
          </div>
        </div>
        
        {carreras.length === 0 ? (
          <Alert
            message="Información"
            description="No se encontraron carreras para este plantel"
            type="info"
            showIcon
          />
        ) : (
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
                  to={`/admin/planteles/${slug}/${carrera.nombre_carrera}`} 
                  style={{ width: '100%', display: 'block' }}
                >
                  <div style={{ 
                    fontSize: 16,
                    fontWeight: 500,
                    marginBottom: 4,
                    color: "#1890ff",
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{carrera.nombre_carrera}</span>
                    <Tag color="blue">{carrera.codigo_carrera}</Tag>
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <Text type="secondary">
                      {carrera.modalidad} • 
                      Alumnos: {carrera.estadisticas.total_alumnos} • 
                      Registros: {carrera.estadisticas.total_registros}
                    </Text>
                  </div>
                  <Progress 
                    percent={carrera.estadisticas.porcentaje_registrados} 
                    status={
                      carrera.estadisticas.porcentaje_registrados === 100 ? 
                      "success" : 
                      carrera.estadisticas.porcentaje_registrados > 70 ?
                      "active" : "exception"
                    }
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    format={percent => `${percent}% registrados`}
                    style={{ margin: 0 }}
                  />
                </Link>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export default DetallesCarrera;