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
  major_id: number;
  lat: string;
  lng: string;
  major: {
    id: number;
    name: string;
    faculty: {
      id: number;
      name: string;
    }
  };
}

export const ClassPage = () => {
  const [classes, setClasses] = useState<DefaultPaginatedResponse<ItemData>>({});
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
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
      name: "Major",
      selector: "major",
      key: 3,
    },
    {
      name: "Latitude",
      selector: "latitude",
      key: 4,
    },
    {
      name: "Longitude",
      selector: "longitude",
      key: 5,
    },
    {
      name: "Action",
      selector: "action",
    },
  ];

  const getClassData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/major-classes?page=${currentPage}`, {method: "GET"});

      const data = await response.json();

      if (response.ok) {
        setClasses(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    getClassData();
  }, [currentPage]);

  const deleteClass = async (id: number) => {
    try {
      const confirmed = await Alert.confirm(
        "Delete Confirmation!",
        "Are you sure you want to delete this class?",
        "Yes, delete it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/major-classes/${id}`, {
        method: "POST",
        body: JSON.stringify({ _method: "DELETE" })
      });

      const data = await response.json();

      if (response.ok) {
        await getClassData();
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
              height: classes?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">Classes</h6>
                <button
                  className="btn btn-info btn-md mx-4 mb-0"
                  onClick={() => {
                    history.push(`/classes/add`);
                  }}
                >
                  Add Class
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
                            className="text-uppercase text-secondary text-xxs font-weight-bolder"
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
                    ) : classes.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      classes.data?.map((item: ItemData, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.major?.name}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.lat}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.lng}
                            </td>
                            <td className="align-middle">
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-primary btn-sm mb-0"
                                  onClick={() => {
                                    history.push(`/classes/edit/${item.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm mb-0"
                                  onClick={() => deleteClass(item.id)}
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
                activePage={classes?.meta?.current_page}
                itemsCountPerPage={classes?.meta?.per_page}
                totalItemsCount={classes?.meta?.total ?? 0}
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
