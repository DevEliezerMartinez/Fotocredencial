//src/pages/director/DetallesCarrera.jsx
import { Card, Breadcrumb, List, Badge, Button, Space, Typography } from 'antd';
import { HomeOutlined, RightOutlined, BankOutlined, ReadOutlined, SyncOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import React from 'react';

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
  
  return (
    <div style={{ marginBottom: 24 }}>
      <Breadcrumb separator={<RightOutlined />} style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/admin">
            <HomeOutlined /> Admin
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/planteles">
            <BankOutlined /> Planteles
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ReadOutlined /> Carrera
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Detalles de carrera</span>
            <span style={{ fontWeight: 'bold' }}>Total: 1204</span>
          </div>
        }
        extra={<Button type="text" icon={<SyncOutlined />} />}
      >
        <List
          dataSource={estudiantesData}
          renderItem={(item) => (
            <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <span>{item.nombre}</span>
                {item.estado === 'Enviado' ? (
                  <Badge 
                    count={item.estado} 
                    style={{ 
                      backgroundColor: '#52c41a',
                      color: '#fff',
                      fontWeight: 'normal',
                      marginLeft: 8
                    }} 
                  />
                ) : (
                  <Badge 
                    count={item.estado} 
                    style={{ 
                      backgroundColor: '#faad14',
                      color: '#fff',
                      fontWeight: 'normal',
                      marginLeft: 8
                    }} 
                  />
                )}
              </Space>
              {item.fecha && <Text type="secondary">{item.fecha}</Text>}
            </List.Item>
          )}
        />
        
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={() => console.log('Recargando datos...')}
          >
            Recargar
          </Button>
          <Text type="secondary">Registro obtenido: 08/06/2025 12:45</Text>
        </div>
      </Card>
    </div>
  )
}

export default DetallesCarrera