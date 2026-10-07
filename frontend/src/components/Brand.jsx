import { Link } from "react-router-dom";

export default function Brand({ light = false }) {
  return <Link className={light ? "brand brand-light" : "brand"} to="/" aria-label="Vouch home">Vou<span>ch</span></Link>;
}
