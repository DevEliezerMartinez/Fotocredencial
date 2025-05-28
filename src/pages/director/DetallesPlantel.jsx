import { Card } from "antd";
import { useParams, Link } from "react-router-dom";
import IncidenciasPlantel from "@/components/admin/director/IncidenciasPlantel";
import DetallesCarrera from "@/components/admin/director/DetallesCarrera";
import ObjetivoPlantel from "@/components/admin/director/ObjetivoPlantel";
import { HomeOutlined, RightOutlined, BankOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { useAuthStore } from "@/stores/auth.store"; // Importamos el store de autenticación

export default function DetallesPlantel() {
  const { slug } = useParams();
  const { role } = useAuthStore(); // Obtenemos el rol del usuario

  // Función para determinar si mostrar enlace o no
  const renderPlantelesBreadcrumb = () => {
    if (role === 1) { // Admin - con enlace
      return (
        <Link to="/admin/planteles">
          <BankOutlined /> Planteles
        </Link>
      );
    }
    // Director - sin enlace
    return <><BankOutlined /> Planteles</>;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
        gridTemplateRows: "auto auto auto auto auto auto  ",
        gap: "16px",
        height: "calc(100vh - 64px - 48px)",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="dashboard-container"
    >
      <div style={{ gridColumn: "1 / span 3" }}>
        <Breadcrumb separator={<RightOutlined />}>
          <Breadcrumb.Item>
            <Link to="/admin">
              <HomeOutlined /> Dashboard
            </Link>
          </Breadcrumb.Item>
          
          <Breadcrumb.Item>
            {renderPlantelesBreadcrumb()}
          </Breadcrumb.Item>
          
          <Breadcrumb.Item>
            <BankOutlined /> {slug}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <DetallesCarrera />
      <ObjetivoPlantel />
      <IncidenciasPlantel />
    </div>
  );
}