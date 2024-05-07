import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import fetchAPI from "../../fetch";
import { DefaultPaginatedResponse } from "../../types";
import Pagination from "react-js-pagination";
import ReactSelect from "react-select";
import { useHistory } from "react-router";

export const AttendancesPage = () => {
  const [attendances, setAttendances] = useState<DefaultPaginatedResponse<any>>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
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
  const history = useHistory();

  const UserLogin = JSON.parse(localStorage.getItem("user") || "{}");

  let columns = [
    {
      name: "ID",
      selector: "id",
      key: 1,
    },
    {
      name: "Name",
      selector: "name",
      key: 2,
    },
    {
      name: "Student Image",
      selector: "student_img",
      key: 3,
    },
    {
      name: "Lecturer Image",
      selector: "lecturer_img",
      key: 3,
    },
    {
      name: "Attendance",
      selector: "is_present",
      key: 3,
    },
    // UserLogin.role_id === 1 && {
    //   name: "Action",
    //   selector: "action",
    // },
  ];

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
        // console.log(mappedData, "mappedData");
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

  const getData = async (classId: number, majorId: number) => {
    setIsLoading(true);
    try {
      let url = `/api/v1/attendances?page=${currentPage}`;

      if (user.data.role_id === 4) {
        url = `/api/v1/attendances?page=${currentPage}&student_id=${user.data.student.id}`;
      } else if (user.data.role_id === 2) {
        url = `/api/v1/attendances?page=${currentPage}&faculty_id=${user.data.faculty_staff.faculty_id}`;
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
        const filtered = {
          data: data.data.filter((item, i) => {
            if (UserLogin.role_id === 1) {
              return item;
            } else if (UserLogin.role_id === 2) {
              return item;
            } else if (UserLogin.role_id === 3) {
              return item.course_class.lecturer_id === user.data.lecturer.id;
            } else if (UserLogin.role_id === 4) {
              return item.student.id === user.data.student.id;
            }
          }),
          links: data.links,
          meta: data.meta,
        };
        setIsLoading(false);
        setAttendances(filtered);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
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

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // console.log(attendances, "attendances");

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

  const formatImage = (image: string) => {
    if (image?.includes("via.placeholder.com")) {
      const parts = image.split("/storage/");
      if (parts.length > 1) {
        return parts[1];
      }
    }
    return image;
  };

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: attendances?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Attendances
                </h6>
                {UserLogin.role_id === 4 && (
                  <button
                    className="btn btn-info btn-md mx-4 mb-0"
                    onClick={() => {
                      history.push(`/attendances/add`);
                    }}
                  >
                    Clock In
                  </button>
                )}
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="d-flex mx-4 justify-content-start gap-2 col-6">
                {UserLogin.role_id !== 1 && (
                  <>
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
                  </>
                )}
              </div>
              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      {columns.map((item, index) => {
                        if (!item) {
                          return (
                            <div
                              key={index}
                              style={{
                                display: "none",
                              }}
                            ></div>
                          );
                        }
                        return (
                          <th
                            key={index}
                            className="text-uppercase text-secondary text-xxs font-weight-bolder text-center"
                          >
                            {item.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        {Array(columns.length)
                          .fill(0)
                          .map((_, i) => {
                            if (!columns[i]) {
                              return (
                                <td
                                  key={i}
                                  style={{
                                    display: "none",
                                  }}
                                ></td>
                              );
                            }
                            return (
                              <td
                                key={i}
                                className="text-center placeholder-glow"
                              >
                                <span className="placeholder col-10"></span>
                              </td>
                            );
                          })}
                      </tr>
                    ) : attendances.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      attendances.data?.map((item: any, index) => {
                        // console.log(item, "item");
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.student.user.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <div className="avatar avatar-xl position-relative">
                                {item.student_image ? (
                                  <img
                                    src={formatImage(item.student_image)}
                                    alt="profile_image"
                                    className="w-100 border-radius-lg shadow-sm"
                                  />
                                ) : (
                                  <>-</>
                                )}
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <div className="avatar avatar-xl position-relative">
                                {item.lecturer_image ? (
                                  <img
                                    src={formatImage(item.lecturer_image)}
                                    alt="profile_image"
                                    className="w-100 border-radius-lg shadow-sm"
                                  />
                                ) : (
                                  <>-</>
                                )}
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.is_present !== 0 ? "Present" : "Absent"}
                            </td>

                            {/* {UserLogin.role_id !== 1 ? (
                              <></>
                            ) : (
                              <td className="align-middle">
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    className="btn btn-primary btn-sm mb-0"
                                    onClick={() => {
                                      // history.push(`/users/Edit/${item.id}`);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm mb-0"
                                    // onClick={() => deleteUser(item.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            )} */}
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
                activePage={attendances?.meta?.current_page}
                itemsCountPerPage={attendances?.meta?.per_page}
                totalItemsCount={attendances?.meta?.total ?? 0}
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
