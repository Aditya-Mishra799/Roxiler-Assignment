import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Page.css";
import Loader from "../Loader";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../context/AuthContext";
import Modal from "../Modal";
import RatingUpdateForm from "./RatingUpdateForm";
import Rating from "../Rating";
import { toast } from "react-hot-toast";

const SearchStores = () => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ count: 0, pages: 1 });
  const [filters, setFilters] = useState({ name: "", email: "", address: "", average_rating: "" });
  const [sortBy, setSortBy] = useState({ key: "created_at", order: "DESC" });
  const { authState } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const openModal = (idx) => {
    setSelectedStore(idx);
    setIsOpen(true);
  };
  const closeModal = (success) => {
    if (success) {
      setRefresh((prev) => !prev);
    }
    setSelectedStore(null);
    setIsOpen(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const debouncedFilters = useDebounce(filters, 500);

  const toggleSortBy = (key) => {
    setSortBy((prev) =>
      prev.key === key
        ? { key, order: prev.order === "ASC" ? "DESC" : "ASC" }
        : { key, order: "ASC" }
    );
  };

  useEffect(() => {
    const fetchstores = async () => {
      setLoading(true);
      try {
        const params = {
          ...pagination,
          sortBy: `${sortBy.key}:${sortBy.order}`,
          ...debouncedFilters,
        };
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/stores`,
          {
            params,
            withCredentials: true,
          }
        );
        setStores(res.data?.data || []);
        setTotal({
          count: parseInt(res.data?.total) || 0,
          pages: parseInt(res.data?.totalPages) || 0,
        });
      } catch (error) {
        console.error(error.message);
        toast.error("Unable to load stores data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchstores();
  }, [pagination.page, pagination.limit, sortBy, debouncedFilters, refresh]);

  return (
    <div className="basic-page">
      <div className="filters">
        <Input
          label="Name"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
        <Input
          label="Email"
          value={filters.email}
          onChange={(e) => handleFilterChange("email", e.target.value)}
        />
        <Input
          label="Address"
          value={filters.address}
          onChange={(e) => handleFilterChange("address", e.target.value)}
        />
        <Select label={"Rating"} options = {[
          {label: "Any", value: ""},
          {label: "0", value: 0},
          {label: "1", value: 1},
          {label: "2", value: 2},
          {label: "3", value: 3},
          {label: "4", value: 4},
          {label: "5", value: 5},
        ]}
        value={filters.average_rating}
          onChange={(e) => handleFilterChange("average_rating", e.target.value)}
        />
      </div>

      {loading ? (
        <Loader label="Loading user details ..." />
      ) : (
        <div>
          <h3>
            Showing {(pagination.page - 1) * pagination.limit + stores.length}{" "}
            out of {total.count} stores
          </h3>
          <table className="basic-table">
            <thead>
              <tr>
                {[
                  "name",
                  "email",
                  "average_rating",
                  "address",
                  "created_at",
                ].map((key) => (
                  <th key={key}>
                    {key.replace("_", " ").toUpperCase()}
                    <button
                      className={`sort-arrow ${
                        sortBy.key === key ? sortBy.order.toLowerCase() : ""
                      }`}
                      onClick={() => toggleSortBy(key)}
                    >
                      {sortBy.key === key ? "↑" : "↕"}
                    </button>
                  </th>
                ))}
                {authState.user.role === "user" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {stores.map(
                (
                  {
                    id,
                    name,
                    email,
                    address,
                    created_at,
                    average_rating,
                    user_rating,
                  },
                  idx
                ) => (
                  <tr key={email}>
                    <td>
                      <div>
                        {name}
                        {authState.user.role === "user" && user_rating && (
                          <Rating value={user_rating} disabled={true} />
                        )}
                      </div>
                    </td>
                    <td>{email}</td>
                    <td>{average_rating}</td>
                    <td>{address}</td>
                    <td>{new Date(created_at).toLocaleDateString("en-IN")}</td>
                    {authState.user.role === "user" && (
                      <td>
                        <Button tiny onClick={() => openModal(idx)}>
                          {user_rating ? "Edit Rating" : "Add Rating"}
                        </Button>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="controls">
        <Button
          disabled={pagination.page === 1}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
        >
          Prev
        </Button>
        <span>
          Showing {pagination.page} page out {total.pages}
        </span>
        <Button
          disabled={pagination.page === total.pages || total.pages === 0}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.page + 1, total.pages),
            }))
          }
        >
          Next
        </Button>
      </div>
      {isOpen && selectedStore !== null && (
        <Modal
          open={isOpen}
          label={
            stores[selectedStore].user_rating ? "Update Rating" : "Add Rating"
          }
          setOpen={setIsOpen}
          body={
            <RatingUpdateForm
              store_id={stores[selectedStore].id}
              user_rating={parseInt(stores[selectedStore].user_rating || 0)}
              closeModal={closeModal}
            />
          }
        />
      )}
    </div>
  );
};

export default SearchStores;
