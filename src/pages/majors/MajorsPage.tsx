import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { useHistory } from "react-router";
import Alert from "../../components/Alert";
import { DefaultPaginatedResponse } from "../../types";
import Pagination from "react-js-pagination";
import fetchAPI from "../../fetch";

interface ItemData {
  id: number;
  name: string;
  faculty: {
    id: number;
    name: string;
  };
}

export const MajorsPage = () => {
  const [major, setMajor] = useState<DefaultPaginatedResponse<ItemData>>({});
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<any>({});
  const userLogin = JSON.parse(localStorage.getItem("user") || "{}");

  const columns = [
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
      name: "Faculty",
      selector: "faculty",
      key: 3,
    },
    userLogin.role_id === 1 && {
      name: "Action",
      selector: "action",
    },
  ];

  const getMajorData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/majors?page=${currentPage}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setMajor(data);
        console.log(data, "data");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const response = await fetchAPI(`/api/v1/users/${userLogin.id}`, {
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

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getUser();
    getMajorData();
  }, [currentPage]);

  const deleteMajor = async (id: number) => {
    try {
      const confirmed = await Alert.confirm(
        "Delete Confirmation!",
        "Are you sure you want to delete this major?",
        "Yes, Delete it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/majors/${id}`, {
        method: "POST",
        body: JSON.stringify({ _method: "DELETE" }),
      });

      const data = await response.json();

      if (response.ok) {
        await getMajorData();
        Alert.success("Success", data.message);
      } else {
        Alert.error("Error", data.message);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: major?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">Majors</h6>
                <button
                  className="btn btn-info btn-md mx-4 mb-0"
                  onClick={() => {
                    history.push(`/majors/add`);
                  }}
                >
                  Add Major
                </button>
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
                    ) : major.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      major.data
                        ?.filter((item) => {
                          if (userLogin.role_id === 1) return item;
                          else if (userLogin.role_id === 2) {
                            console.log(user, "userLogin");
                            return (
                              item?.faculty.id ===
                              user.data.faculty_staff.faculty_id
                            );
                          }
                        })
                        .map((item: ItemData, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-sm font-weight-normal px-4 py-3 text-center">
                                {item.id}
                              </td>
                              <td className="text-sm font-weight-normal px-4 py-3 text-center">
                                {item.name}
                              </td>
                              <td className="text-sm font-weight-normal px-4 py-3 text-center">
                                {item.faculty?.name}
                              </td>
                              {userLogin.role_id !== 1 || (
                                <td className="align-middle">
                                  <div className="d-flex gap-2 justify-content-center">
                                    <button
                                      className="btn btn-primary btn-sm mb-0"
                                      onClick={() => {
                                        history.push(`/majors/edit/${item.id}`);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm mb-0"
                                      onClick={() => deleteMajor(item.id)}
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
                activePage={major?.meta?.current_page}
                itemsCountPerPage={major?.meta?.per_page}
                totalItemsCount={major?.meta?.total ?? 0}
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
