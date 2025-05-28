import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import logo from "@/assets/img/logo_transparente.png";
import "@/assets/css/header.css"; // Archivo CSS que crearemos

const HeaderStudents = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      key: "inicio",
      label: "Inicio",
      onClick: () =>
        (window.location.href = "http://credenciales.universidad-une.com/"),
    },
    {
      key: "campus",
      label: "Campus digital",
      onClick: () => {
        window.location.href =
          "http://credenciales.universidad-une.com/#campus";
      },
    },
    
    {
      key: "beneficios",
      label: "Beneficios Santander",
      onClick: () => {
        const beneficiosSection = document.getElementById("Beneficios");
        if (beneficiosSection) {
          beneficiosSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href =
            "http://credenciales.universidad-une.com/#Beneficios";
        }
      },
    },
    {
      key: "acceso",
      label: "Acceso",
      onClick: () => {
        navigate("/login");
      },
    },
  ];

  const handleLogoClick = () => {
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Logo */}
        <a href="#" onClick={handleLogoClick} className="navbar-logo">
          <img src={logo} className="logo-une" alt="UNE Logo" />
        </a>

        {/* Mobile menu button */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(true)}
          className="mobile-menu-button"
        />

        {/* Desktop menu */}
        <Menu mode="horizontal" items={menuItems} className="desktop-menu" />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Menú"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={250}
        className="mobile-drawer"
      >
        <Menu
          mode="vertical"
          items={menuItems}
          className="mobile-menu"
          onClick={(item) => {
            menuItems.find((i) => i.key === item.key).onClick();
            setMobileMenuOpen(false);
          }}
        />
      </Drawer>
    </nav>
  );
};

export default HeaderStudents;
