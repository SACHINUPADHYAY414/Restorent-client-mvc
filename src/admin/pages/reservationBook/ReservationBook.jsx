import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToastr } from "../../../components/toast/Toast";
import { ERROR, OPPS_MSG, SERVER_ERROR } from "../../../utills/string";
import api from "../../../components/action/Api";
import { Table, Container } from "react-bootstrap";
import { formatTime } from "../../../utills/allValidation";

const ReservationBook = () => {
  const { customToast } = useToastr();
  const email = useSelector((state) => state.auth.user.email);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        window?.loadingStart?.();
        const response = await api.get(`/reservations/all`);

        const sortedData = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setData(sortedData);
      } catch (e) {
        const errorMessage =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          SERVER_ERROR;

        customToast({
          severity: ERROR,
          summary: OPPS_MSG,
          detail: errorMessage,
          life: 4000,
        });
      } finally {
        window?.loadingEnd?.();
      }
    };

    fetchData();
  }, [email, customToast]);

  return (
    <div className="w-100" style={{ minHeight: "61vh" }}>
        <h4 className="page-h">Reservations</h4>
      {data.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          style={{ whiteSpace: "nowrap", textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Time</th>
              <th>Seat No</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {data.map((res, index) => (
              <tr key={res.id}>
                <td>{index + 1}</td>
                <td>{res.name}</td>
                <td>{res.phone}</td>
                <td>{res.guests}</td>
                <td>{new Date(res.date).toLocaleDateString()}</td>
                <td>{formatTime(res.time)}</td>
                <td>
                  {Array.isArray(res.seatNumbers)
                    ? res.seatNumbers.join(", ")
                    : res.seatNumbers}
                </td>
                <td>{res.requests || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ReservationBook;
