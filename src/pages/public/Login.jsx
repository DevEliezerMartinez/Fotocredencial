import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";
import logoUne from "@/assets/img/logo_blanco.png";
import "@/assets/css/Login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/"); // Navega a la página principal
  };

  // Responsive
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values); // Usamos el método login del store
      message.success("¡Bienvenido!");
      navigate("/admin/"); // ← Ruta correcta
    } catch (error) {
      message.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className="left_side">
        <img src={logoUne} alt="UNE Logo" />
        <hr />
        <h1>Portal Administrativo</h1>
      </div>

      <div className="right_side">
        <div className="right_options">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleClick}
          >
            Volver a la página principal
          </Button>
        </div>

        <h2>Hola</h2>
        <p>Bienvenido de nuevo</p>

        <Form
          form={form}
          name="login_form"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="correo"
            label="Correo electrónico"
            rules={[
              { required: true, message: "Por favor ingrese su correo" },
              { type: "email", message: "Ingrese un correo válido" },
            ]}
            style={isMobile ? { color: "white" } : {}}
          >
            <Input
              prefix={
                <UserOutlined style={isMobile ? { color: "white" } : {}} />
              }
              placeholder="ejemplo@correo.com"
              variant={isMobile ? "borderless" : "underlined"}
              style={isMobile ? { color: "white" } : {}}
            />
          </Form.Item>

          <Form.Item
            name="contrasena"
            label="Contraseña"
            rules={[
              { required: true, message: "Por favor ingrese su contraseña" },
            ]}
            style={isMobile ? { color: "white" } : {}}
          >
            <Input.Password
              prefix={
                <LockOutlined style={isMobile ? { color: "white" } : {}} />
              }
              placeholder="Contraseña"
              variant={isMobile ? "borderless" : "underlined"}
              style={isMobile ? { color: "white" } : {}}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
