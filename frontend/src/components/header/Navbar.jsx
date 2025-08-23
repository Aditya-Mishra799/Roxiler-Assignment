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
  User2Icon,
  Home,
} from "lucide-react";
import useWindowWidth from "../../hooks/useWindowWidth";

const Navbar = () => {
  const { authState } = useAuth();
  const windowWidth = useWindowWidth();

  const dashboardLink = {
    owner: "/owner-dashboard",
    admin: "/admin-dashboard",
  };
  const links = [
    {
      label: "Home",
      href: "/",
      visible: authState.isAuthenticated,
      Icon: Home,
    },
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
      href: authState.isAuthenticated
        ? dashboardLink[authState.user?.role]
        : "/",
      visible: authState.isAuthenticated && ["admin", "owner"].includes(authState.user?.role),
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
    {
      label: "Search Users",
      href: "/search-users",
      visible: authState.isAuthenticated && authState.user?.role === "admin",
      Icon: User2Icon,
    },
    {
      label: "Search Stores",
      href: "/search-stores",
      visible:
        authState.isAuthenticated &&
        ["admin", "user"].includes(authState.user?.role),
      Icon: User2Icon,
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
          {links.filter((link)=>link.visible).map((link) => (
          <NavItem {...link} key={link.href} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
