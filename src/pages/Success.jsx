import React from "react";
import Header_app from "../components/Header";
import success from "@/assets/img/success.svg";
import "@/assets/css/success.css";

function Sucess() {
  return (
    <div className="success_section">
      <Header_app />
      <img className="success_image" src={success} />

      <h3>Registro #153</h3>
      <p>
        Un coordinador revisara tu fotografia y te notificaremos cuando este
        listo
      </p>

      <button>Terminar</button>
    </div>
  );
}

export default Sucess;
