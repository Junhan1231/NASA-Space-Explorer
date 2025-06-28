import { Link, useLocation } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BiBarChart } from 'react-icons/bi';
import { BiSearchAlt2 } from 'react-icons/bi';
import '../css/Sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo">NASA+</div>
      <nav className="nav-icons">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <AiFillHome size={24} title="Home" />
        </Link>
        <Link to="/visualization" className={location.pathname === '/visualization' ? 'active' : ''}>
          <BiBarChart size={24} title="Data Visualization" />
        </Link>
        <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>
          <BiSearchAlt2 size={24} title="Search" />
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
