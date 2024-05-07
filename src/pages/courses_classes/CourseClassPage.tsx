import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import fetchAPI from "../../fetch";
import ReactSelect from "react-select";
import { useHistory } from "react-router";
import Alert from "../../components/Alert";
import Cookies from "js-cookie";

export const CourseClass = () => {
  const UserLogin = JSON.parse(localStorage.getItem("user"));

  const columns = [
    {
      name: "ID",
      selector: "id",
      key: 1,
    },
    {
      name: "Class",
      selector: "class",
      key: 2,
    },
    {
      name: "Course",
      selector: "course",
      key: 3,
    },
    {
      name: "Lecturer",
      selector: "lecturer",
      key: 4,
    },
    {
      name: "Start Time",
      selector: "start_time",
      key: 5,
    },
    {
      name: "End Time",
      selector: "end_time",
      key: 6,
    },
    UserLogin.role_id === 1 && {
      name: "Action",
      selector: "action",
    },
  ];

  console.log(columns, "UserLogin");

  const [courseClasses, setCourseClasses] = useState<
    DefaultPaginatedResponse<any>
  >({});
  const [user, setUser] = useState<any>({});
  const [optionClass, setOptionClass] = useState<any>([
    {
      value: 0,
      label: "All Class",
    },
  ]);
  const [optionMajor, setOptionMajor] = useState<any>([
    {
      value: 0,
      label: "All Major",
    },
  ]);
  const [selectedClass, setSelectedClass] = useState<any>({
    value: 0,
    label: "All Class",
  });
  const [selectedMajor, setSelectedMajor] = useState<any>({
    value: 0,
    label: "All Major",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getUser = async () => {
    try {
      const response = await fetchAPI(`/api/v1/users/${UserLogin.id}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  console.log(user, "user");

  const getData = async (classId: number, majorId: number) => {
    setIsLoading(true);
    try {
      let url = `/api/v1/course-classes?includeClass=1&includeCourse=1&includeLecturer=1&page=${currentPage}`;

      if (UserLogin.role_id === 4) {
        url += `&class_id=${user.data.student.class.id}`;
      } else if (UserLogin.role_id === 3) {
        url += `&lecturer_id=${user.data.lecturer.id}`;
      }

      if (classId !== 0 && majorId !== 0) {
        url += `&class_id=${classId}&major_id=${majorId}`;
      } else if (classId !== 0 && majorId === 0) {
        url += `&class_id=${classId}`;
      } else if (classId === 0 && majorId !== 0) {
        url += `&major_id=${majorId}`;
      }

      const response = await fetchAPI(url, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        const filtered = {
          data: data.data.filter((item, i) => {
            if (UserLogin.role_id === 1) {
              return item;
            } else if (UserLogin.role_id === 2) {
              return (
                item.class.major.faculty_id ===
                user.data.faculty_staff.faculty_id
              );
            } else if (UserLogin.role_id === 3) {
              return item.lecturer_id === user.data.lecturer.id;
            } else if (UserLogin.role_id === 4) {
              return item;
            }
          }),
          links: data.links,
          meta: data.meta,
        };
        setCourseClasses(filtered);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };

  const getMajor = async () => {
    try {
      const response = await fetchAPI(`/api/v1/majors?paginate=false`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        const mappedData = data.data
          .filter((item: any) => {
            if (UserLogin.role_id === 1) {
              return item;
            } else if (UserLogin.role_id === 2) {
              return item.faculty.id === user.data.faculty_staff.faculty_id;
            } else if (UserLogin.role_id === 3) {
              return item;
            } else if (UserLogin.role_id === 4) {
              return item;
            }
          })
          .map((item: any) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        setOptionMajor((prev: any) => {
          const filteredOptions = mappedData.filter((newOption: any) => {
            return !prev.some(
              (existingOption: any) => existingOption.value === newOption.value
            );
          });

          return [...prev, ...filteredOptions];
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getClasses = async () => {
    try {
      const response = await fetchAPI(`/api/v1/major-classes?paginate=false`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        const mappedData = data.data
          .filter((item: any) => {
            if (UserLogin.role_id === 1) {
              return item;
            } else if (UserLogin.role_id === 2) {
              return (
                item.major.faculty.id === user.data.faculty_staff.faculty_id
              );
            } else if (UserLogin.role_id === 3) {
              return item;
            } else if (UserLogin.role_id === 4) {
              return item.major_id === user.data.student.class.major_id;
            }
          })
          .map((item: any) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        setOptionClass((prev: any) => {
          const filteredOptions = mappedData.filter((newOption: any) => {
            return !prev.some(
              (existingOption: any) => existingOption.value === newOption.value
            );
          });

          return [...prev, ...filteredOptions];
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user.data) {
      getMajor();
      getClasses();
      getData(selectedClass.value, selectedMajor.value);
    }
  }, [currentPage, selectedClass, selectedMajor, user]);

  const handleMajorChange = (e: any) => {
    if (e.value === 0) {
      setSelectedMajor({
        value: e.value,
        label: e.label,
      });
    }
    setSelectedMajor({
      value: e.value,
      label: e.label,
    });
  };

  const handleClassChange = (e: any) => {
    if (e.value === 0) {
      setSelectedClass({
        value: e.value,
        label: e.label,
      });
    }
    setSelectedClass({
      value: e.value,
      label: e.label,
    });
  };

  const history = useHistory();

  const deleteSchedule = async (id: number) => {
    const bodyData = new FormData();
    bodyData.append("_method", "DELETE");
    const confirmed = await Alert.confirm(
      "Delete Confirmation!",
      "Are you sure you want to delete this schedule?",
      "Yes, Delete it!"
    );

    if (!confirmed) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/course-classes/${id}`,
        {
          method: "POST",
          body: bodyData,
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
          },
        }
      );
      if (response.ok) {
        getData(selectedClass.value, selectedMajor.value);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              padding: "10px, 10px, 10px, 10px",
              height: courseClasses?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Schedules
                </h6>
                {UserLogin.role_id === 1 && (
                  <button
                    className="btn btn-info btn-md mx-4 mb-0"
                    onClick={() => {
                      history.push(`/schedules/add`);
                    }}
                  >
                    Add Schedule
                  </button>
                )}
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              {UserLogin.role_id !== 1 && (
                <div className="d-flex mx-4 justify-content-start gap-2 col-6">
                  {UserLogin.role_id === 2 && (
                    <ReactSelect
                      className="col-6"
                      options={optionMajor}
                      value={selectedMajor}
                      name="Major"
                      placeholder={"Select Major"}
                      onChange={handleMajorChange}
                      isLoading={isLoading}
                    />
                  )}
                  {UserLogin.role_id !== 4 && (
                    <ReactSelect
                      className="col-6"
                      options={optionClass}
                      name={"Class"}
                      value={selectedClass}
                      placeholder={"Select Class"}
                      isLoading={isLoading}
                      onChange={handleClassChange}
                    />
                  )}
                </div>
              )}

              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      {columns.map((item, index) => {
                        if (!item) {
                          return null;
                        }
                        return (
                          <th
                            key={index}
                            className="text-uppercase text-secondary text-xxs font-weight-bolder text-center"
                          >
                            <div>{item.name}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <>
                        <tr>
                          {Array(columns.length)
                            .fill(0)
                            .map((_, i) => (
                              <td
                                key={i}
                                className="text-center placeholder-glow"
                              >
                                <span className="placeholder col-10"></span>
                              </td>
                            ))}
                        </tr>
                      </>
                    ) : courseClasses.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      courseClasses.data?.map((item: any, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.class.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 col-9">
                              <div className="d-flex flex-column">
                                <span
                                  className="course-name"
                                  style={{
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {item.course.name}
                                </span>
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.lecturer.user.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.start_time}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.end_time}
                            </td>
                            {UserLogin.role_id === 1 && (
                              <td className="align-middle">
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    className="btn btn-primary btn-sm mb-0"
                                    onClick={() => {
                                      history.push(
                                        `/schedules/edit/${item.id}`
                                      );
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm mb-0"
                                    onClick={() => deleteSchedule(item.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center pt-4 px-4">
              <Pagination
                activePage={courseClasses?.meta?.current_page}
                itemsCountPerPage={courseClasses?.meta?.per_page}
                totalItemsCount={courseClasses?.meta?.total ?? 0}
                onChange={handleChangePage}
                itemClass="page-item"
                linkClass="page-link"
                firstPageText="First"
                lastPageText="Last"
                prevPageText={<>&laquo;</>}
                nextPageText={<>&raquo;</>}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
