import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Button, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  validateByEmail,
  validateByStudentId,
} from "../../api/student/studentValidation";

const StudentValidation = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [formEmail] = Form.useForm();
  const [formStudentId] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [validatedTab, setValidatedTab] = useState(null);
  const [redirectTimer, setRedirectTimer] = useState(null);

  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
       showProgress: true,
      placement: "topRight",
      duration: type === "success" ? 5 : 4.5, // Duración más larga para success
    });
  };

  useEffect(() => {
    if (responseData && responseData.enviado === false) {
      openNotificationWithIcon(
        "info",
        "Registro ya completado",
        "Ya haz completado tu registro, muchas gracias."
      );
    }
  }, [responseData]);

  // Efecto para manejar la redirección automática
  useEffect(() => {
    if (responseData && responseData.enviado === true) {
      // Limpiar cualquier timer previo
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }

      // Configurar nuevo timer para redirección automática (4 segundos)
      const timer = setTimeout(() => {
        navigate("/registro", { state: { studentData: responseData } });
      }, 4000);

      setRedirectTimer(timer);

      // Cleanup function
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [responseData, navigate]);

  // Cleanup del timer cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

  const handleTabChange = (key) => {
    // Solo permitir cambio si no hay validación exitosa
    if (validatedTab && responseData?.enviado === true) {
      return;
    }
    
    setActiveTab(key);
    setResponseData(null);
    setValidatedTab(null);
    formEmail.resetFields();
    formStudentId.resetFields();
    
    // Limpiar timer si existe
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
  };

  const handleSubmit = async (values, validationFn) => {
    try {
      setLoading(true);
      const data = await validationFn(Object.values(values)[0]);

      //   exitoso (200)
      if (data && data.enviado === false) {
        setResponseData({ enviado: false });
      } else {
        setResponseData(data);
        setValidatedTab(activeTab); // Guardar qué tab se validó
        // Mostrar mensaje de bienvenida con información sobre redirección automática
        openNotificationWithIcon(
          "success",
          `¡Bienvenido${data.nombre ? `, ${data.nombre}` : ''}!`,
          "Validación exitosa. Serás redirigido automáticamente o puedes presionando continuar."
        );
      }
    } catch (error) {
      const status = error.response?.status;
      let title = "Error en la validación";
      let description = "Ocurrió un error inesperado.";

      if (status === 404) {
        title = "Estudiante no encontrado";
        description = "No encontramos ningún estudiante con ese dato. Verifica tu información.";
      } else if (status === 500) {
        title = "Error interno del servidor";
        description = "Lo sentimos, ha ocurrido un error. Intenta más tarde.";
      } else if (error.response?.data?.detail) {
        // En REST puro, los errores vienen en 'detail'
        description = error.response.data.detail;
      }

      openNotificationWithIcon("error", title, description);
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: "1",
      label: "Por Matrícula",
      disabled: validatedTab === "2" && responseData?.enviado === true,
      children: (
        <Form
          form={formStudentId}
          layout="vertical"
          onFinish={(values) => handleSubmit(values, validateByStudentId)}
        >
          <Form.Item
            name="studentId"
            label="Número de Matrícula"
            rules={[
              { required: true, message: "Por favor ingresa tu matrícula" },
              {
                pattern: /^[A-Za-z0-9]+$/,
                message: "La matrícula debe contener solo letras y números",
              },
            ]}
          >
            <Input placeholder="Ej: 19230000" />
          </Form.Item>

          <Form.Item>
            {responseData && responseData.enviado === true ? (
              <Link to="/registro" state={{ studentData: responseData }}>
                <Button type="primary" size="large">
                  Continuar Ahora
                </Button>
              </Link>
            ) : (
              <Button type="primary" htmlType="submit" loading={loading}>
                Validar
              </Button>
            )}
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Por Correo",
      disabled: validatedTab === "1" && responseData?.enviado === true,
      children: (
        <Form
          form={formEmail}
          layout="vertical"
          onFinish={(values) => handleSubmit(values, validateByEmail)}
        >
          <Form.Item
            name="email"
            label="Correo Institucional"
            rules={[
              { required: true, message: "Por favor ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input placeholder="Ej: nombre@universidad-une.com" />
          </Form.Item>

          <Form.Item>
            {responseData && responseData.enviado === true ? (
              <Link to="/registro" state={{ studentData: responseData }}>
                <Button type="primary" size="large">
                  Continuar Ahora
                </Button>
              </Link>
            ) : (
              <Button type="primary" htmlType="submit" loading={loading}>
                Validar
              </Button>
            )}
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={items} />
    </>
  );
};

export default StudentValidation;