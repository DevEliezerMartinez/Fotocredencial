import React from "react";
import { Result, Button } from "antd";
import Header_app from "@/components/public/Header";

export default function Success() {

  return (
    <div>
      <Header_app />
      <Result
        status="success"
        title="Registrado exitosamente"
        subTitle="Muchas gracias, en cuanto tengamos más noticias te informaremos"
        extra={[
          <Button
            type="primary"
            key="finish"
            href="http://credenciales.universidad-une.com/" // Use href for external links
            rel="noopener noreferrer" // Recommended for security with target="_blank"
          >
            Terminar
          </Button>,
        ]}
      />
    </div>
  );
}
