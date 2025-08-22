import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NavItem from "./NavItem";
import {
  LogOut,
  KeyRound,
  UserPlus,
  LayoutDashboard,
  SmilePlus,
  Menu,
  X,
  StoreIcon,
} from "lucide-react";
import useWindowWidth from "../../assets/hooks/useWindowWidth";

const Navbar = () => {
  const {authState} = useAuth();
  const windowWidth = useWindowWidth();
  const links = [
    {
      label: "Login",
      href: "/login",
      visible: !authState.isAuthenticated,
      Icon: KeyRound,
    },
    {
      label: "Register",
      href: "/register",
      visible: !authState.isAuthenticated,
      Icon: UserPlus,
    },
    {
      label: "Logout",
      href: "/logout",
      visible: authState.isAuthenticated,
      Icon: LogOut,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      visible: authState.isAuthenticated && authState.user?.role === "admin",
      Icon: LayoutDashboard,
    },
    {
      label: "Add User",
      href: "/add-user",
      visible: authState.isAuthenticated && authState.user?.role === "admin",
      Icon: SmilePlus,
    },
    {
      label: "Add Store",
      href: "/add-store",
      visible: authState.isAuthenticated && authState.user?.role === "admin",
      Icon: StoreIcon,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="navbar">
        <div className="nav-top">
          <h3>Menu</h3>
          {windowWidth < 768 && (
            <button onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          )}
        </div>
        {(open || windowWidth >= 768) && (
          <div className="nav-links-cnt">
            {links.map((link) => (
              <NavItem {...link} key={link.href} />
            ))}
          </div>
        )}
    </div>
  );
};

export default Navbar;
