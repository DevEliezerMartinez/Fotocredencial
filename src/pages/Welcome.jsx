import Header_app from "../components/Header";
import bienvenida_svg from "@/assets/img/undraw_hello.svg";
import "@/assets/css/welcome.css";
import { useNavigate } from "react-router-dom";
function Welcome() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/core"); 
  };

  return (
    <>
      <Header_app />
      <section className="content">
        <img
          style={{ width: "50%" }}
          id="img_bienvenida"
          src={bienvenida_svg}
          alt="Logo UNE"
        />

        <div className="greetings">
          <h3>Bienvenido</h3>
          <h4>Eliezer Solano</h4>
          <p>
            En este espacio podras capturar tu mejor sonrisa para tu nueva
            credencial digital institucional. Esta imagen te representará
            oficialmente, ¡así que muestra tu mejor versión!
          </p>
        </div>

        <div className="actions">
          <button onClick={handleStartClick} className="start">
            Empezar
          </button>
          <button className="goback">Regresar</button>
        </div>
      </section>
    </>
  );
}

export default Welcome;
