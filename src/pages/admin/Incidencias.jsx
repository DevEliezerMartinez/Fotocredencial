import { Card, List, Typography, Breadcrumb, Avatar, Tag } from "antd";
import { HomeOutlined, ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import apiClient from "@/lib/axios";
import React, { useState, useEffect } from "react";

const { Title } = Typography;

export default function Incidencias() {
  const [incidenciasData, setIncidenciasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncidencias, setTotalIncidencias] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("admin/incidencias");
        setIncidenciasData(response.data);
        setTotalIncidencias(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incidencias data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusTag = (status) => {
    let color = '';
    let text = '';
    
    switch(status) {
      case 'SIN REVISAR':
        color = 'orange';
        text = 'Pendiente';
        break;
      case 'REVISADO':
        color = 'blue';
        text = 'Revisado';
        break;
      
      default:
        color = 'gray';
        text = 'Desconocido';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Breadcrumb fuera de la Card */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="admin/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ExclamationCircleOutlined /> Incidencias
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Card con el contenido existente */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Incidencias de estudiantes
          </Title>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#666" }}>
            Total: {totalIncidencias}
          </span>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={incidenciasData}
          loading={loading}
          style={{ 
            maxHeight: '700px', 
            overflowY: 'auto',
            border: '1px solid #f0f0f0',
            borderRadius: '6px',
            padding: '8px'
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                 avatar={
                  <Avatar 
                    size="large" 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: '#1890ff',
                      color: 'white'
                    }} 
                  />
                }
                title={`${item.alumno_nombre} ${item.alumno_apellido_p} ${item.alumno_apellido_m}`}
                description={
                  <div>
                    <div>{item.comentarios}</div>
                    <div style={{ marginTop: 4 }}>
                      {getStatusTag(item.status)}
                    </div>
                  </div>
                }
              />
              <div style={{ minWidth: 100, textAlign: 'right' }}>
                {new Date(item.fecha_registro).toLocaleDateString()}
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}