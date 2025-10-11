import React, { useEffect, useState } from "react";
import { ERROR, OPPS_MSG, SERVER_ERROR, SUCCESS } from "../../../utills/string";
import { Image } from "react-bootstrap";
import { useToastr } from "../../../components/toast/Toast";
import api from "../../../components/action/Api";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useSelector } from "react-redux";

const MenuItems = () => {
  const { customToast } = useToastr();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        window?.loadingStart?.();
        const response = await api.get(`/menu/all`);
        setData(response.data);
      } catch (e) {
        const errorMessage = e?.response?.data?.error || SERVER_ERROR;
        customToast({
          severity: ERROR,
          summary: OPPS_MSG,
          detail: errorMessage,
          life: 4000
        });
      } finally {
        window?.loadingEnd?.();
      }
    };
    fetchData();
  }, [customToast]);

  const handleEdit = (id) => {
    navigate("/dashboard/add-menu", { state: { id } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        window?.loadingStart?.();
        await api.delete(`/menu/delete/${id}/${userId}`);
        customToast({
          severity: SUCCESS,
          summary: "Deleted",
          detail: "Menu item deleted successfully!",
          life: 3000
        });
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        customToast({
          severity: ERROR,
          summary: OPPS_MSG,
          detail: error?.response?.data?.error || SERVER_ERROR,
          life: 4000
        });
      } finally {
        window?.loadingEnd?.();
      }
    }
  };

  return (
    <div className="w-100" style={{ minHeight: "61vh" }}>
      <div className="d-flex justify-content-start align-items-center gap-1">
        <h4 className="page-h">Menu</h4>
        <Link to="/dashboard/add-menu" className="text-decoration-none mb-2">
          +Add
        </Link>
      </div>

      <div className="border rounded shadow-sm">
        <div className="card-body px-0">
          {data.length === 0 ? (
            <p className="text-center my-3">No record found.</p>
          ) : (
            <div className="table-responsive px-0">
              <table
                className="table table-striped table-hover mb-0 text-center align-middle"
                style={{ marginLeft: 0, marginRight: 0 }}
              >
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Tags</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody style={{ verticalAlign: "middle" }}>
                  {data.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={80}
                          height={60}
                          rounded
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.price}</td>
                      <td>{item.type}</td>
                      <td>{item.tags?.join(", ")}</td>
                      <td>
                        <div
                          className="d-flex gap-2 justify-content-center"
                          style={{ cursor: "pointer" }}
                        >
                          <FiEdit
                            onClick={() => handleEdit(item.id)}
                            title="Edit"
                            className="text-primary cursor-pointer"
                          />
                          <RiDeleteBin5Fill
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                            className="text-danger cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MenuItems;
