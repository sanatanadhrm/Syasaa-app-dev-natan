import { useHistory } from "react-router";
import { UserLayout } from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { DefaultPaginatedResponse } from "../../types";
import Pagination from "react-js-pagination";
import fetchAPI from "../../fetch";
import Alert from "../../components/Alert";

export const ProgileRequestsPage = () => {
  const userLogin = JSON.parse(localStorage.getItem("user") || "{}");
  const columns = [
    {
      name: "ID",
      selector: "id",
      key: 1,
    },
    userLogin.role_id === 1 && {
      name: "Student",
      selector: "student.user.name",
      key: 2,
    },
    {
      name: "Field",
      selector: "changed_data",
      key: 3,
    },
    {
      name: "Before",
      selector: "old_value",
      key: 4,
    },
    {
      name: "After",
      selector: "new_value",
      key: 5,
    },
    {
      name: "Status",
      selector: "status",
      key: 6,
    },
    {
      name: "Action",
      selector: "action",
      key: 7,
    },
  ];

  const history = useHistory();
  const [ProfileRequest, setProfileRequest] = useState<
    DefaultPaginatedResponse<any>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProfileRequestData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAPI(
        `/api/v1/update-profile-requests?page=${currentPage}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log(data, "data");
      if (response.ok) {
        let filter;
        if (userLogin.role_id === 1) {
          filter = data.data;
          setProfileRequest({
            data: filter,
            meta: data.meta,
            links: data.links,
          });
        } else if (userLogin.role_id === 4) {
          filter = data.data.filter(
            (item) => item.student_id === userLogin.student.id
          );
          setProfileRequest({
            data: filter,
            meta: data.meta,
            links: data.links,
          });
        }
        // setProfileRequest(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileRequestData();
  }, []);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = async (id: number, status: string) => {
    let confirm;
    if (status === "accepted") {
      confirm = await Alert.confirm(
        "Accept Confirmation!",
        "Are you sure you want to accept this request?",
        "Yes, Accept it!"
      );
    } else {
      confirm = await Alert.confirm(
        "Reject Confirmation!",
        "Are you sure you want to reject this request?",
        "Yes, Reject it!"
      );
    }
    console.log(confirm, "confirm");
    if (!confirm) return;
    else {
      try {
        const payload = {
          status: status,
          _method: "PUT",
        };
        const response = await fetchAPI(
          `/api/v1/update-profile-requests/${id}/status`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        console.log(data, "data");
        if (response.ok) {
          getProfileRequestData();
        }
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  const getUserProfilePhoto = (item) => {
    // jika path gambarnya ada di folder img/,
    // maka asumsinya adalah gambar tersebut digunakan untuk seeder
    if (item?.includes("img/")) {
      return item.replace("storage/", "");
    }

    return item;
  };

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={
              {
                //   height: ProfileRequest?.data?.length > 0 ? "100%" : "85vh",
              }
            }
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Profile Requests
                </h6>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
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
                    ) : ProfileRequest.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      ProfileRequest.data?.map((item: any, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              <span className="d-flex justify-content-center">
                                {item.id}
                              </span>
                            </td>
                            {userLogin.role_id === 1 && (
                              <td className="text-sm font-weight-normal px-4 py-3">
                                <span className="d-flex justify-content-center">
                                  {item.student.user.name}
                                </span>
                              </td>
                            )}
                            <td className="text-sm font-weight-normal px-4 py-3">
                              <span className="d-flex justify-content-center">
                                {item.changed_data}
                              </span>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.changed_data !== "image" ? (
                                <span className="d-flex justify-content-center">
                                  {item.old_value}
                                </span>
                              ) : (
                                <div className="avatar avatar-xl position-relative">
                                  <img
                                    src={`http://localhost:8000/${getUserProfilePhoto(
                                      item.old_value
                                    )}`}
                                    alt="profile"
                                    style={{
                                      width: "100px",
                                      borderRadius: "10px",
                                      display: "flex",
                                      justifyContent: "center",
                                      textAlign: "center",
                                    }}
                                    // className="w-100 border-radius-lg shadow-sm"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.changed_data !== "image" ? (
                                <span className="d-flex justify-content-center">
                                  {item.new_value}
                                </span>
                              ) : (
                                <div className="avatar avatar-xl position-relative">
                                  <img
                                    src={`http://localhost:8000/storage/${item.new_value}`}
                                    alt="profile"
                                    style={{
                                      width: "100px",
                                      borderRadius: "10px",
                                      display: "flex",
                                      justifyContent: "center",
                                      textAlign: "center",
                                    }}
                                    // className="w-100 border-radius-lg shadow-sm"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
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
                            <td className="w-full">
                              <div className="d-flex gap-2 flex-wrap w-full justify-content-center">
                                {userLogin.role_id === 1 ? (
                                  item.status === "pending" && (
                                    <div className="d-flex gap-2 flex-wrap w-full">
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
                                    </div>
                                  )
                                ) : (
                                  <div className="d-flex gap-2 flex-wrap w-full">
                                    <button
                                      className="btn btn-primary btn-sm mb-0"
                                      onClick={() => {
                                        // history.push(`/profile/edit/${item.id}`);
                                      }}
                                    >
                                      Detail
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
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
                activePage={ProfileRequest?.meta?.current_page}
                itemsCountPerPage={ProfileRequest?.meta?.per_page}
                totalItemsCount={ProfileRequest?.meta?.total ?? 0}
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
