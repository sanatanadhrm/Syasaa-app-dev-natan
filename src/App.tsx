import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { useContext, useEffect, useState } from "react";
import { LoginPage } from "./pages/login/Login";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { UserPage } from "./pages/users/UserPage";
import { AddUserPage } from "./pages/users/Add/AddUserPage";
import { EditUserPage } from "./pages/users/Edit/EditUserPage";
import { RolePage } from "./pages/roles/RolePage";
import { EditRolePage } from "./pages/roles/Edit/EditRolePage";
import { AddRolePage } from "./pages/roles/Add/AddRolePage";
import { PermissionPage } from "./pages/permissions/PermissionPage";
import { AddPermissionPage } from "./pages/permissions/Add/AddPermissionPage";
import { EditPermissionPage } from "./pages/permissions/Edit/EditPermissionPage";
import { AuthContext } from "./context/Auth";
import Cookies from "js-cookie";
import fetchAPI from "./fetch";
import { CoursePage } from "./pages/course/CoursePage";
import { AddCoursePage } from "./pages/course/Add/AddCoursePage";
import { EditCoursePage } from "./pages/course/Edit/EditCoursePage";
import { MajorsPage } from "./pages/majors/MajorsPage";
import { AddMajorPage } from "./pages/majors/Add/AddMajorPage";
import { FacultiesPage } from "./pages/faculty/FacultiesPage";
import { AddFacultiesPage } from "./pages/faculty/Add/AddFacultiesPage";
import { EditFacultiesPage } from "./pages/faculty/Edit/EditFacultiesPage";
import { EditMajorPage } from "./pages/majors/Edit/EditMajorPage";
import { ClassPage } from "./pages/class/ClassPage";
import { AddClassPage } from "./pages/class/Add/AddClassPage";
import { EditClassPage } from "./pages/class/Edit/EditClassPage";
import { CourseClass } from "./pages/courses_classes/CourseClassPage";
import { AttendancesPage } from "./pages/attendances/AttendancesPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { AttendanceRequestPage } from "./pages/attendance_request/AttendanceRequestPage";
import { EditProfileRequestPage } from "./pages/profile/Edit/EditProfileRequestPage";
import { AddAttendancesPage } from "./pages/attendances/Add/AddAttendancesPage";
import { useGeoLocation } from "./hooks/useGeoLocation";
import { EditProfilePage } from "./pages/profile/Edit/EditProfilePage";
import { AddAttandanceRequest } from "./pages/attendance_request/Add/AddAttandanceRequest";
import { AddCourseClassPage } from "./pages/courses_classes/Add/AddCourseClassPage";
import { EditCourseClassPage } from "./pages/courses_classes/Edit/EditCourseClassPage";
import { EditAttancanceRequest } from "./pages/attendance_request/Edit/EditAttandanceRequest";
import { ProgileRequestsPage } from "./pages/profile_requests/ProfileRequestsPage";
import { EditUserProfileRequestPage } from "./pages/profile_requests/Edit/EditUserProfileRequestPage";

setupIonicReact();

const App: React.FC = () => {
  const { isLogin, setIsLogin } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const getAuth = async () => {
      try {
        const response = await fetchAPI("/user", {
          method: "GET",
        });

        const data = await response.json();

        if (data.message === "Unauthenticated.") {
          setIsLogin({
            isLogin: false,
            isPending: false,
          });
        } else {
          setIsLogin({
            isLogin: true,
            isPending: false,
            data: data,
          });
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (error) {
        setIsLogin({
          isLogin: false,
          isPending: false,
        });
      }
    };

    getAuth();
  }, [isLogin.isLogin]);

  if (isLogin.isPending) {
    return (
      <div className="d-flex absolute justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        {!isMobile ? (
          <IonRouterOutlet>
            <Redirect
              exact
              path="/"
              to={!isLogin.isLogin ? "/login" : "/dashboard"}
            />
            <Route
              exact
              path="/login"
              render={() =>
                !isLogin.isLogin ? (
                  <LoginPage />
                ) : (
                  <Redirect to={"/dashboard"} />
                )
              }
            />
            <Route
              exact
              path="/dashboard"
              render={() =>
                isLogin.isLogin ? <DashboardPage /> : <Redirect to={"/login"} />
              }
            />
            <Route
              exact
              path="/users"
              render={() =>
                isLogin.isLogin ? <UserPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/users/add"
              render={() =>
                isLogin.isLogin ? <AddUserPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/users/edit/:id"
              render={() =>
                isLogin.isLogin ? <EditUserPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/roles"
              render={() =>
                isLogin.isLogin ? <RolePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/roles/edit/:id"
              render={() =>
                isLogin.isLogin ? <EditRolePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/roles/add"
              render={() =>
                isLogin.isLogin ? <AddRolePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/permissions"
              render={() =>
                isLogin.isLogin ? <PermissionPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/permissions/add"
              render={() =>
                isLogin.isLogin ? (
                  <AddPermissionPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/permissions/edit/:id"
              render={() =>
                isLogin.isLogin ? (
                  <EditPermissionPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/courses"
              render={() =>
                isLogin.isLogin ? <CoursePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/courses/add"
              render={() =>
                isLogin.isLogin ? <AddCoursePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/courses/edit/:id"
              render={() =>
                isLogin.isLogin ? <EditCoursePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/classes"
              render={() =>
                isLogin.isLogin ? <ClassPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/classes/add"
              render={() =>
                isLogin.isLogin ? <AddClassPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/classes/edit/:id"
              render={() =>
                isLogin.isLogin ? <EditClassPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/majors"
              render={() =>
                isLogin.isLogin ? <MajorsPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/majors/add"
              render={() =>
                isLogin.isLogin ? <AddMajorPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/majors/edit/:id"
              render={() =>
                isLogin.isLogin ? <EditMajorPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/faculties"
              render={() =>
                isLogin.isLogin ? <FacultiesPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/faculties/add"
              render={() =>
                isLogin.isLogin ? (
                  <AddFacultiesPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/faculties/edit/:id"
              render={() =>
                isLogin.isLogin ? (
                  <EditFacultiesPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/schedules"
              render={() =>
                isLogin.isLogin ? <CourseClass /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/schedules/add"
              render={() =>
                isLogin.isLogin ? (
                  <AddCourseClassPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/schedules/edit/:id"
              render={() =>
                isLogin.isLogin ? (
                  <EditCourseClassPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/attendances"
              render={() =>
                isLogin.isLogin ? <AttendancesPage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/attendances/add"
              render={() =>
                isLogin.isLogin ? (
                  <AddAttendancesPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/profile"
              render={() =>
                isLogin.isLogin ? <ProfilePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/profile/edit-request/:id"
              render={() =>
                isLogin.isLogin ? (
                  <EditProfileRequestPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/profile/edit/:id"
              render={() =>
                isLogin.isLogin ? <EditProfilePage /> : <Redirect to="/login" />
              }
            />
            <Route
              exact
              path="/attendance-requests"
              render={() =>
                isLogin.isLogin ? (
                  <AttendanceRequestPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/attendance-requests/add"
              render={() =>
                isLogin.isLogin ? (
                  <AddAttandanceRequest />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/attendance-requests/edit/:id"
              render={() =>
                isLogin.isLogin ? (
                  <EditAttancanceRequest />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/profile-requests"
              render={() =>
                isLogin.isLogin ? (
                  <ProgileRequestsPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/profile-requests/edit/:id"
              render={() =>
                isLogin.isLogin ? (
                  <EditUserProfileRequestPage />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
          </IonRouterOutlet>
        ) : (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tab1">
                <Tab1 />
              </Route>
              <Route exact path="/tab2">
                <Tab2 />
              </Route>
              <Route path="/tab3">
                <Tab3 />
              </Route>
              <Route exact path="/">
                <Redirect to="/tab1" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tab1">
                <IonIcon aria-hidden="true" icon={triangle} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon aria-hidden="true" icon={ellipse} />
                <IonLabel>My Absence</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
                <IonIcon aria-hidden="true" icon={square} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
