import { UserLayout } from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import fetchAPI from "../../fetch";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import Alert from "../../components/Alert";

interface ItemData {
  id: number;
  name: string;
}

export const FacultiesPage = () => {
  const [faculty, setFaculty] = useState<DefaultPaginatedResponse<ItemData>>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getFacultyData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/faculties?page=${currentPage}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setFaculty(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const deleteFaculty = async (id: number) => {
    try {
      const confirmed = await Alert.confirm(
        "Delete Confirmation!",
        "Are you sure you want to delete this faculty?",
        "Yes, delete it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/faculties/${id}`, {
        method: "POST",
        body: JSON.stringify({ _method: "DELETE" }),
      });

      const data = await response.json();

      if (response.ok) {
        await getFacultyData();
        Alert.success("Success", data.message);
      } else {
        Alert.error("Error", data.message);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };

  useEffect(() => {
    getFacultyData();
  }, [currentPage]);
  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: faculty?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Faculties
                </h6>
                <button
                  className="btn btn-info btn-md mx-4 mb-0"
                  onClick={() => {
                    history.push(`/faculties/add`);
                  }}
                >
                  Add Faculty
                </button>
              </div>
            </div>
            <div className="card-body px-0 pb-2">
              <div className="table-responsive">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      {columns.map((item, index) => {
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
                              className="text-center placeholder-glow "
                            >
                              <span className="placeholder col-10"></span>
                            </td>
                          ))}
                      </tr>
                    ) : faculty.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      faculty.data?.map((item: ItemData, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.name}
                            </td>
                            <td className="align-middle d-flex justify-content-center">
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-primary btn-sm mb-0"
                                  onClick={() => {
                                    history.push(`/faculties/edit/${item.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm mb-0"
                                  onClick={() => deleteFaculty(item.id)}
                                >
                                  Delete
                                </button>
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
                activePage={faculty?.meta?.current_page}
                itemsCountPerPage={faculty?.meta?.per_page}
                totalItemsCount={faculty?.meta?.total ?? 0}
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
