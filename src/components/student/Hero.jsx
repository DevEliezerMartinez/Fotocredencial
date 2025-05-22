import React from "react";
import { Row, Col, Typography } from "antd";
import heroImage from "@/assets/img/hero-image.svg";
import "../../assets/css/hero.css";
import StudentValidation from "./StudentValidation";

const { Title, Paragraph } = Typography;

const Hero = () => {
  return (
    <div className="hero-container">
      <Row gutter={[24, 24]} align="middle">
        {/* Columna de imagen - Primera en mobile, izquierda en desktop */}
        <Col xs={24} md={12} className="hero-image-column">
          <div className="image-wrapper">
            <img
              src={heroImage}
              alt="Estudiante sonriendo"
              className="hero-image"
            />
          </div>
        </Col>

        {/* Columna de contenido - Segunda en mobile, derecha en desktop */}
        <Col xs={24} md={12} className="hero-content-column">
          <Title level={1} className="hero-title">
            Credencial - Campus Digital
          </Title>

          <h3 className="hero-subtitle ">
            Bienvenido
          </h3>
          
          <Paragraph className="hero-paragraph">
            En este espacio podrás capturar tu mejor sonrisa para tu credencial 
            digital institucional. Esta imagen te representará oficialmente, 
            ¡muestra tu mejor versión! Primero vamos a validar tus datos como te gustaria empezar?
          </Paragraph>
          
         <StudentValidation/>
        </Col>
      </Row>
    </div>
  );
};

export default Hero;