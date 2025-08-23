import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Page.css";
import Loader from "../Loader";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import { useDebounce } from "../../hooks/useDebounce";

const SearchUsers = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({
    count: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [sortBy, setSortBy] = useState({
    key: "created_at",
    order: "DESC",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const debouncedFilters = useDebounce(filters, 500);
  const toggleSortBy = (key) => {
    setSortBy((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === "ASC" ? "DESC" : "ASC" };
      }
      return { key, order: "ASC" };
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = {
          ...pagination,
          sortBy: `${sortBy.key}:${sortBy.order}`,
          ...debouncedFilters,
        };
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/users`,
          {
            params,
            withCredentials: true,
          }
        );
        setUsers(res.data?.data || []);
        setTotal({
          count: parseInt(res.data?.total) || 0,
          pages: parseInt(res.data?.totalPages) || 0,
        });
      } catch (error) {
        console.error(error.message);
        alert("Unable to load users data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [pagination.page, pagination.limit, sortBy, debouncedFilters]);

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
        <Select
          label="Role"
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          options={[
            { label: "All", value: "" },
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
            { label: "Owner", value: "owner" },
          ]}
        />
      </div>
      {loading ? (
        <Loader label="Loading user details ..." />
      ) : (
        <div>
          <h3>
            Showing {(pagination.page - 1) * pagination.limit + users.length}{" "}
            out of {total.count} users
          </h3>
          <table className="basic-table">
            <thead>
              <tr>
                {["name", "email", "role", "address", "created_at"].map(
                  (key) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {users.map(({ address, created_at, name, email, role, rating  }) => (
                <tr key={email}>
                  <td>
                    <div>{name}
                    {rating && <p><strong>Store Rating:</strong> {rating}</p>}
                    </div>
                  </td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{address}</td>
                  <td>{new Date(created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
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
              page: prev.page === 1 ? 1 : prev.page - 1,
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
              page: prev.page === total.pages ? prev.page : prev.page + 1,
            }))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SearchUsers;
