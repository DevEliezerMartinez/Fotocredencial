import { Card, Breadcrumb, List, Badge, Button, Space, Typography } from 'antd';
import { HomeOutlined, RightOutlined, BankOutlined, ReadOutlined, SyncOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import React from 'react';
import { useAuthStore } from '@/stores/auth.store';

const { Text } = Typography;

// Datos simulados de la API
const estudiantesData = [
  { id: 1, nombre: 'María García', estado: 'Enviado', fecha: '08/06/2025 10:30' },
  { id: 2, nombre: 'Juan Pérez', estado: 'Sin enviar', fecha: null },
  { id: 3, nombre: 'Ana Martínez', estado: 'Enviado', fecha: '07/06/2025 15:45' },
  { id: 4, nombre: 'Carlos López', estado: 'Sin enviar', fecha: null },
  { id: 5, nombre: 'Luisa Fernández', estado: 'Enviado', fecha: '08/06/2025 09:15' },
];

function DetallesCarrera() {
  const { slug, carrera } = useParams(); // Obtenemos los parámetros de la URL
  const { role, plantel_nombre } = useAuthStore(); // Obtenemos rol y plantel asignado

  // Función para renderizar el breadcrumb de Planteles según el rol
  const renderPlantelesBreadcrumb = () => {
    if (role === 1) { // Admin - con enlace al listado completo
      return (
        <Link to="/admin/planteles">
          <BankOutlined /> Planteles
        </Link>
      );
    }
    // Director - con enlace a su plantel específico
    return (
      <Link to={`/admin/planteles/${plantel_nombre}`}>
        <BankOutlined /> Planteles
      </Link>
    );
  };

  // Función para renderizar el breadcrumb de la carrera
  const renderCarreraBreadcrumb = () => {
    return (
      <>
        <ReadOutlined /> {carrera || 'Carrera'}
      </>
    );
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Breadcrumb separator={<RightOutlined />} style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/admin">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        
        <Breadcrumb.Item>
          {renderPlantelesBreadcrumb()}
        </Breadcrumb.Item>
        
        <Breadcrumb.Item>
          <Link to={`/admin/planteles/${slug}`}>
            <BankOutlined /> {slug}
          </Link>
        </Breadcrumb.Item>
        
        <Breadcrumb.Item>
          {renderCarreraBreadcrumb()}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Detalles de carrera: {carrera}
            </span>
            <span style={{ fontWeight: 'bold' }}>Total estudiantes: {estudiantesData.length}</span>
          </div>
        }
        extra={
          <Button 
            type="text" 
            icon={<SyncOutlined />} 
            onClick={() => console.log('Actualizando datos...')}
          >
            Actualizar
          </Button>
        }
      >
        <List
          dataSource={estudiantesData}
          renderItem={(item) => (
            <List.Item 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <Space>
                <Text strong>{item.nombre}</Text>
                <Badge 
                  count={item.estado} 
                  style={{ 
                    backgroundColor: item.estado === 'Enviado' ? '#52c41a' : '#faad14',
                    color: '#fff',
                    fontWeight: 'normal',
                    marginLeft: 8
                  }} 
                />
              </Space>
              {item.fecha && (
                <Text type="secondary" style={{ fontStyle: 'italic' }}>
                  Último envío: {item.fecha}
                </Text>
              )}
            </List.Item>
          )}
        />
        
        <div style={{ 
          marginTop: 24, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: 16,
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={() => console.log('Recargando todos los datos...')}
            style={{ marginRight: 8 }}
          >
            Recargar todo
          </Button>
          
          <Text type="secondary">
            Última actualización: {new Date().toLocaleString()}
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default DetallesCarrera;