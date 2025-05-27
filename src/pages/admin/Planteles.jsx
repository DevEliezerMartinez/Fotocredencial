import React from 'react';
import { Card, List, Typography, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, BankOutlined } from '@ant-design/icons';

const { Title } = Typography;

const plantelesData = [
  {
    id: 1,
    plantel: 'Campus Norte',
    responsable: 'Dr. Roberto Mendoza',
    slug: 'campus-norte'
  },
  {
    id: 2,
    plantel: 'Campus Sur',
    responsable: 'Dra. Carmen Jiménez',
    slug: 'campus-sur'
  },
  {
    id: 3,
    plantel: 'Campus Centro',
    responsable: 'Mtro. Alfonso García',
    slug: 'campus-centro'
  },
  {
    id: 4,
    plantel: 'Campus Oriente',
    responsable: 'Dra. Patricia López',
    slug: 'campus-oriente'
  },
  {
    id: 5,
    plantel: 'Campus Poniente',
    responsable: 'Dr. Miguel Hernández',
    slug: 'campus-poniente'
  },
  {
    id: 6,
    plantel: 'Unidad Satelital A',
    responsable: 'Lic. Ana Fernández',
    slug: 'unidad-satelital-a'
  }
];

export default function Planteles() {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Breadcrumb fuera de la Card */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BankOutlined /> Planteles
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Card con el contenido existente */}
      <Card>
        <Title level={3} style={{ marginBottom: 16 }}>
          Planteles
        </Title>
        
        <List
          itemLayout="horizontal"
          dataSource={plantelesData}
          style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid #f0f0f0',
            borderRadius: '6px',
            padding: '8px'
          }}
          renderItem={(item) => (
            <List.Item>
              <Link 
                to={`/admin/planteles/${item.slug}`}
                style={{ 
                  display: 'flex', 
                  width: '100%', 
                  textDecoration: 'none', 
                  color: 'inherit',
                  alignItems: 'center'
                }}
              >
                <List.Item.Meta
                  title={
                    <span style={{ color: '#1890ff', cursor: 'pointer' }}>
                      {item.plantel}
                    </span>
                  }
                  description={`Responsable: ${item.responsable}`}
                />
              </Link>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}