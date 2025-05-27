//src/layouts/AdminLayout.jsx
import { Layout, Menu, Button } from "antd";
import Logo from "@/assets/img/logo_blanco.png";
import { 
  BarChartOutlined, 
  WarningOutlined, 
  BankOutlined,
  TeamOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

// Configuración simplificada de los items del menú
const menuItemsConfig = {
  admin: [
    {
      key: "dashboard",
      icon: <BarChartOutlined />,
      label: "Dashboard",
      path: "/admin/dashboard" // Rutas absolutas
    },
    {
      key: "incidencias",
      icon: <WarningOutlined />,
      label: "Incidencias",
      path: "/admin/incidencias"
    },
    {
      key: "planteles",
      icon: <BankOutlined />,
      label: "Planteles",
      path: "/admin/planteles",
      children: [
        {
          key: "detalles-plantel",
          label: "Detalles Plantel",
          path: "/admin/planteles/:slug"
        }
      ]
    }
  ],
  director: [
    {
      key: "plantel",
      icon: <BankOutlined />,
      label: "Mi Plantel",
      path: (plantel_nombre) => `/admin/planteles/${plantel_nombre}`
    }
  ]
};

// Función para generar items del menú
const getMenuItems = (role, plantel_nombre) => {
  const items = menuItemsConfig[role === 1 ? "admin" : "director"];
  
  return items.map(item => {
    const path = typeof item.path === 'function' 
      ? item.path(plantel_nombre) 
      : item.path;
    
    const menuItem = {
      key: item.key,
      icon: item.icon,
      label: <Link to={path}>{item.label}</Link>
    };

    return menuItem;
  });
};

const FullPageLoading = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5"
  }}>
    <div className="ant-spin ant-spin-lg" />
  </div>
);

const LogoComponent = ({ collapsed }) => (
  <div style={{
    height: "64px",
    margin: collapsed ? "16px 0" : "24px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    transition: "all 0.3s"
  }}>
    <img
      src={Logo}
      alt="Logo"
      style={{
        height: collapsed ? "32px" : "80px",
        transition: "all 0.3s",
        objectFit: "contain"
      }}
    />
  </div>
);

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const { isAuthenticated, isLoading, logout, role, plantel_nombre } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <FullPageLoading />;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Obtener la clave seleccionada del menú basada en la ruta actual
  const getSelectedKeys = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    if (pathParts.length < 2) return ['dashboard'];
    
    // Buscar 'admin' en el path
    const adminIndex = pathParts.indexOf('admin');
    if (adminIndex === -1) return ['dashboard'];
    
    const adminPath = pathParts[adminIndex + 1]; // Lo que viene después de 'admin'
    const subPath = pathParts[adminIndex + 2];   // Para subpaths como planteles/slug
    
    // Si estamos en una ruta de planteles con slug
    if (adminPath === 'planteles') {
      if (subPath) {
        // Estamos viendo detalles de un plantel específico
        return role === 1 ? ['planteles'] : ['plantel'];
      } else {
        // Estamos en la lista de planteles
        return ['planteles'];
      }
    }
    
    return [adminPath || 'dashboard'];
  };

  const menuItems = getMenuItems(role, plantel_nombre);
  const selectedKeys = getSelectedKeys();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="80"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: "2px 0 8px 0 rgba(29, 35, 41, 0.05)"
        }}
      >
        <LogoComponent collapsed={collapsed} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={role === 1 ? ['planteles'] : []}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ 
        marginLeft: collapsed ? 80 : 240,
        transition: "all 0.2s",
        background: "#f0f2f5"
      }}>
        <Header style={{
          padding: "0 24px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0, 21, 41, 0.08)",
          zIndex: 10,
          position: "sticky",
          top: 0
        }}>
          <h1 style={{ 
            margin: 0,
            fontSize: "18px",
            fontWeight: 600,
            color: "rgba(0, 0, 0, 0.85)"
          }}>
            {role === 1 ? "Panel de Administración" : "Panel de Director"}
          </h1>
          <Button 
            type="text" 
            onClick={logout}
            style={{ color: "rgba(0, 0, 0, 0.65)" }}
          >
            Cerrar sesión
          </Button>
        </Header>

        <Content style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          borderRadius: 8
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );}