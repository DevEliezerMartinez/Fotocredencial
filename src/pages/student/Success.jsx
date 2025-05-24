import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header_app from "../../components/student/Header";

function Success() {
  const navigate = useNavigate();

  return (
    <div>
      <Header_app/>
      <Result
        status="success"
        title="Registrado exitosamente"
        subTitle="Muchas gracias, en cuanto tengamos más noticias te informaremos"
        extra={[
          <Button 
            type="primary" 
            key="finish" 
            onClick={() => navigate('/')}
          >
            Terminar
          </Button>,
        ]}
      />
    </div>
  );
}

export default Success;