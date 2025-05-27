import { Card, List, Badge } from 'antd'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function PlantelesIncidencias() {
  const [planteles, setPlanteles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlanteles = async () => {
      try {
        // Simular petición API
        setTimeout(() => {
          const mockData = [
            { id: 1, nombre: 'Plantel-Centro', incidencias: 5 },
            { id: 2, nombre: 'Plantel-Norte', incidencias: 3 },
            { id: 3, nombre: 'Plantel-Sur', incidencias: 8 },
            { id: 4, nombre: 'Plantel-Milenio', incidencias: 2 },
            { id: 5, nombre: 'Plantel-Quetzal', incidencias: 12 },
            { id: 6, nombre: 'Plantel-Oriente', incidencias: 7 },
            { id: 7, nombre: 'Plantel-Poniente', incidencias: 4 },
            { id: 8, nombre: 'Plantel Valle', incidencias: 9 },
            { id: 9, nombre: 'Plantel Montaña', incidencias: 1 },
            { id: 10, nombre: 'Plantel Costa', incidencias: 6 },
          ]
          
          setPlanteles(mockData)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching planteles:', error)
        setLoading(false)
      }
    }

    fetchPlanteles()
  }, [])

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
                  count={plantel.incidencias} 
                  style={{ 
                    backgroundColor: plantel.incidencias > 5 ? '#ff4d4f' : '#52c41a' 
                  }}
                />
              ]}
            >
              <Link 
                to={`/admin/planteles/${plantel.nombre}`}
                style={{
                  color: '#1890ff',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                {plantel.nombre}
              </Link>
            </List.Item>
          )}
        />
      </div>
    </Card>
  )
}

export default PlantelesIncidencias