import { useContext, useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import fetchAPI from "../../fetch";
import { AuthContext } from "../../context/Auth";

interface IDashboard {
  id: string;
  cardSmall?: IcardSmall[];
  cardLarge?: IcardLarge[];
}

interface IcardSmall {
  title: string;
  status: string;
  data: any;
  icon: string;
  gradient: string;
  color_text: string;
  desc: string;
}

interface IcardLarge {
  title: string;
  subtitle: string;
  color: string;
  columns: IcolumnsCardLarge[];
  data: IdataCardLarge[];
  desc: string;
}

interface IdataCardLarge {
  count: number;
  color: string;
}

interface IcolumnsCardLarge {
  title: string;
  color: string;
}

export const DashboardPage = () => {
  const [profileRequest, setProfileRequest] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attendanceRequest, setAttendanceRequest] = useState<any>({});
  const [users, setUsers] = useState<any>({});
  const [faculty, setFaculty] = useState<any>({});
  const [roles, setRoles] = useState<any>({});
  const [permissions, setPermissions] = useState<any>({});
  const [majors, setMajors] = useState<any>({});
  const [classes, setClasses] = useState<any>({});
  const [Attendance, setAttendance] = useState<any>({});
  const [Schedules, setSchedules] = useState<any>({});

  const [courses, setCourses] = useState<any>({});
  const { isLogin, setIsLogin } = useContext(AuthContext);

  const UserLogin = JSON.parse(localStorage.getItem("user"));

  const getRolesData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/roles`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setRoles(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getProfileRequest = async () => {
    try {
      const response = await fetchAPI("/api/v1/update-profile-requests", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin.data.role_id === 1) {
          setProfileRequest(data.data);
        } else if (isLogin.data.role_id === 4) {
          const userFilter = data.data.filter(
            (item) => item.student.user_id === isLogin.data.id
          );
          setProfileRequest(userFilter);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetchAPI("/api/v1/users?paginate=false", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data, "data");
        if (isLogin.data.role_id === 1) {
          return setUsers(data.data);
        } else if (isLogin.data.role_id === 2) {
          const userFilter = data.data.filter((item) => item.role_id === 3);
          return setUsers(userFilter);
        } else if (isLogin.data.role_id === 3) {
          const userFilter = data.data.filter((item) => item.role_id === 4);
          return setUsers(userFilter);
        }
        // setUsers(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getattendanceRequest = async () => {
    try {
      const response = await fetchAPI("/api/v1/attendance-requests", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        const filteredData = data.data.filter(
          (item) => item.status === "pending"
        );

        let userFilter;

        if (isLogin.data.role_id === 1) {
          setAttendanceRequest(data.data);
        } else if (isLogin.data.role_id === 3) {
          userFilter = data.data.filter(
            (item) =>
              item.course_class?.lecturer_id === isLogin.data.lecturer.id
          );
          setAttendanceRequest(userFilter);
        } else if (isLogin.data.role_id === 4) {
          userFilter = data.data.filter(
            (item) => item.student.id === isLogin.data.student.id
          );
          setAttendanceRequest(userFilter);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getFacultyData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/faculties`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setFaculty(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getPermissionsData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/permissions`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setPermissions(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getMajorData = async () => {
    try {
      const response = await fetchAPI(
        `/api/v1/majors?includeClasses=1&paginate=false`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (isLogin.data.role_id === 1) {
          return setMajors(data.data);
        } else if (isLogin.data.role_id === 2) {
          const userFilter = data.data.filter(
            (item) => item.faculty_id === isLogin.data.faculty_staff.faculty_id
          );
          return setMajors(userFilter);
        }
        // setMajors(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getClassesData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/major-classes?paginate=false`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin.data.role_id === 1) {
          return setClasses(data.data);
        } else if (isLogin.data.role_id === 2) {
          const userFilter = data.data.filter(
            (item) =>
              item.major.faculty_id === isLogin.data.faculty_staff.faculty_id
          );
          return setClasses(userFilter);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getCourseClass = async () => {
    try {
      let url;
      if (isLogin.data.role_id === 1) {
        url = `/api/v1/course-classes?paginate=false`;
      } else if (isLogin.data.role_id === 2) {
        url = `/api/v1/course-classes?faculty_id=${isLogin.data.faculty_staff.faculty_id}&paginate=false`;
      } else if (isLogin.data.role_id === 3) {
        url = `/api/v1/course-classes?lecturer_id=${isLogin.data.lecturer.id}&paginate=false`;
      } else if (isLogin.data.role_id === 4) {
        url = `/api/v1/course-classes?class_id=${isLogin.data.student.class_id}&paginate=false`;
      }
      const response = await fetchAPI(url, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data, "data");
      if (response.ok) {
        setSchedules(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getattendance = async () => {
    try {
      let url;
      if (isLogin.data.role_id === 1) {
        url = `/api/v1/attendances?includeCourseClass=1&paginate=false`;
      } else if (isLogin.data.role_id === 2) {
        url = `/api/v1/attendances?includeCourseClass=1&paginate=false&faculty_id=${isLogin.data.faculty_staff.faculty_id}`;
      } else if (isLogin.data.role_id === 3) {
        url = `/api/v1/attendances?includeCourseClass=1&paginate=false&lecturer_id=${isLogin.data.lecturer.id}`;
      } else if (isLogin.data.role_id === 4) {
        url = `/api/v1/attendances?includeCourseClass=1&paginate=false&student_id=${isLogin.data.student.id}`;
      }
      const response = await fetchAPI(url, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data, "data");
      if (response.ok) {
        setAttendance(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getCourses = async () => {
    try {
      let url = `/api/v1/courses?paginate=false`;

      const response = await fetchAPI(url, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data, "data");
      if (response.ok) {
        setCourses(data.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLogin.data) {
      setIsLoading(true);
      return;
    } else {
      setIsLoading(false);
      getProfileRequest();
      getattendanceRequest();
      getUsers();
      getFacultyData();
      getRolesData();
      getPermissionsData();
      getMajorData();
      getClassesData();
      getattendance();
      getCourseClass();
      getCourses();
    }
  }, [isLogin.data]);

  if (!isLogin.data?.role_id || isLoading)
    return (
      <div className="d-flex absolute justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );

  const FacultyDashboard: IDashboard[] = [
    {
      id: "smallCard",
      cardSmall: [
        {
          title: "Lecturers",
          data: Array.isArray(users)
            ? users.filter((item) => item.role_id === 3)
            : 0,
          status: "active",
          icon: "bi bi-person-video3",
          gradient: "success",
          color_text: "text-success",
          desc: "Total Lecturers",
        },
        {
          title: "Majors",
          data: majors,
          status: "active",
          icon: "bi bi-mortarboard-fill",
          gradient: "info",
          color_text: "text-info",
          desc: "Total Majors",
        },
        {
          title: "Classes",
          data: classes,
          status: "active",
          icon: "bi bi-door-open-fill",
          gradient: "warning",
          color_text: "text-warning",
          desc: "Total Classes",
        },
        {
          title: "Attendances ",
          data: Attendance,
          status: "Active",
          icon: "bi bi-person-fill-check",
          gradient: "danger",
          color_text: "text-danger",
          desc: "Total Attendances",
        },
      ],
    },
  ];

  const StudentDashboard: IDashboard[] = [
    {
      id: "smallCard",
      cardSmall: [
        {
          title: "Schedules",
          data: Schedules,
          status: "Active",
          icon: "bi bi-calendar-fill",
          gradient: "warning",
          color_text: "text-warning",
          desc: "Total Schedules",
        },
        {
          title: "attendances",
          data: Attendance,
          status: "Active",
          icon: "bi bi-person-fill-check",
          gradient: "info",
          color_text: "text-info",
          desc: "Total attendances",
        },
        {
          title: "Attendance Requests",
          data: attendanceRequest,
          status: "Active",
          icon: "bi bi-person-fill-check",
          gradient: "success",
          color_text: "text-success",
          desc: "Total attendance Requests",
        },
        {
          title: "Profile Request",
          data: profileRequest,
          status: "Active",
          icon: "bi bi-person-circle",
          gradient: "danger",
          color_text: "text-danger",
          desc: "Total Profile Request",
        },
      ],
    },
    {
      id: "largeCard",
      cardLarge: [
        {
          title: "Attendance Requests Evidence",
          subtitle: "Information",
          color: "bg-gradient-warning",
          columns: [
            {
              title: "Present",
              color: "text-success",
            },
            {
              title: "Sick",
              color: "text-dark",
            },
            {
              title: "Late",
              color: "text-warning",
            },
            {
              title: "Permit",
              color: "text-info",
            },
            {
              title: "Absent",
              color: "text-danger",
            },
          ],
          data: [
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter(
                    (item) => item.evidence === "present"
                  ).length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "sick")
                    .length
                : 0,
              color: "text-dark",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "late")
                    .length
                : 0,
              color: "text-warning",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "permit")
                    .length
                : 0,
              color: "text-info",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "absent")
                    .length
                : 0,
              color: "text-danger",
            },
          ],
          desc: "Summary of Attendance Requests Evidence",
        },
        {
          title: "Attendance Requests Status",
          subtitle: "Information",
          color: "bg-gradient-info",
          columns: [
            {
              title: "Accepted",
              color: "text-success",
            },
            {
              title: "Rejected",
              color: "text-danger",
            },
            {
              title: "Pending",
              color: "text-warning",
            },
          ],
          data: [
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "accepted")
                    .length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "rejected")
                    .length
                : 0,
              color: "text-danger",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "pending")
                    .length
                : 0,
              color: "text-warning",
            },
          ],
          desc: "Summary of Attendance Requests Status",
        },
        {
          title: "Profile Request",
          subtitle: "Information",
          color: "bg-gradient-info",
          columns: [
            {
              title: "Accepted",
              color: "text-success",
            },
            {
              title: "Rejected",
              color: "text-danger",
            },
            {
              title: "Pending",
              color: "text-warning",
            },
          ],
          data: [
            {
              count: Array.isArray(profileRequest)
                ? profileRequest.filter((item) => item.status === "accepted")
                    .length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(profileRequest)
                ? profileRequest.filter((item) => item.status === "rejected")
                    .length
                : 0,
              color: "text-danger",
            },
            {
              count: Array.isArray(profileRequest)
                ? profileRequest.filter((item) => item.status === "pending")
                    .length
                : 0,
              color: "text-warning",
            },
          ],
          desc: "Summary of Profile Request",
        },
      ],
    },
  ];

  const AdminDashboard: IDashboard[] = [
    {
      id: "smallCard",
      cardSmall: [
        {
          title: "Profile Requests",
          status: "pending",
          data: profileRequest,
          icon: "bi bi-person-circle",
          desc: "Profile Request",
          gradient: "warning",
          color_text: "text-warning",
        },

        {
          title: "Staff Faculty",
          data: Array.isArray(users)
            ? users.filter((item) => item.role_id === 2)
            : 0,
          status: "active",
          icon: "bi bi-person-workspace",
          gradient: "success",
          color_text: "text-success",
          desc: "Total Staff - Faculty",
        },
        {
          title: "Lecturers",
          data: Array.isArray(users)
            ? users.filter((item) => item.role_id === 3)
            : 0,
          status: "active",
          icon: "bi bi-person-video3",
          gradient: "info",
          color_text: "text-info",
          desc: "Total Lecturers",
        },
        {
          title: "Students",
          data: Array.isArray(users)
            ? users.filter((item) => item.role_id === 4)
            : 0,
          status: "active",
          icon: "bi bi-person-fill",
          gradient: "danger",
          color_text: "text-danger",
          desc: "Total Students",
        },
        {
          title: "Faculties",
          data: faculty,
          status: "active",
          icon: "bi bi-building-fill",
          gradient: "dark",
          color_text: "text-dark",
          desc: "Total Faculties",
        },
        {
          title: "Majors",
          data: majors,
          status: "active",
          icon: "bi bi-mortarboard-fill",
          gradient: "primary",
          color_text: "text-primary",
          desc: "Total Majors",
        },
        {
          title: "Classes",
          data: classes,
          status: "active",
          icon: "bi bi-door-open-fill",
          gradient: "secondary",
          color_text: "text-secondary",
          desc: "Total Classes",
        },
        {
          title: "Attendances",
          data: Attendance,
          status: "active",
          icon: "bi bi-person-fill-check",
          gradient: "warning",
          color_text: "text-warning",
          desc: "Total Attendances",
        },
        {
          title: "Schedules",
          data: Schedules,
          status: "active",
          icon: "bi bi-calendar-fill",
          gradient: "info",
          color_text: "text-info",
          desc: "Total Schedules",
        },
        {
          title: "Permissions",
          data: permissions,
          status: "active",
          icon: "bi bi-universal-access",
          gradient: "success",
          color_text: "text-success",
          desc: "Total Permissions",
        },
        {
          title: "Roles",
          data: roles,
          status: "active",
          icon: "bi bi-person-fill-gear",
          gradient: "danger",
          color_text: "text-danger",
          desc: "Total Roles",
        },
        {
          title: "Courses",
          data: courses,
          status: "active",
          icon: "bi bi-book-fill",
          gradient: "dark",
          color_text: "text-dark",
          desc: "Total Courses",
        },
      ],
    },
    {
      id: "largeCard",
      cardLarge: [
        {
          title: "Attendance Requests Evidence",
          subtitle: "Information",
          color: "bg-gradient-warning",
          columns: [
            {
              title: "Present",
              color: "text-success",
            },
            {
              title: "Sick",
              color: "text-dark",
            },
            {
              title: "Late",
              color: "text-warning",
            },
            {
              title: "Permit",
              color: "text-info",
            },
            {
              title: "Absent",
              color: "text-danger",
            },
          ],
          data: [
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter(
                    (item) => item.evidence === "present"
                  ).length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "sick")
                    .length
                : 0,
              color: "text-dark",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "late")
                    .length
                : 0,
              color: "text-warning",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "permit")
                    .length
                : 0,
              color: "text-info",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "absent")
                    .length
                : 0,
              color: "text-danger",
            },
          ],
          desc: "Summary of Attendance Requests Evidence",
        },
        {
          title: "Attendance Requests Status",
          subtitle: "Information",
          color: "bg-gradient-info",
          columns: [
            {
              title: "Accepted",
              color: "text-success",
            },
            {
              title: "Rejected",
              color: "text-danger",
            },
            {
              title: "Pending",
              color: "text-warning",
            },
          ],
          data: [
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "accepted")
                    .length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "rejected")
                    .length
                : 0,
              color: "text-danger",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "pending")
                    .length
                : 0,
              color: "text-warning",
            },
          ],
          desc: "Summary of Attendance Requests Status",
        },
        {
          title: "Profile Request",
          subtitle: "Information",
          color: "bg-gradient-info",
          columns: [
            {
              title: "Accepted",
              color: "text-success",
            },
            {
              title: "Rejected",
              color: "text-danger",
            },
            {
              title: "Pending",
              color: "text-warning",
            },
          ],
          data: [
            {
              count: Array.isArray(profileRequest)
                ? profileRequest.filter((item) => item.status === "accepted")
                    .length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(profileRequest)
                ? profileRequest.filter((item) => item.status === "rejected")
                    .length
                : 0,
              color: "text-danger",
            },
            {
              count: Array.isArray(profileRequest)
                ? profileRequest.filter((item) => item.status === "pending")
                    .length
                : 0,
              color: "text-warning",
            },
          ],
          desc: "Summary of Profile Request",
        },
      ],
    },
  ];

  const LecturerDashboard = [
    {
      id: "smallCard",
      cardSmall: [
        {
          title: "Students",
          data: Array.isArray(users)
            ? users.filter((item) => item.role_id === 4)
            : 0,
          status: "active",
          icon: "bi bi-person-fill",
          gradient: "success",
          color_text: "text-success",
          desc: "Total Students",
        },
        {
          title: "Attendances",
          data: Attendance,
          status: "Total",
          icon: "bi bi-person-fill-check",
          gradient: "warning",
          color_text: "text-warning",
          desc: "Total Attendances",
        },
        {
          title: "Schedules",
          data: Schedules,
          status: "Total",
          icon: "bi bi-calendar-fill",
          gradient: "info",
          color_text: "text-info",
          desc: "Total Schedules",
        },
        {
          title: "Attendance Requests",
          data: attendanceRequest,
          status: "Total",
          icon: "bi bi-person-fill-check",
          gradient: "danger",
          color_text: "text-danger",
          desc: "Total Attendance Requests",
        },
      ],
    },
    {
      id: "largeCard",
      cardLarge: [
        {
          title: "Attendance Requests Evidence",
          subtitle: "Information",
          color: "bg-gradient-warning",
          columns: [
            {
              title: "Present",
              color: "text-success",
            },
            {
              title: "Sick",
              color: "text-dark",
            },
            {
              title: "Late",
              color: "text-warning",
            },
            {
              title: "Permit",
              color: "text-info",
            },
            {
              title: "Absent",
              color: "text-danger",
            },
          ],
          data: [
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter(
                    (item) => item.evidence === "present"
                  ).length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "sick")
                    .length
                : 0,
              color: "text-dark",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "late")
                    .length
                : 0,
              color: "text-warning",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "permit")
                    .length
                : 0,
              color: "text-info",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.evidence === "absent")
                    .length
                : 0,
              color: "text-danger",
            },
          ],
          desc: "Summary of Attendance Requests Evidence",
        },
        {
          title: "Attendance Requests Status",
          subtitle: "Information",
          color: "bg-gradient-info",
          desc: "Summary of Attendance Requests Status",
          columns: [
            {
              title: "Accepted",
              color: "text-success",
            },
            {
              title: "Rejected",
              color: "text-danger",
            },
            {
              title: "Pending",
              color: "text-warning",
            },
          ],
          data: [
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "accepted")
                    .length
                : 0,
              color: "text-success",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "rejected")
                    .length
                : 0,
              color: "text-danger",
            },
            {
              count: Array.isArray(attendanceRequest)
                ? attendanceRequest.filter((item) => item.status === "pending")
                    .length
                : 0,
              color: "text-warning",
            },
          ],
        },
      ],
    },
  ];

  console.log(LecturerDashboard, "Dashboard");

  return (
    <UserLayout>
      {isLogin.data.role_id === 1
        ? AdminDashboard.map((item, index) => {
            if (item.id === "smallCard") {
              return (
                <div className="row" key={index}>
                  {item.cardSmall?.map(
                    (item, index) =>
                      (
                        <div
                          className="col-xl-3 col-sm-6 mb-xl-0 mb-4 my-4"
                          key={index}
                        >
                          <div className="card">
                            <div className="card-header p-3 pt-2">
                              <div
                                className={`d-flex justify-content-center align-items-center icon-lg text-white  bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute `}
                              >
                                <i className={item.icon}></i>
                              </div>
                              <div className="text-end pt-1">
                                <p className="text-sm mb-0 text-capitalize text-bold">
                                  {item.title}
                                </p>
                                {item.status && (
                                  <p
                                    className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                                  >
                                    {item.status}
                                  </p>
                                )}
                                <h4 className={`mb-0 ${item.color_text}`}>
                                  {item.data?.length || 0}
                                </h4>
                              </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                              <p className="mb-0">{item.desc}</p>
                            </div>
                          </div>
                        </div>
                      ) || null
                  )}
                </div>
              );
            } else {
              return (
                <div
                  className="row mt-4 d-flex justify-content-center"
                  key={index}
                >
                  {item.cardLarge?.map((item, index) => (
                    <div className=" col-md-6 mt-4 mb-4" key={index}>
                      <div className="card z-index-2  ">
                        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                          <div className="bg-gradient-secondary shadow-dark border-radius-lg py-3 pe-1 text-start px-3 d-flex flex-column gap-2">
                            <h4 className={`mb-0 text-white`}>{item.title}</h4>
                            <h4 className={`mb-0 text-white text-lg `}>
                              {item.subtitle}
                            </h4>
                          </div>
                        </div>
                        <div
                          className="card-body"
                          style={{ maxWidth: "100%", overflowX: "auto" }}
                        >
                          <table className="table align-items-center mb-0">
                            <thead>
                              <tr>
                                {item.columns.map((item, index) => (
                                  <th
                                    key={index}
                                    className={`text-uppercase text-sm text-center ${item.color}`}
                                  >
                                    {item.title}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {item.data.map((item, index) => (
                                  <td className="align-middle text-center">
                                    <h4 className={`mb-0 ${item.color}`}>
                                      {item.count || 0}
                                    </h4>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                          <hr className="dark horizontal" />
                          <div className="d-flex ">
                            <p className="mb-0 text-md">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || null}
                </div>
              );
            }
          })
        : isLogin.data.role_id === 4
        ? StudentDashboard.map((item, index) => {
            if (item.id === "smallCard") {
              return (
                <div className="row" key={index}>
                  {item.cardSmall?.map(
                    (item, index) =>
                      (
                        <div
                          className="col-xl-3 col-sm-6 mb-xl-0 mb-4 my-4"
                          key={index}
                        >
                          <div className="card">
                            <div className="card-header p-3 pt-2">
                              <div
                                className={`d-flex justify-content-center align-items-center icon-lg text-white  bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute `}
                              >
                                <i className={item.icon}></i>
                              </div>
                              <div className="text-end pt-1">
                                <p className="text-sm mb-0 text-capitalize text-bold">
                                  {item.title}
                                </p>
                                {item.status && (
                                  <p
                                    className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                                  >
                                    {item.status}
                                  </p>
                                )}
                                <h4 className={`mb-0 ${item.color_text}`}>
                                  {item.data.length || 0}
                                </h4>
                              </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                              <p className="mb-0">{item.desc}</p>
                            </div>
                          </div>
                        </div>
                      ) || null
                  )}
                </div>
              );
            } else {
              return (
                <div
                  className="row mt-4 d-flex justify-content-center"
                  key={index}
                >
                  {item.cardLarge?.map((item, index) => (
                    <div className=" col-md-6 mt-4 mb-4" key={index}>
                      <div className="card z-index-2  ">
                        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                          <div className="bg-gradient-secondary shadow-dark border-radius-lg py-3 pe-1 text-start px-3 d-flex flex-column gap-2">
                            <h4 className={`mb-0 text-white`}>{item.title}</h4>
                            <h4 className={`mb-0 text-white text-lg `}>
                              {item.subtitle}
                            </h4>
                          </div>
                        </div>
                        <div
                          className="card-body"
                          style={{ maxWidth: "100%", overflowX: "auto" }}
                        >
                          <table className="table align-items-center mb-0">
                            <thead>
                              <tr>
                                {item.columns.map((item, index) => (
                                  <th
                                    key={index}
                                    className={`text-uppercase text-sm text-center ${item.color}`}
                                  >
                                    <span className="text-center">
                                      {item.title}
                                    </span>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {item.data.map((item, index) => (
                                  <td className="align-middle text-center">
                                    <h4
                                      className={`${item.color} d-flex justify-content-center align-items-center`}
                                    >
                                      {item.count || 0}
                                    </h4>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                          <hr className="dark horizontal" />
                          <div className="d-flex ">
                            <p className="mb-0 text-md">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || null}
                </div>
              );
            }
          })
        : isLogin.data.role_id === 2
        ? FacultyDashboard.map((item, index) => {
            if (item.id === "smallCard") {
              return (
                <div className="row" key={index}>
                  {item.cardSmall?.map(
                    (item, index) =>
                      (
                        <div className="col-sm-6 mb-xl-0 mb-4 my-4" key={index}>
                          <div className="card">
                            <div className="card-header p-3 pt-2">
                              <div
                                className={`d-flex justify-content-center align-items-center icon-lg text-white  bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute `}
                              >
                                <i className={item.icon}></i>
                              </div>
                              <div className="text-end pt-1">
                                <p className="text-sm mb-0 text-capitalize text-bold">
                                  {item.title}
                                </p>
                                {item.status && (
                                  <p
                                    className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                                  >
                                    {item.status}
                                  </p>
                                )}
                                <h4 className={`mb-0 ${item.color_text}`}>
                                  {item.data.length || 0}
                                </h4>
                              </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                              <p className="mb-0">{item.desc}</p>
                            </div>
                          </div>
                        </div>
                      ) || null
                  )}
                </div>
              );
            } else {
              return (
                <div
                  className="row mt-4 d-flex justify-content-center"
                  key={index}
                >
                  {item.cardLarge?.map((item, index) => (
                    <div className=" col-md-6 mt-4 mb-4" key={index}>
                      <div className="card z-index-2  ">
                        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                          <div className="bg-gradient-secondary shadow-dark border-radius-lg py-3 pe-1 text-start px-3 d-flex flex-column gap-2">
                            <h4 className={`mb-0 text-white`}>{item.title}</h4>
                            <h4 className={`mb-0 text-white text-lg `}>
                              {item.subtitle}
                            </h4>
                          </div>
                        </div>
                        <div
                          className="card-body"
                          style={{ maxWidth: "100%", overflowX: "auto" }}
                        >
                          <table className="table align-items-center mb-0">
                            <thead>
                              <tr>
                                {item.columns.map((item, index) => (
                                  <th
                                    key={index}
                                    className={`text-uppercase text-sm text-center ${item.color}`}
                                  >
                                    {item.title}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {item.data.map((item, index) => (
                                  <td className="align-middle text-center">
                                    <h4 className={`mb-0 ${item.color}`}>
                                      {item.count || 0}
                                    </h4>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                          <hr className="dark horizontal" />
                          <div className="d-flex ">
                            <p className="mb-0 text-md">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || null}
                </div>
              );
            }
          })
        : LecturerDashboard.map((item, index) => {
            if (item.id === "smallCard") {
              return (
                <div className="row" key={index}>
                  {item.cardSmall?.map(
                    (item, index) =>
                      (
                        <div className="col-sm-6 mb-xl-0 mb-4 my-4" key={index}>
                          <div className="card">
                            <div className="card-header p-3 pt-2">
                              <div
                                className={`d-flex justify-content-center align-items-center icon-lg text-white  bg-gradient-${item.gradient} shadow-${item.gradient} text-center border-radius-xl mt-n4 position-absolute `}
                              >
                                <i className={item.icon}></i>
                              </div>
                              <div className="text-end pt-1">
                                <p className="text-sm mb-0 text-capitalize text-bold">
                                  {item.title}
                                </p>
                                {item.status && (
                                  <p
                                    className={`text-sm mb-0 text-capitalize text-bold ${item.color_text}`}
                                  >
                                    {item.status}
                                  </p>
                                )}
                                <h4 className={`mb-0 ${item.color_text}`}>
                                  {item.data.length || 0}
                                </h4>
                              </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                              <p className="mb-0">{item.desc}</p>
                            </div>
                          </div>
                        </div>
                      ) || null
                  )}
                </div>
              );
            } else {
              return (
                <div
                  className="row mt-4 d-flex justify-content-center"
                  key={index}
                >
                  {item.cardLarge?.map((item, index) => (
                    <div className=" col-md-6 mt-4 mb-4" key={index}>
                      <div className="card z-index-2  ">
                        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                          <div className="bg-gradient-secondary shadow-dark border-radius-lg py-3 pe-1 text-start px-3 d-flex flex-column gap-2">
                            <h4 className={`mb-0 text-white`}>{item.title}</h4>
                            <h4 className={`mb-0 text-white text-lg `}>
                              {item.subtitle}
                            </h4>
                          </div>
                        </div>
                        <div
                          className="card-body"
                          style={{ maxWidth: "100%", overflowX: "auto" }}
                        >
                          <table className="table align-items-center mb-0">
                            <thead>
                              <tr>
                                {item.columns.map((item, index) => (
                                  <th
                                    key={index}
                                    className={`text-uppercase text-sm text-center ${item.color}`}
                                  >
                                    {item.title}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {item.data.map((item, index) => (
                                  <td className="align-middle text-center">
                                    <h4 className={`mb-0 ${item.color}`}>
                                      {item.count || 0}
                                    </h4>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                          <hr className="dark horizontal" />
                          <div className="d-flex ">
                            <p className="mb-0 text-md">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || null}
                </div>
              );
            }
          })}
      <footer className="footer py-4  ">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-lg-between">
            <div className="col-lg-6 mb-lg-0 mb-4">
              <div className="copyright text-center text-sm text-muted text-lg-start">
                © {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </UserLayout>
  );
};
