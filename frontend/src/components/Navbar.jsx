import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slice/authSlice";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";
import { IconButton } from "@mui/material";
import { toggleSidebar } from "../redux/slice/uiSlice";

export const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  
  const dashboardPaths = ['/dashboard', '/recommendations', '/profile'];
  const isDashboardRoute = dashboardPaths.some(path => 
    location.pathname === path
  );

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const studentLinks = [
    // { to: '/dashboard', text: 'Dashboard' },
    // { to: '/courses', text: 'My Courses' },
  ];

  //   const instructorLinks = [
  //     { to: '/instructor/dashboard', text: 'Dashboard' },
  //     { to: '/instructor/courses', text: 'Manage Courses' },
  //   ];

  //   const adminLinks = [
  //     { to: '/admin/dashboard', text: 'Dashboard' },
  //     { to: '/admin/users', text: 'Manage Users' },
  //     { to: '/admin/courses', text: 'Manage Courses' },
  //   ];

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case "student":
        return studentLinks;
      // case 'instructor':
      //   return instructorLinks;
      // case 'admin':
      //   return adminLinks;
      default:
        return [];
    }
  };
  return (
    <nav className="p-3 fixed w-full bg-white top-0 border border-1 border-gray-300 z-10">
      <div className="flex justify-between items-center">
        <Link to="/" className="bg-black rounded-full border border-2">
          <img
            src="/graduation-cap-circular-button-svgrepo-com.svg"
            width="40px"
            alt=""
          />
        </Link>

        <div className="flex gap-4 justify-self-start items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-800 bg-gray-200 px-[1em] py-[0.5em] rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white  bg-black px-[1em] py-[0.5em] rounded"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <div className="text-lg font-bold">Welcome, {user.name}!</div>
              {getNavLinks().map((link) => (
                <Link key={link.to} to={link.to} className="text-white">
                  {link.text}
                </Link>
              ))}
              <Button
                onClick={handleLogout}
                sx={{ backgroundColor: "#129fe0" }}
                color="info"
                variant="contained"
                size="large"
              >
                <LogoutIcon fontSize="small"></LogoutIcon>
              </Button>
              {isMobile && isDashboardRoute && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={() => dispatch(toggleSidebar())}
                >
                  <MenuIcon size="large" />
                </IconButton>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
