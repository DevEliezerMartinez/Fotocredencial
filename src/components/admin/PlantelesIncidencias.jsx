import { Card, List, Badge } from 'antd'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from "@/lib/axios";

function PlantelesIncidencias() {
  const [planteles, setPlanteles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("admin/planteles_incidencias");
        setPlanteles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching planteles data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card
      title="📍 Planteles que reportaron incidencias"
      style={{
        gridColumn: "span 3",
        height: "400px", // Altura fija
      }}
      styles={{
        body: {
          padding: "0",
          height: "calc(100% - 60px)",
          overflow: "hidden",
        }
      }}
    >
      <div style={{ 
        height: "100%",
        overflowY: "auto", // Scroll vertical
      }}>
        <List
          loading={loading}
          dataSource={planteles}
          renderItem={(plantel) => (
            <List.Item
              style={{
                padding: "12px 24px",
                borderBottom: "1px solid #f0f0f0"
              }}
              actions={[
                <Badge 
                  count={plantel.total_incidencias} 
                  style={{ 
                    backgroundColor: plantel.total_incidencias > 5 ? '#ff4d4f' : '#52c41a' 
                  }}
                />
              ]}
            >
              <Link 
                to={`/admin/planteles/${plantel.plantel}`}
                style={{
                  color: '#1890ff',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                {plantel.plantel}
              </Link>
            </List.Item>
          )}
        />
      </div>
    </Card>
  )
}

export default PlantelesIncidencias