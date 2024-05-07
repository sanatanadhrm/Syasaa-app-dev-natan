import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { useHistory } from "react-router";
import fetchAPI from "../../fetch";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import _ from "lodash";
import Alert from "../../components/Alert";

interface ItemData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
}

export const UserPage = () => {
  const history = useHistory();

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "").id
    : {};

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<DefaultPaginatedResponse<ItemData>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const UserLogin = JSON.parse(localStorage.getItem("user"));

  const getUserData = async () => {
    try {
      const response = await fetchAPI("/api/v1/users?includeRole=1", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };
  // Table columns
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
      name: "Email",
      selector: "email",
      key: 3,
    },
    {
      name: "Phone",
      selector: "phone",
      key: 4,
    },
    {
      name: "Role",
      selector: "role_id",
      key: 5,
    },
    UserLogin.role_id === 1 && {
      name: "Action",
      selector: "action",
    },
  ];

  console.log(UserLogin, "users");

  const deleteUser = async (id: number) => {
    try {
      const confirmed = await Alert.confirm(
        "Delete Confirmation!",
        "Are you sure you want to delete this user?",
        "Yes, Delete it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/users/${id}`, {
        method: "POST",
        body: JSON.stringify({ _method: "DELETE" }),
      });

      const data = await response.json();

      if (response.ok) {
        await getUserData();
        Alert.success("Success", data.message);
      } else {
        Alert.error("Error", data.message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Get user data
  useEffect(() => {
    getUserData();
  }, [currentPage]);

  console.log(users, "users");

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: users.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  {UserLogin.role_id === 2
                    ? "Lecturers"
                    : UserLogin.role_id === 3
                    ? "Students"
                    : "Users"}
                </h6>
                {UserLogin.role_id === 1 && (
                  <button
                    className="btn btn-info btn-md mx-4 mb-0"
                    onClick={() => {
                      history.push(`/users/add`);
                    }}
                  >
                    Add User
                  </button>
                )}
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      {columns.map((item, i) => {
                        if (!item) {
                          return null;
                        }
                        return (
                          <th
                            key={i}
                            className="text-uppercase text-secondary text-xs font-weight-bolder text-center"
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
                    ) : (
                      users.data
                        .filter((item) => {
                          if (UserLogin.role_id === 1) {
                            return item;
                          } else if (UserLogin.role_id === 2) {
                            return item.role.id === 3;
                          } else if (UserLogin.role_id === 3) {
                            return item.role.id === 4;
                          }
                        })
                        .map((item, index) => (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <h6 className="mb-0 text-sm">{item.id}</h6>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <h6 className="mb-0 text-sm">{item.name}</h6>
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <p className="text-xs font-weight-bold mb-0">
                                {item.email}
                              </p>
                            </td>
                            <td className="text-xs font-weight-bold px-4 py-3 text-center">
                              {item.phone ?? "-"}
                            </td>
                            <td className="text-xs font-weight-bold px-4 py-3 text-center">
                              {_.startCase(_.camelCase(item.role?.name)) ?? "-"}
                            </td>

                            <td
                              className="align-middle"
                              style={{
                                display: `${
                                  userId === item.id || UserLogin.role_id !== 1
                                    ? "none"
                                    : "block"
                                }`,
                              }}
                            >
                              <div className="d-flex gap-2 text-center">
                                <button
                                  className="btn btn-primary btn-sm mb-0"
                                  onClick={() => {
                                    history.push(`/users/edit/${item.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm mb-0"
                                  onClick={() => deleteUser(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-center pt-4 px-4">
              <Pagination
                activePage={users?.meta?.current_page}
                itemsCountPerPage={users?.meta?.per_page}
                totalItemsCount={users?.meta?.total ?? 0}
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
