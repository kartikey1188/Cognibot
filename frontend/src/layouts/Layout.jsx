import { Outlet, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
const Layout = () => {
  return (
    <div>
      <Navbar></Navbar>

      {/* Content will be rendered here */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
