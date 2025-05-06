import { useNavigate } from "react-router-dom";
import logo from "@/assets/img/logo_transparente.png";
import "@/assets/css/header.css";

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/"); // Redirige a la ruta raíz sin recargar
  };

  return (
    <header className="header_app">
      <img 
        src={logo} 
        alt="Logo UNE" 
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      />
      <h1>Credencial - Campus Digital</h1>
    </header>
  );
}

export default Header;
