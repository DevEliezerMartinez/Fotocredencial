import { Card, List, Badge, Button, Space, Tag } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import React from "react";

function IncidenciasPlantel() {
  // Sample data
  const incidenciasData = [
    {
      id: 1,
      nombre: "Fuga de agua en baños",
      estado: "sin revisar",
      comentario: "Hay una fuga constante en los baños del segundo piso",
      fecha: "2023-05-15"
    },
    {
      id: 2,
      nombre: "Aire acondicionado dañado",
      estado: "revisado",
      comentario: "El aula 203 no enfría adecuadamente",
      fecha: "2023-05-10"
    },
    {
      id: 3,
      nombre: "Pintura descarapelada",
      estado: "sin revisar",
      comentario: "Paredes del pasillo principal necesitan repintura",
      fecha: "2023-05-18"
    }
  ];

  return (
    <div style={{ gridColumn: "1 / span 3", gridRow: "4 / span 2" }}>
      <Card
        title={
          <Space>
            Incidencias del plantel
            <Tag style={{ marginLeft: 10 }}>Total: 1204</Tag>
          </Space>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={incidenciasData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: "#888", marginBottom: 8 }}>
                    {item.fecha}
                  </div>
                  <Space>
                    <Button 
                      type="primary" 
                      shape="circle"
                      icon={<CheckOutlined />}
                      style={{ 
                        backgroundColor: item.estado === "revisado" ? '#b7eb8f' : '#52c41a',
                        border: 'none'
                      }}
                      disabled={item.estado === "revisado"}
                      onClick={() => console.log("Marcar como revisado", item.id)}
                    />
                    <Button 
                      danger 
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => console.log("Eliminar", item.id)}
                    />
                  </Space>
                </div>
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <span>{item.nombre}</span>
                    <Badge
                    className="site-badge-count-109"
                      color={item.estado === "revisado" ? "green" : "red"}
                      text={
                        <span style={{ 
                          textTransform: 'capitalize',
                          color: item.estado === "revisado" ? '#52c41a' : '#f5222d'
                        }}>
                          {item.estado}
                        </span>
                      }
                    />
                  </Space>
                }
                description={item.comentario}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default IncidenciasPlantel;