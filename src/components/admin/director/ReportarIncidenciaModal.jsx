import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Spin, Alert, message } from "antd";
import { useParams } from "react-router-dom";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

const { TextArea } = Input;

const ReportarIncidenciaModal = ({ visible, onCancel, onIncidenciaCreada }) => {
  const [form] = Form.useForm();
  const { slug } = useParams();
  const { user } = useAuthStore(); // Cambiado para obtener el objeto user completo
  const [carreras, setCarreras] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loadingCarreras, setLoadingCarreras] = useState(true);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [errorCarreras, setErrorCarreras] = useState(null);
  const [errorEstudiantes, setErrorEstudiantes] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Obtener carreras del plantel
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await apiClient.get(`admin/carreras/${slug}`);
        setCarreras(response.data);
      } catch (error) {
        console.error('Error fetching carreras:', error);
        setErrorCarreras('Error al cargar las carreras');
      } finally {
        setLoadingCarreras(false);
      }
    };

    if (visible) {
      fetchCarreras();
      // Resetear estudiantes al abrir el modal
      setEstudiantes([]);
      form.setFieldsValue({ carrera: undefined, estudiante: undefined });
    }
  }, [slug, visible, form]);

  // Handler para cuando seleccionan una carrera
  const handleCarreraChange = async (carreraId) => {
    if (!carreraId) {
      setEstudiantes([]);
      return;
    }

    try {
      setLoadingEstudiantes(true);
      setErrorEstudiantes(null);
      
      const response = await apiClient.get(`admin/carreras/${slug}/${carreraId}/estudiantes`);
      setEstudiantes(response.data.map(estudiante => ({
        value: estudiante.id,
        label: `${estudiante.nombre} ${estudiante.apellido_p} ${estudiante.apellido_m}`,
        data: estudiante
      })));
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
      setErrorEstudiantes('Error al cargar los estudiantes');
      setEstudiantes([]);
    } finally {
      setLoadingEstudiantes(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        message.error('Debe estar autenticado para reportar una incidencia');
        return;
      }

      setSubmitting(true);
      const values = await form.validateFields();
      
      const payload = {
        alumno_id: values.estudiante,
        tipo_incidencia: values.tipo,
        descripcion: values.descripcion,
        creado_por: user, // Usamos user.id del store
        plantel: slug
      };

      const response = await apiClient.post('admin/registrar_incidencia', payload);
      
      message.success('Incidencia reportada correctamente');
      form.resetFields();
      onCancel();
      
      // Notificar al componente padre que se creó una incidencia
      if (onIncidenciaCreada) {
        onIncidenciaCreada(response.data);
      }
    } catch (error) {
      console.error('Error al reportar incidencia:', error);
      message.error(error.response?.data?.message || 'Error al reportar la incidencia');
    } finally {
      setSubmitting(false);
    }
  };

  const tiposIncidencia = [
    "Duplicidad de datos",
    "Faltante de datos",
    "Datos erroneos",
    "Otro",
  ];

  return (
    <Modal
      title="Reportar Nueva Incidencia"
      visible={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Enviar Reporte"
      cancelText="Cancelar"
      width={600}
      confirmLoading={submitting}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tipo"
          label="Tipo de Incidencia"
          rules={[{ required: true, message: "Seleccione el tipo" }]}
        >
          <Select placeholder="Seleccione un tipo">
            {tiposIncidencia.map((tipo) => (
              <Select.Option key={tipo} value={tipo}>
                {tipo}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="carrera"
          label="Carrera"
          rules={[{ required: true, message: "Seleccione una carrera" }]}
        >
          {loadingCarreras ? (
            <Spin size="small" />
          ) : errorCarreras ? (
            <Alert message={errorCarreras} type="error" showIcon />
          ) : (
            <Select
              showSearch
              placeholder="Seleccione una carrera"
              optionFilterProp="label"
              onChange={handleCarreraChange}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={carreras.map((carrera) => ({
                value: carrera.id,
                label: carrera.nombre_carrera,
              }))}
            />
          )}
        </Form.Item>

        <Form.Item
          name="estudiante"
          label="Estudiante"
          rules={[{ required: true, message: "Seleccione un estudiante" }]}
        >
          {loadingEstudiantes ? (
            <Spin size="small" />
          ) : errorEstudiantes ? (
            <Alert message={errorEstudiantes} type="error" showIcon />
          ) : (
            <Select
              showSearch
              placeholder={estudiantes.length === 0 ? "Primero seleccione una carrera" : "Seleccione un estudiante"}
              optionFilterProp="label"
              disabled={estudiantes.length === 0}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={estudiantes}
            />
          )}
        </Form.Item>

        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[{ required: true, message: "Ingrese una descripción" }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Describa la incidencia con detalle..." 
            showCount 
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportarIncidenciaModal;