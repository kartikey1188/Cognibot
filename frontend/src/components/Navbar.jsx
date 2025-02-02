import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slice/authSlice';
import { Button } from '@mui/material';
export const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const studentLinks = [
    { to: '/dashboard', text: 'Dashboard' },
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
      case 'student':
        return studentLinks;
      // case 'instructor':
      //   return instructorLinks;
      // case 'admin':
      //   return adminLinks;
      default:
        return [];
  };
  };
  return (
    <nav className="bg-blue-800 p-4 fixed w-full top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold">
          Seek
        </Link>
        
        <div className="flex gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-white">Login</Link>
              <Link to="/signup" className="text-white">Signup</Link>
            </>
          ) : (
            <> 
              {getNavLinks().map(link => (
                <Link key={link.to} to={link.to} className="text-white">
                  {link.text}
                </Link>
              ))}
              <Button onClick={handleLogout}>Logout</Button>
            </>
           )}
        </div>
      </div>
    </nav>
  );
};