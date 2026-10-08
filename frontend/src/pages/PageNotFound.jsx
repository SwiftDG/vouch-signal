import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Brand from "../components/Brand";

export default function PageNotFound() {
  return <div className="app-page"><header className="app-header"><div className="app-header-inner"><Brand /></div></header><main className="app-main not-found"><span className="section-label">Page not found</span><h1 className="app-title">Nothing at this address.</h1><p className="app-lede">The link may have changed, or the page does not exist.</p><Link className="app-button" to="/"><ArrowLeft size={17} /> Back to Vouch</Link></main></div>;
}
