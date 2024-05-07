import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import fetchAPI from "../../fetch";
import { DefaultPaginatedResponse } from "../../types";
import Pagination from "react-js-pagination";
import { useHistory } from "react-router";
import Alert from "../../components/Alert";
import Cookies from "js-cookie";

export const AttendanceRequestPage = () => {
  const [attendancesReq, setAttendanceReq] = useState<
    DefaultPaginatedResponse<any>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const history = useHistory();
  const UserLogin = JSON.parse(localStorage.getItem("user") || "{}");
  let columns = [
    {
      name: "ID",
      selector: "id",
      key: 1,
    },
    {
      name: "Student Name",
      selector: "student",
      key: 2,
    },
    {
      name: "Student Image",
      selector: "student_image",
      key: 3,
    },
    {
      name: "Course",
      selector: "course",
      key: 4,
    },
    {
      name: "Evidance",
      selector: "evidance",
      key: 5,
    },
    {
      name: "Status",
      selector: "status",
      key: 5,
    },
    UserLogin.role_id === 1 || UserLogin.role_id === 3
      ? {
          name: "Action",
          selector: "action",
        }
      : null,
  ];
  const getData = async () => {
    try {
      let url = `/api/v1/attendance-requests?page=${currentPage}`;
      if (UserLogin.role_id === 4) {
        url = `/api/v1/attendance-requests?page=${currentPage}&student_id=${UserLogin.student.id}`;
      }
      const response = await fetchAPI(url, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data, "data123");
      if (response.ok) {
        // console.log(data, "data123");

        setAttendanceReq({
          data: data.data.filter((item: any) => {
            if (UserLogin.role_id === 4) {
              return item.student_id === UserLogin.student.id;
            } else if (UserLogin.role_id === 3) {
              return item.course_class.lecturer_id === UserLogin.lecturer.id;
            } else {
              return item;
            }
          }),
          meta: data.meta,
          links: data.links,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = async (id: number, status: string) => {
    let confirm;
    if (status === "accepted") {
      confirm = await Alert.confirm(
        "Accepted Confirmation!",
        "Are you sure you want to accepted this Attandance?",
        "Yes, accepted it!"
      );
    } else {
      confirm = await Alert.confirm(
        "Reject Confirmation!",
        "Are you sure you want to reject this Attandance?",
        "Yes, reject it!"
      );
    }
    if (!confirm) return;

    const payload = {
      _method: "PUT",
      status: status,
    };

    try {
      const response = await fetchAPI(
        `/api/v1/attendance-requests/${id}/status`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      console.log(data, "data1234");
      if (response.ok) {
        getData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);
  // console.log();
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: attendancesReq?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Attendance Requests
                </h6>
                {UserLogin.role_id === 4 && (
                  <button
                    className="btn btn-info btn-md mx-4 mb-0"
                    onClick={() => {
                      history.push(`/attendance-requests/add`);
                    }}
                  >
                    Add Attendance Request
                  </button>
                )}
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="d-flex mx-4 justify-content-start gap-2 col-6"></div>
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
                          .map((_, i) => (
                            <td
                              key={i}
                              className="text-center placeholder-glow"
                            >
                              <span className="placeholder col-10"></span>
                            </td>
                          ))}
                      </tr>
                    ) : attendancesReq.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      attendancesReq.data?.map((item: any, index) => {
                        console.log(item, "item");
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
                                <img
                                  src={item.student_image}
                                  alt="profile_image"
                                  className="w-100 border-radius-lg shadow-sm"
                                />
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 col-5">
                              <div className="d-flex flex-column">
                                <span
                                  className="course-name"
                                  style={{
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {item.course_class.course.name}
                                </span>
                              </div>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.evidence}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.status === "pending" ? (
                                <span className="badge badge-sm bg-gradient-warning d-flex justify-content-center">
                                  Pending
                                </span>
                              ) : item.status === "accepted" ? (
                                <span className="badge badge-sm bg-gradient-success d-flex justify-content-center">
                                  accepted
                                </span>
                              ) : (
                                <span className="badge badge-sm bg-gradient-danger d-flex justify-content-center">
                                  Rejected
                                </span>
                              )}
                            </td>

                            {UserLogin.role_id === 2 ||
                            UserLogin.role_id === 4 ? (
                              <></>
                            ) : (
                              <td className="align-middle">
                                <div className="d-flex gap-2 justify-content-center">
                                  {(UserLogin.role_id == 1 ||
                                    UserLogin.role_id == 3) &&
                                    item.status === "pending" && (
                                      <>
                                        <button
                                          className="btn btn-primary btn-sm mb-0"
                                          onClick={() => {
                                            handleStatusChange(
                                              item.id,
                                              "accepted"
                                            );
                                          }}
                                        >
                                          Accept
                                        </button>
                                        <button
                                          className="btn btn-danger btn-sm mb-0"
                                          onClick={() => {
                                            handleStatusChange(
                                              item.id,
                                              "rejected"
                                            );
                                          }}
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
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
                activePage={attendancesReq?.meta?.current_page}
                itemsCountPerPage={attendancesReq?.meta?.per_page}
                totalItemsCount={attendancesReq?.meta?.total ?? 0}
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
