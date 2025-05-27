import {
  Card,
  List,
  Badge,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  Input,
} from "antd";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

const { Option } = Select;
const { TextArea } = Input;

function IncidenciasPlantel() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { role } = useAuthStore();

  // Sample data
  const incidenciasData = [
    {
      id: 1,
      nombre: "Fuga de agua en baños",
      estado: "sin revisar",
      comentario: "Hay una fuga constante en los baños del segundo piso",
      fecha: "2023-05-15",
    },
    {
      id: 2,
      nombre: "Aire acondicionado dañado",
      estado: "revisado",
      comentario: "El aula 203 no enfría adecuadamente",
      fecha: "2023-05-10",
    },
    {
      id: 3,
      nombre: "Pintura descarapelada",
      estado: "sin revisar",
      comentario: "Paredes del pasillo principal necesitan repintura",
      fecha: "2023-05-18",
    },
  ];

  const tiposIncidencia = [
    "Duplicidad de datos",
    "Faltante de datos",
    "Datos erroneos",
    "Otro",
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Datos del formulario:", values);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Error al validar:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // Función para determinar si mostrar acciones
  const renderActions = (item) => {
    if (role === 1) {
      // Solo admin ve los botones
      return (
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#888", marginBottom: 8 }}>{item.fecha}</div>
          <Space>
            <Button
              type="primary"
              shape="circle"
              icon={<CheckOutlined />}
              style={{
                backgroundColor:
                  item.estado === "revisado" ? "#b7eb8f" : "#52c41a",
                border: "none",
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
      );
    }
    // Director solo ve la fecha
    return (
      <div style={{ textAlign: "right", color: "#888" }}>{item.fecha}</div>
    );
  };

  return (
    <div style={{ gridColumn: "1 / span 3", gridRow: "4 / span 2" }}>
      <Card
        title={
          <Space>
            Incidencias del plantel
            <Tag style={{ marginLeft: 10 }}>
              Total: {incidenciasData.length}
            </Tag>
            {role === 2 && ( // Solo director ve este botón
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{ marginLeft: "auto" }}
              >
                Reportar Incidencia
              </Button>
            )}
          </Space>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={incidenciasData}
          renderItem={(item) => (
            <List.Item actions={[renderActions(item)]}>
              <List.Item.Meta
                title={
                  <Space>
                    <span>{item.nombre}</span>
                    <Badge
                      className="site-badge-count-109"
                      color={item.estado === "revisado" ? "green" : "red"}
                      text={
                        <span
                          style={{
                            textTransform: "capitalize",
                            color:
                              item.estado === "revisado"
                                ? "#52c41a"
                                : "#f5222d",
                          }}
                        >
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

        {/* Modal para reportar incidencia */}
        <Modal
          title="Reportar Nueva Incidencia"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Enviar Reporte"
          cancelText="Cancelar"
          width={600}
        >
          <Form form={form} layout="vertical" name="form_inicidencia">
            <Form.Item
              name="tipo"
              label="Tipo de Incidencia"
              rules={[
                { required: true, message: "Seleccione el tipo de incidencia" },
              ]}
            >
              <Select placeholder="Seleccione un tipo">
                {tiposIncidencia.map((tipo) => (
                  <Option key={tipo} value={tipo}>
                    {tipo}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="comentario"
              label="Descripción detallada"
              rules={[{ required: true, message: "Ingrese una descripción" }]}
            >
              <TextArea
                rows={4}
                placeholder="Describa la incidencia con detalle..."
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}

export default IncidenciasPlantel;
