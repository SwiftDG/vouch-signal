import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10">
      <Link to="/" className="font-['Bricolage_Grotesque'] text-2xl font-bold text-[#18251d]">vouch<span className="text-[#527a38]">/</span></Link>
      <div className="flex items-center gap-5"><Link to="/login" className="text-sm text-[#59665d] hover:text-[#18251d]">Sign in</Link><Link to="/dashboard" className="inline-flex items-center gap-2 bg-[#18251d] px-4 py-3 text-sm font-medium text-white hover:bg-[#31503a]">My profile <ArrowUpRight size={16} /></Link></div>
    </header>
  );
}
