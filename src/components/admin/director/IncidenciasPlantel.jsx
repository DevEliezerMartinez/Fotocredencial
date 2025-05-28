import React, { useEffect, useState } from "react";
import { Card, Button, Space, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/stores/auth.store";
import apiClient from "@/lib/axios";
import { useParams } from "react-router-dom";
import IncidenciasList from "./IncidenciasList";
import ReportarIncidenciaModal from "./ReportarIncidenciaModal";

function IncidenciasPlantel() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuthStore();
  const { slug } = useParams();

  useEffect(() => {
    cargarIncidencias();
  }, [slug]);

  const cargarIncidencias = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(
        `admin/incidencias_reportadas_plantel/${slug}`
      );
      setIncidencias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener incidencias:", error);
      message.error("Error al cargar las incidencias");
      setIncidencias([]);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoResuelta = async (idIncidencia) => {
    try {
      await apiClient.put(`admin/incidencia_completada/${idIncidencia}`);
      message.success("Incidencia marcada como resuelta");
      setIncidencias((prev) =>
        prev.map((incidencia) =>
          incidencia.id === idIncidencia
            ? { ...incidencia, status: "resuelto" }
            : incidencia
        )
      );
    } catch (error) {
      console.error("Error al marcar incidencia:", error);
      message.error("Error al actualizar la incidencia");
    }
  };

  return (
    <div style={{ gridColumn: "1 / span 6", gridRow: "4 / span 1" }}>
      <Card
        title={
          <Space>
            Incidencias del plantel
            <Tag style={{ marginLeft: 10 }}>
              Total: {incidencias?.length || 0}
            </Tag>
            {role === 2 && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                style={{ marginLeft: "auto" }}
              >
                Reportar Incidencia
              </Button>
            )}
          </Space>
        }
        loading={loading}
      >
        <IncidenciasList
          incidencias={incidencias}
          role={role}
          onResuelta={marcarComoResuelta}
        />
      </Card>

      <ReportarIncidenciaModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
}

export default IncidenciasPlantel;