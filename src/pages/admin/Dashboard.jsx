import { Breadcrumb, Card } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import IncidenciasPlantelCard from "@/components/admin/IncidenciasPlantelCard";
import IncidenciasEstudiantesCard from "@/components/admin/IncidenciasEstudiantesCard";
import ObjetivoCard from "@/components/admin/ObjetivoCard";
import ResumenGeneralCard from "@/components/admin/ResumenGeneralCard";
import PlantelesIncidencias from "@/components/admin/PlantelesIncidencias";

export default function Dashboard() {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <HomeOutlined /> Dashboard
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Contenedor principal con scroll interno */}
      <div
        style={{
          flex: 1,
          padding: "0 24px 24px",
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gridAutoRows: "min-content",
          gap: "16px",
          alignContent: "flex-start",
        }}
      >
        {/* Tarjetas principales */}
        <IncidenciasPlantelCard />

        <IncidenciasEstudiantesCard />

        <ObjetivoCard />

        <ResumenGeneralCard />

        <PlantelesIncidencias />
      </div>
    </div>
  );
}
