import { Card, List, Typography, Breadcrumb } from "antd";
import { HomeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React from "react";

const { Title } = Typography;

const incidenciasData = [
  {
    id: 1,
    nombre: "Juan Pérez",
    comentarios: "Problema con el acceso al sistema de biblioteca",
    fechaRegistro: "2024-05-20",
  },
  {
    id: 2,
    nombre: "María González",
    comentarios: "Dificultades para conectarse al WiFi del campus",
    fechaRegistro: "2024-05-21",
  },
  {
    id: 3,
    nombre: "Carlos López",
    comentarios: "Solicitud de cambio de horario de clase",
    fechaRegistro: "2024-05-22",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    comentarios: "Problema con la plataforma virtual de aprendizaje",
    fechaRegistro: "2024-05-23",
  },
  {
    id: 5,
    nombre: "Luis Rodriguez",
    comentarios: "Consulta sobre proceso de inscripción tardía",
    fechaRegistro: "2024-05-24",
  },
  {
    id: 6,
    nombre: "Sofía Ramírez",
    comentarios: "Error al cargar calificaciones en el sistema",
    fechaRegistro: "2024-05-25",
  },
  {
    id: 7,
    nombre: "Miguel Torres",
    comentarios: "Falla en la autenticación de correo institucional",
    fechaRegistro: "2024-05-26",
  },
  {
    id: 8,
    nombre: "Laura Gómez",
    comentarios: "Solicitud de restablecimiento de contraseña",
    fechaRegistro: "2024-05-27",
  },
  {
    id: 9,
    nombre: "Jorge Fernández",
    comentarios: "Problema con la impresora del laboratorio",
    fechaRegistro: "2024-05-28",
  },
  {
    id: 10,
    nombre: "Isabel Morales",
    comentarios: "No aparece horario en sistema académico",
    fechaRegistro: "2024-05-29",
  },
  {
    id: 11,
    nombre: "Pedro Sánchez",
    comentarios: "El aula virtual no muestra contenido actualizado",
    fechaRegistro: "2024-05-30",
  },
  {
    id: 12,
    nombre: "Lucía Herrera",
    comentarios: "Dificultad para subir tareas en la plataforma",
    fechaRegistro: "2024-05-31",
  },
  {
    id: 13,
    nombre: "Andrés Castro",
    comentarios: "No se refleja el pago en el sistema",
    fechaRegistro: "2024-06-01",
  },
  {
    id: 14,
    nombre: "Daniela Ruiz",
    comentarios: "Problemas para registrarse en materias optativas",
    fechaRegistro: "2024-06-02",
  },
  {
    id: 15,
    nombre: "Fernando Vargas",
    comentarios: "El sistema no permite generar constancia de estudios",
    fechaRegistro: "2024-06-03",
  },
  {
    id: 16,
    nombre: "Patricia Molina",
    comentarios: "Solicitud de actualización de datos personales",
    fechaRegistro: "2024-06-04",
  },
  {
    id: 17,
    nombre: "Ricardo Aguilar",
    comentarios: "Fallo en la visualización de notas finales",
    fechaRegistro: "2024-06-05",
  },
  {
    id: 18,
    nombre: "Alejandra Ortega",
    comentarios: "Consulta sobre equivalencia de materias",
    fechaRegistro: "2024-06-06",
  },
  {
    id: 19,
    nombre: "Mario Jiménez",
    comentarios: "Problemas al descargar comprobante de inscripción",
    fechaRegistro: "2024-06-07",
  },
  {
    id: 20,
    nombre: "Natalia Rivas",
    comentarios: "Sistema lento durante la carga de documentos",
    fechaRegistro: "2024-06-08",
  },
];

export default function Incidencias() {
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
            Total: 1204
          </span>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={incidenciasData}
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
                title={item.nombre}
                description={item.comentarios}
              />
              <div style={{ minWidth: 100, textAlign: 'right' }}>
                {item.fechaRegistro}
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}