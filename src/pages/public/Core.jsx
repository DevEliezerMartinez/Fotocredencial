import Header_app from "@/components/public/Header";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button, Typography, Alert, Row, Col, Card } from "antd";
import {
  CameraOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "@/assets/css/core.css";
import WebcamCapture from "@/components/public/WebcamCapture";
import RegistrationForm from "@/components/public/RegistrationForm";

const { Title, Paragraph, Text } = Typography;

function Core() {
  const location = useLocation();
  const studentData = location.state?.studentData;

  const [photoValid, setPhotoValid] = useState(false);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [formData, setFormData] = useState({
    matricula: studentData?.matricula || "",
    nombre: studentData?.nombre || "",
    apellido_m: studentData?.apellido_m || "",
    apellido_p: studentData?.apellido_p || "",
    curp: studentData?.curp || "",
    correo: studentData?.correo || "",
    plantel: studentData?.plantel || "",
  });

  useEffect(() => {
    if (!studentData) {
      window.location.href = "/validacion";
    }
  }, [studentData]);

  const handlePhotoValidated = (isValid, src, file) => {
    setPhotoValid(isValid);
    setPhotoSrc(src);
    setPhotoFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoValid) {
      alert("Por favor, asegúrate de que la foto sea válida.");
      return;
    }

    const completeData = {
      ...formData,
      photo: photoSrc,
    };

    try {
      console.log("Enviando datos del registro...");
      console.log("Datos completos:", completeData);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Registro exitoso!");
      window.location.href = "/success";
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error en el registro.");
    }
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  if (!studentData) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Redirigiendo a validación...</p>
      </div>
    );
  }

  return (
    <>
      <Header_app />

      {/* Modal de Bienvenida */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <UserOutlined
              style={{ fontSize: "24px", color: "#1890ff", marginRight: "8px" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              ¡Bienvenido al Proceso de Registro!
            </span>
          </div>
        }
        open={showWelcomeModal}
        onCancel={handleCloseWelcomeModal}
        footer={[
          <Button
            key="continue"
            type="primary"
            onClick={handleCloseWelcomeModal}
            size="large"
          >
            <CameraOutlined /> Continuar con el Registro
          </Button>,
        ]}
        width={600}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Paragraph style={{ fontSize: "16px", marginBottom: "20px" }}>
            A continuación tomarás una fotografía y validarás tus datos
            personales.
          </Paragraph>

          <Alert
            message="Aviso legal:"
            description={
              <div>
                <Paragraph style={{ marginBottom: "12px" }}>
                  Este proceso se realiza con <strong>fines administrativos</strong>,
                  especialmente para la validación de datos
                  personales.
                </Paragraph>
                <div style={{ textAlign: "left" }}>
                  <Text strong>Es importante que:</Text>
                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    <li>Revises cuidadosamente todos tus datos</li>
                    <li>
                      Si algún dato está incorrecto (que no sea solo un acento),
                      por favor repórtalo
                    </li>
                    <li>Completa cualquier información faltante</li>
                    <li>
                      Asegúrates de que tu género esté correctamente registrado
                    </li>
                  </ul>
                </div>
              </div>
            }
            type="info"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ textAlign: "left", marginTop: "16px" }}
          />

          <Paragraph
            style={{ marginTop: "16px", color: "#666", fontSize: "14px" }}
          >
            Tu cooperación es fundamental para mantener la precisión de nuestros
            registros.
          </Paragraph>
        </div>
      </Modal>

      {/* CONTENEDOR PRINCIPAL CON ESTILOS INLINE PARA FORZAR SCROLL */}
      <div
        style={{
        
          padding: "20px",
          backgroundColor: "#f5f5f5"
        }}
      >
        {/* Título Principal */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 className="title" style={{ margin: "0 0 30px 0" }}>
            Credencial Campus Digital
          </h1>
        </div>

        {/* Layout Responsivo con GAP forzado */}
        <Row gutter={[24, 24]}> {/* Añadido gutter para spacing */}
          {/* Columna Izquierda en Desktop - Card Info + Form */}
          <Col xs={24} lg={12} order={{ xs: 1, lg: 2 }}>
            {/* Card de Información */}
            <div 
              className="card_info" 
              style={{ 
                marginBottom: "24px",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <p style={{ marginBottom: "16px", fontWeight: "500" }}>
                Considera que para una buena fotografía:
              </p>
              <ul style={{ paddingLeft: "20px", margin: "0" }}>
                <li style={{ marginBottom: "8px" }}>
                  El rostro debe estar centrado y completamente visible.
                </li>
                <li style={{ marginBottom: "8px" }}>
                  Debe existir una iluminación adecuada.
                </li>
                <li style={{ marginBottom: "8px" }}>
                  No deben usarse accesorios como gorras o lentes oscuros.
                </li>
              </ul>
            </div>

            {/* Formulario de Registro - Solo visible en Desktop */}
            <div className="desktop-form" style={{ marginBottom: "24px" }}>
              <Card 
                title="Tu información"
                style={{ 
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderRadius: "8px"
                }}
              >
                <RegistrationForm
                  photoValid={photoValid}
                  photoSrc={photoSrc}
                  photoFile={photoFile}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  studentData={studentData}
                />
              </Card>
            </div>
          </Col>

          {/* WebcamCapture - Segunda en mobile, primera en desktop */}
          <Col xs={24} lg={12} order={{ xs: 2, lg: 1 }}>
            <Card 
              title="Captura de Fotografía"
              style={{ 
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                marginBottom: "24px"
              }}
            >
              <WebcamCapture onPhotoValidated={handlePhotoValidated} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Core;