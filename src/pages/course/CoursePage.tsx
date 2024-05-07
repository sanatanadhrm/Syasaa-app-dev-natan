import { UserLayout } from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import fetchAPI from "../../fetch";
import Pagination from "react-js-pagination";
import { DefaultPaginatedResponse } from "../../types";
import Alert from "../../components/Alert";
import Cookies from "js-cookie";

interface ItemData {
  id: number;
  name: string;
  description?: string | null;
}

export const CoursePage = () => {
  const history = useHistory();
  const [courses, setCourses] = useState<DefaultPaginatedResponse<ItemData>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log(courses, "courses");
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

  const getCoursesData = async () => {
    try {
      const response = await fetchAPI(`/api/v1/courses?page=${currentPage}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(data);
        console.log(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const deleteCourse = async (id: number) => {
    try {
      const confirmed = await Alert.confirm(
        "Delete Confirmation!",
        "Are you sure you want to delete this course?",
        "Yes, Delete it!"
      );

      if (!confirmed) return;

      const response = await fetchAPI(`/api/v1/courses/${id}`, {
        method: "POST",
        body: JSON.stringify({ _method: "DELETE" }),
      });

      const data = await response.json();

      console.log(data, "data");

      if (response.ok) {
        await getCoursesData();
        Alert.success("Success", data.message);
      } else {
        Alert.error("Error", data.message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getCoursesData();
  }, [currentPage]);

  return (
    <UserLayout>
      <div className="row">
        <div className="col-12">
          <div
            className="card"
            style={{
              height: courses?.data?.length > 0 ? "100%" : "85vh",
            }}
          >
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 d-flex justify-content-between align-items-center">
                <h6 className="text-white text-capitalize ps-3 mb-0">
                  Courses
                </h6>
                <button
                  className="btn btn-info btn-md mx-4 mb-0"
                  onClick={() => {
                    history.push(`/courses/add`);
                  }}
                >
                  Add Course
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
                              className="text-center placeholder-glow"
                            >
                              <span className="placeholder col-10"></span>
                            </td>
                          ))}
                      </tr>
                    ) : courses.data?.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      courses.data?.map((item: ItemData, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-sm font-weight-normal px-4 py-3 text-center">
                              {item.id}
                            </td>
                            <td className="text-sm font-weight-normal px-4 py-3">
                              {item.name}
                            </td>
                            <td className="align-middle">
                              <div className="d-flex gap-2 justify-content-center">
                                <button
                                  className="btn btn-primary btn-sm mb-0"
                                  onClick={() => {
                                    history.push(`/courses/edit/${item.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm mb-0"
                                  onClick={() => deleteCourse(item.id)}
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
                activePage={courses?.meta?.current_page}
                itemsCountPerPage={courses?.meta?.per_page}
                totalItemsCount={courses?.meta?.total ?? 0}
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
