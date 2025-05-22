// src/components/student/StudentValidation.jsx
import React, { useState } from "react";
import { Tabs, Form, Input, Button, message, Card } from "antd";
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

  const handleTabChange = (key) => {
    setActiveTab(key);
    setResponseData(null);
    formEmail.resetFields();
    formStudentId.resetFields();
  };

  const handleSubmit = async (values, validationFn) => {
    try {
      setLoading(true);
      const data = await validationFn(Object.values(values)[0]); // email o studentId
      setResponseData(data);
      message.success("Validación exitosa");
    } catch (error) {
      message.error(error.response?.data?.message || "Error en la validación");
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: "1",
      label: "Por Matrícula",
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
                pattern: /^\d+$/,
                message: "La matrícula debe contener solo números",
              },
            ]}
          >
            <Input placeholder="Ej: 19230000" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Validar
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Por Correo",
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Validar
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={items} />

      {responseData && (
        <div style={{ marginTop: 24 }}>
          <Card title="Datos del Estudiante" bordered={false}>
            <p>
              <strong>Nombre:</strong> {responseData.fullName}
            </p>
            <p>
              <strong>Matrícula:</strong> {responseData.studentId}
            </p>
            <p>
              <strong>Correo:</strong> {responseData.email}
            </p>
            <p>
              <strong>Estatus:</strong> {responseData.status}
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default StudentValidation;