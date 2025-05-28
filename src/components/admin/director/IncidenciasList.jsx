import React from "react";
import { List, Badge, Button, Space, Tag } from "antd";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";

const IncidenciasList = ({ incidencias, role, onResuelta }) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "resuelto":
        return { color: "green", text: "Resuelto" };
      case "pendiente":
        return { color: "orange", text: "Pendiente" };
      default:
        return { color: "gray", text: "Desconocido" };
    }
  };

  const renderActions = (item) => {
    const statusBadge = getStatusBadge(item.status);

    if (role === 1) {
      return (
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#888", marginBottom: 8 }}>
            {item.fecha
              ? new Date(item.fecha).toLocaleDateString()
              : "Fecha no disponible"}
          </div>
          <Space>
            <Button
              type="primary"
              shape="circle"
              icon={<CheckOutlined />}
              style={{
                backgroundColor: statusBadge.color,
                border: "none",
                display:
                  item.status?.toLowerCase() === "resuelto"
                    ? "none"
                    : "inline-block",
              }}
              onClick={() => onResuelta(item.id)}
            />
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => console.log("Eliminar", item.id)}
            />
          </Space>
        </div>
      );
    }
    return (
      <div style={{ textAlign: "right", color: "#888" }}>
        {item.fecha
          ? new Date(item.fecha).toLocaleDateString()
          : "Fecha no disponible"}
      </div>
    );
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={incidencias || []}
      renderItem={(item) => {
        const statusBadge = getStatusBadge(item.status);

        return (
          <List.Item actions={[renderActions(item)]}>
            <List.Item.Meta
              title={
                <Space>
                  {item.alumno
                    ? `${item.alumno.nombre} ${item.alumno.apellido_p} ${item.alumno.apellido_m}`
                    : "Alumno no disponible"}
                  <Badge
                    color={statusBadge.color}
                    text={
                      <span
                        style={{
                          textTransform: "capitalize",
                          color:
                            statusBadge.color === "orange"
                              ? "#fa8c16"
                              : statusBadge.color,
                        }}
                      >
                        {statusBadge.text}
                      </span>
                    }
                  />
                </Space>
              }
              description={item.descripcion || "Descripción no disponible"}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default IncidenciasList;