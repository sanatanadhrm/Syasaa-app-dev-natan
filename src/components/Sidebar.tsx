import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export const Sidebar = () => {
  const [list, setList] = useState<any>([]);
  const location = useLocation();
  // const { isLogin, setIsLogin } = useContext(AuthContext);
  const [user, setUser] = useState();

  const getList = (user) => {
    let list = [];

    if (user.role_id === 1) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Users",
          link: "/users",
        },
        {
          name: "Faculties",
          link: "/faculties",
        },
        {
          name: "Majors",
          link: "/majors",
        },
        {
          name: "Classes",
          link: "/classes",
        },
        {
          name: "Courses",
          link: "/courses",
        },
        {
          name: "Schedules",
          link: "/schedules",
        },
        {
          name: "Roles",
          link: "/roles",
        },
        {
          name: "Permissions",
          link: "/permissions",
        },
        {
          name: "Attendances",
          link: "/attendances",
        },
        {
          name: "Attendance Requests",
          link: "/attendance-requests",
        },
        {
          name: "Profile Requests",
          link: "/profile-requests",
        },
      ];
      setList(list);
    } else if (user.role_id === 2) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Lecturers",
          link: "/users",
        },
        {
          name: "Majors",
          link: "/majors",
        },
        {
          name: "Schedules",
          link: "/schedules",
        },
        {
          name: "Attendances",
          link: "/attendances",
        },
      ];
      setList(list);
    } else if (user.role_id === 3) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Students",
          link: "/users",
        },
        {
          name: "Schedules",
          link: "/schedules",
        },
        {
          name: "Attendances",
          link: "/attendances",
        },
        {
          name: "Attendance Requests",
          link: "/attendance-requests",
        },
      ];
      setList(list);
    } else if (user.role_id === 4) {
      list = [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Schedules",
          link: "/schedules",
        },
        {
          name: "Attendances",
          link: "/attendances",
        },
        {
          name: "Attendance Requests",
          link: "/attendance-requests",
        },
        {
          name: "Profile Requests",
          link: "/profile-requests",
        },
      ];
      setList(list);
    } else {
      console.log("guest");
    }
  };

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user") || "{}");
    if (getuser) {
      getList(getuser);
    }
  }, []);

  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark ps bg-white"
      id="sidenav-main"
    >
      <div className="sidenav-header d-flex justify-content-center align-items-center">
        <span className="ms-1 font-weight-bold text-white">{appName}</span>
      </div>
      <div
        className="collapse navbar-collapse h-100"
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          {list.map((item: any, index: number) => {
            return (
              <li key={index} className="nav-item">
                <Link
                  to={item.link}
                  className={`nav-link text-white ${
                    location.pathname.includes(item.link)
                      ? "active bg-primary bg-opacity-25"
                      : ""
                  }`}
                >
                  <span className="nav-link-text ms-1">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
