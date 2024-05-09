import React, { useState, useEffect } from "react";
import _ from "lodash";

import { getUsers } from "../../services/userServices";
import { paginate } from "./../utils/paginate";
import Header from "./common/header";
import SearchBox from "./common/searchBox";
import UserTable from "./users/UserTable";
import Pagination from "./common/pagination";

export default function AllUsers() {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({
    path: "username",
    order: "asc",
  });

  useEffect(() => {
    async function getUser() {
      const { data: userData } = await getUsers();
      setUserData(userData);
    }

    getUser();
  }, []);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleDelete() {}
  function handlePreview() {}
  function handleEdit() {}

  let filtered = userData;
  if (searchQuery)
    filtered = userData.filter((u) =>
      u.username.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1; // Enable pagination if more than one item

  const allUserData = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section className="padding">
      <Header headerTitle="Users" buttonTitle="Add New" to="/admin/add-users" />

      <span>
        <SearchBox onChange={handleSearch} value={searchQuery} />
        Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
      </span>
      <UserTable
        onDelete={handleDelete}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onSort={handleSort}
        sortColumn={sortColumn}
        userData={allUserData}
      />

      <Pagination
        itemsCount={filtered.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
