import {
  Card,
  Breadcrumb,
  List,
  Badge,
  Button,
  Space,
  Typography,
  Spin,
  Alert,
  message,
} from "antd";
import {
  HomeOutlined,
  RightOutlined,
  BankOutlined,
  ReadOutlined,
  SyncOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import apiClient from "@/lib/axios";

const { Text } = Typography;

function DetallesCarrera() {
  const { slug, carrera: carreraNombre } = useParams(); // slug del plantel y ID de la carrera
  const { role,plantel_nombre } = useAuthStore();

  // Estados para manejar los datos y la carga
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Función para obtener los estudiantes
  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(
        `admin/carreras_detalles/${slug}/${carreraNombre}/estudiantes`
      );

      // Mapear los datos de la API al formato que necesitamos
      const estudiantesFormateados = response.data.map((estudiante) => ({
        id: estudiante.id,
        nombre: `${estudiante.nombre} ${estudiante.apellido_p} ${estudiante.apellido_m}`,
        estado: estudiante.estado_envio || "Sin enviar", // Ajusta según tu API
        fecha: estudiante.fecha_envio || null, // Ajusta según tu API
        data: estudiante, // Guardamos todos los datos originales
      }));

      setEstudiantes(estudiantesFormateados);
    } catch (error) {
      console.error("Error obteniendo estudiantes:", error);
      setError(error.response?.data?.message || "Error al cargar los datos");
      message.error("Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (slug && carreraNombre) {
      fetchEstudiantes();
    }
  }, [slug, carreraNombre]);

  // Función para manejar la actualización
  const handleRefresh = () => {
    fetchEstudiantes();
  };

  // Función para generar y descargar PDF
  const handleDownloadPdf = async () => {
    if (estudiantes.length === 0) {
      message.warning("No hay estudiantes para generar el reporte");
      return;
    }

    setGeneratingPdf(true);

    try {
      // Crear contenido HTML para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Estudiantes</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
              font-size: 12px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #1890ff;
              padding-bottom: 20px;
            }
            .header h1 { 
              color: #1890ff; 
              margin: 0;
              font-size: 20px;
            }
            .header p { 
              margin: 5px 0; 
              color: #666;
              font-size: 12px;
            }
            .summary {
              background: #f0f2f5;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
            .summary-item {
              text-align: center;
            }
            .summary-number {
              font-size: 18px;
              font-weight: bold;
              color: #1890ff;
            }
            .summary-label {
              font-size: 10px;
              color: #666;
              margin-top: 5px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #d9d9d9; 
              padding: 8px 6px; 
              text-align: left; 
            }
            th { 
              background-color: #fafafa; 
              font-weight: bold;
              color: #262626;
            }
            tr:nth-child(even) { 
              background-color: #fafafa; 
            }
            .status-enviado { 
              background: #f6ffed; 
              color: #52c41a; 
              padding: 2px 6px; 
              border-radius: 3px;
              font-size: 10px;
              font-weight: bold;
            }
            .status-sin-enviar { 
              background: #fff7e6; 
              color: #faad14; 
              padding: 2px 6px; 
              border-radius: 3px;
              font-size: 10px;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #999;
              border-top: 1px solid #d9d9d9;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Estudiantes</h1>
            <p><strong>Plantel:</strong> ${slug}</p>
            <p><strong>Carrera nombre:</strong> ${carreraNombre}</p>
            <p><strong>Fecha de generación:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <div class="summary-number">${estudiantes.length}</div>
              <div class="summary-label">Total Estudiantes</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${
                estudiantes.filter((e) => e.estado === "Enviado").length
              }</div>
              <div class="summary-label">Enviados</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${
                estudiantes.filter((e) => e.estado === "Sin enviar").length
              }</div>
              <div class="summary-label">Sin Enviar</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                <th>Nombre Completo</th>
                <th style="width: 100px;">Estado</th>
                <th style="width: 120px;">Último Envío</th>
              </tr>
            </thead>
            <tbody>
              ${estudiantes
                .map(
                  (estudiante, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${estudiante.nombre}</td>
                  <td>
                    <span class="${
                      estudiante.estado === "Enviado"
                        ? "status-enviado"
                        : "status-sin-enviar"
                    }">
                      ${estudiante.estado}
                    </span>
                  </td>
                  <td>${
                    estudiante.fecha
                      ? new Date(estudiante.fecha).toLocaleString()
                      : "-"
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Reporte generado automáticamente el ${new Date().toLocaleString()}</p>
            <p>Sistema de Gestión de Estudiantes</p>
          </div>
        </body>
        </html>
      `;

      // Usar la API de impresión del navegador para generar PDF
      const printWindow = window.open("", "_blank");
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Esperar a que se cargue el contenido
      printWindow.onload = () => {
        // Configurar para imprimir como PDF
        printWindow.print();

        // Cerrar la ventana después de un breve delay
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      };

      message.success("Generando PDF... Se abrirá el diálogo de impresión");
    } catch (error) {
      console.error("Error generando PDF:", error);
      message.error("Error al generar el reporte");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Función para renderizar el breadcrumb de Planteles según el rol
  const renderPlantelesBreadcrumb = () => {
    if (role === 1) {
      return (
        <Link to="/admin/planteles">
          <BankOutlined /> Planteles
        </Link>
      );
    }
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
        <ReadOutlined /> Carrera ID: {carreraNombre}
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

        <Breadcrumb.Item>{renderPlantelesBreadcrumb()}</Breadcrumb.Item>

        <Breadcrumb.Item>
          <Link to={`/admin/planteles/${slug}`}>
            <BankOutlined /> {slug}
          </Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item>{renderCarreraBreadcrumb()}</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Detalles de carrera ID: {carreraNombre}
            </span>
            <span style={{ fontWeight: "bold" }}>
              Total estudiantes: {loading ? "..." : estudiantes.length}
            </span>
          </div>
        }
        extra={
          <Button
            type="text"
            icon={<SyncOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Actualizar
          </Button>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>Cargando estudiantes...</Text>
            </div>
          </div>
        ) : error ? (
          <Alert
            message="Error al cargar los datos"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={handleRefresh}>
                Reintentar
              </Button>
            }
          />
        ) : estudiantes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Text type="secondary">
              No hay estudiantes registrados en esta carrera
            </Text>
          </div>
        ) : (
          <List
            dataSource={estudiantes}
            renderItem={(item) => (
              <List.Item
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Space>
                  <Text strong>{item.nombre}</Text>
                  <Badge
                    count={item.estado}
                    style={{
                      backgroundColor:
                        item.estado === "Enviado" ? "#52c41a" : "#faad14",
                      color: "#fff",
                      fontWeight: "normal",
                      marginLeft: 8,
                    }}
                  />
                </Space>
                {item.fecha && (
                  <Text type="secondary" style={{ fontStyle: "italic" }}>
                    Último envío: {new Date(item.fecha).toLocaleString()}
                  </Text>
                )}
              </List.Item>
            )}
          />
        )}

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 16,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={handleDownloadPdf}
            loading={generatingPdf}
            style={{ marginRight: 8 }}
          >
            Descargar Reporte
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
