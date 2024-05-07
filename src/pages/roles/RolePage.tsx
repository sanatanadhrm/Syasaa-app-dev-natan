import { useEffect, useState } from "react";
import { UserLayout } from "../../components/Layout/Layout";
import { useHistory } from "react-router";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import Cookies from "js-cookie";
import fetchAPI from "../../fetch";
import Alert from "../../components/Alert";

interface ItemData {
  id: number;
  name: string;
}

export const RolePage = () => {
  const history = useHistory();

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
      name: "Action",
      selector: "action",
    },
  ];

  const [roles, setRoles] = useState<DefaultPaginatedResponse<ItemData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getRolesData = async () => {
    try {
      const response = await fetchAPI("/api/v1/roles", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": localStorage.getItem("XSRF-TOKEN") || "",
        },
      });

      const data = await response.json();

      if (data) {
        setRoles(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
    }
  };

  const deleteRole = async (id: number) => {
    try {
      const confirmed = await Alert.confirm(
        "Delete Confirmation!",
        "Are you sure you want to delete this role?",
        "Yes, Delete it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/roles/${id}`, {
        method: "POST",
        body: JSON.stringify({ _method: "DELETE" }),
      });

      if (response.ok) {
        await getRolesData();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getRolesData();
  }, [currentPage]);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: roles.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">Roles</h6>
                <button
                  className="btn btn-info btn-md mx-4 mb-0"
                  onClick={() => {
                    history.push(`/roles/add`);
                  }}
                >
                  Add Role
                </button>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          className="text-uppercase text-secondary text-xxs font-weight-bolder text-center"
                        >
                          {column.name}
                        </th>
                      ))}
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
                    ) : (
                      roles.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              <h6 className="mb-0 text-sm">{item.name}</h6>
                            </td>
                            <td className="align-middle text-center">
                              {item.id === 1 || (
                              <div className="d-flex gap-2 text-center justify-content-center">
                                <button
                                  className="btn btn-primary btn-sm mb-0"
                                  onClick={() => {
                                    history.push(`/roles/edit/${item.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm mb-0"
                                  onClick={() => deleteRole(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                              )}
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
                activePage={roles?.meta?.current_page}
                itemsCountPerPage={roles?.meta?.per_page}
                totalItemsCount={roles?.meta?.total ?? 0}
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
