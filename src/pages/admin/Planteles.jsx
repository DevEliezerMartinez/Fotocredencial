import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Breadcrumb, Avatar, Skeleton, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, BankOutlined, UserOutlined } from '@ant-design/icons';
import apiClient from '@/lib/axios';

const { Title } = Typography;

export default function Planteles() {
  const [planteles, setPlanteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanteles = async () => {
      try {
        const response = await apiClient.get('/admin/planteles');
        setPlanteles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching planteles:', err);
        setError('Error al cargar los planteles');
        setLoading(false);
      }
    };

    fetchPlanteles();
  }, []);

  const getRandomColor = () => {
    const colors = ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#f5222d', '#13c2c2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div style={{ marginBottom: 24 }}>
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

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>
            Planteles
          </Title>
          <Tag color="processing" style={{ fontSize: 14 }}>
            Total: {loading ? '...' : planteles.length}
          </Tag>
        </div>

        {error ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Title level={4} type="danger">{error}</Title>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={planteles}
            loading={loading}
            style={{ 
              maxHeight: '500px', 
              overflowY: 'auto',
            }}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.3s',
                  ':hover': {
                    backgroundColor: '#fafafa'
                  }
                }}
              >
                <Link 
                  to={`/admin/planteles/${item.plantel || item.id}`}
                  style={{ 
                    display: 'flex', 
                    width: '100%', 
                    textDecoration: 'none', 
                    color: 'inherit',
                    alignItems: 'center'
                  }}
                >
                  <Avatar 
                    size="large" 
                    icon={<BankOutlined />}
                    style={{ 
                      backgroundColor: getRandomColor(),
                      color: 'white',
                      marginRight: 16
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <Title level={5} style={{ marginBottom: 4, color: '#1890ff' }}>
                      {item.plantel || item.nombre}
                    </Title>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <UserOutlined style={{ marginRight: 8, color: '#888' }} />
                      <span style={{ color: '#666' }}>
                        {item.nombre || 'Responsable no asignado'}
                      </span>
                    </div>
                  </div>
                </Link>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}