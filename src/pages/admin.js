import React, { useEffect, useState } from "react";
import "./../css/admin.css";
import { Table, Pagination as BootstrapPagination } from "react-bootstrap";

import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from 'react-toastify';


const itemsPerPage = 20;
const headers = {
  Accept: "*/*",
  "x-app-name": "main",
  "x-org-name": "cloud",
  "content-type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("accessToken"),
};

export const Admin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewUserModal, setNewUserModalShow] = useState(false);
  const [showEditUserModal, setEditUserModalShow] = useState(false);
  const [showDeleteUserModal, setDeleteUserModalShow] = useState(false);
  const [showSuspendUserModal, setSuspendUserModalShow] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [seletedUserId, setSelectedUserId] = useState();
  const [inactiveStatus, setInactiveStatus] = useState(false);
  const { register: register1, handleSubmit: handleSubmit1, formState: { errors: errors1 }, reset: resetForm,  watch } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();
  const [editFormData, setEditFormData] = useState({
    lastName: "",
    accessCount: "",
    orgName: "",
    role: "",
    userId: "",
    createdAt: "",
    firstName: "",
    verifyLinkSentAt: "",
    uid: "",
    deletedAt: "",
    deleted: "",
    inactive: "",
    mobilePhone: "",
    emailVerifyKey: "",
    tenantId: "",
    lastAccessTS: "",
    id: "",
    email: "",
    updatedAt: "",
    companyName: "",
    deptName: "",
  });
  const password = watch("password");
  // Fetch users based on the current page
  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.apps-demo-2.trilloapps.com/ds/page/auth/vault",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            start: (page - 1) * itemsPerPage + 1,
            size: itemsPerPage,
            className: "User",
            orderBy: "userId",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const totalData = data.totalItems;
     
      setUsers(data.items);
      setTotalPages(Math.ceil(totalData / itemsPerPage));
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers when the component mounts or the current page changes
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const renderCustomers = userData.filter((item) =>
    item.userId.toLowerCase().includes(searchTerm)
  );
  // Update filtered items when the search term changes
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  // Function to convert timestamp to date in the format "3/27/24, 8:19 PM"
  const formatDate = (timestamp) => {
    const options = {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(timestamp).toLocaleString("en-US", options);
  };

  //   Displaying and hiding new user modal
  const newUserModalClose = () => {
    setNewUserModalShow(false);
    resetForm();
  };
  const displayNewUserModal = () => setNewUserModalShow(true);
  //   Displaying and hiding new user modal
  const deleteUserModalClose = () => setDeleteUserModalShow(false);
  const suspendUserModalClose = () => setSuspendUserModalShow(false);

  const editUserModalClose = () => {
    setEditUserModalShow(false);
    resetEditForm();
  };

  // SUBMIT NEW USER FORM
  const onSubmitForm1 = async (formData) => {
    setUserInfo(formData);
    console.log("data", formData);
    try {
      const response = await fetch(
        "https://api.apps-demo-2.trilloapps.com/_service/um/newUser",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      await fetchUsers(1);
      setNewUserModalShow(false);
      toast.success('User created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  //   DELETE SELECTED USER
  const displayDeleteUserModal = (userId) => {
    console.log(userId);
    setDeleteUserModalShow(true);
    setSelectedUserId(userId);
  };
  const deleteSelectedUser = async () => {
    console.log("Selected user id", seletedUserId);
    try {
      const response = await fetch(
        "https://api.apps-demo-2.trilloapps.com/_service/um/deleteUser?id=" +
          seletedUserId,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Delete USER", data);
      await fetchUsers(1);
      setDeleteUserModalShow(false);
      toast.success('User deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // SUBMIT EDIT USER FORM
  const onSubmitForm2 = async (editFormValues) => {
    console.log("EDIT FORM SUMITE", editFormValues);

    try {
      const response = await fetch(
        "https://api.apps-demo-2.trilloapps.com/_service/um/editUser",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      await fetchUsers(1);
      setEditUserModalShow(false);
      toast.success('User updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };
  // DISPLAY EDIT USER FORM
  const displayEditUserModal = (userData) => {
    // setEditFormData(userData);
    console.log(userData);
    setEditFormData(userData);
    setEditUserModalShow(true);
  };
  // DISPLAY SUSPEND USER MODAL
  const displaySuspendUserModal = (userData) => {
    setSuspendUserModalShow(true);
    setSelectedUserId(userData.id);
    setInactiveStatus(userData.inactive);
    console.log(inactiveStatus);
  };
  // SUSPEND SELECTED USER
  const suspendSelectedUser = async () => {
    try {
      const response = await fetch(
        "https://api.apps-demo-2.trilloapps.com/_service/um/toggleSuspendActive",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            id: seletedUserId,
            inactive: !inactiveStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

    //   const data = await response.json();
      await fetchUsers(1);
      setSuspendUserModalShow(false);
      toast.success(inactiveStatus ? 'User resumed successfully!':'User suspended successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };
  // updating form data
  useEffect(() => {
    setEditFormData({
      lastName: editFormData.lastName,
      accessCount: editFormData.accessCount,
      orgName: editFormData.orgName,
      role: editFormData.role,
      userId: editFormData.userId,
      createdAt: editFormData.createdAt,
      firstName: editFormData.firstName,
      verifyLinkSentAt: editFormData.verifyLinkSentAt,
      uid: editFormData.uid,
      deletedAt: editFormData.deletedAt,
      deleted: editFormData.deleted,
      inactive: editFormData.inactive,
      mobilePhone: editFormData.mobilePhone,
      emailVerifyKey: editFormData.emailVerifyKey,
      tenantId: editFormData.tenantId,
      lastAccessTS: editFormData.lastAccessTS,
      id: editFormData.id,
      email: editFormData.email,
      updatedAt: editFormData.updatedAt,
      companyName: editFormData.companyName,
      deptName: editFormData.deptName,
    });
  }, [showEditUserModal]);

  // RESET FORM
  const resetEditForm = () => {
    setEditFormData({
      userId: "",
      role: "",
      password: "",
      rptPassword: "",
      email: "",
      mobilePhone: "",
      firstName: "",
      lastName: "",
      companyName: "",
      deptName: "",
    });
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Users</h4>
          <button className="btn btn-primary" onClick={displayNewUserModal}>
            <i className="fa-regular fa-plus"></i> New User
          </button>
        </div>

        <div className="mb-3 d-flex justify-content-between align-items-between">
          <button className="btn btn-primary">CSV</button>
          <div className="position-relative flex-fill d-flex justify-content-end">
            <input
              type="text"
              placeholder="Search by user id"
              className="form-control w-50"
              value={searchTerm}
              onChange={handleSearch}
            />
            <i className="fa-regular fa-magnifying-glass search-icon"></i>
          </div>
        </div>

        <div className="table-responsive table-height">
          <Table className="table-striped table-hover" responsive="lg">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Last Access</th>
                <th>Logins</th>
                <th>Suspend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {renderCustomers.length > 0 ? (
                renderCustomers.map((row) => (
                  <tr key={row.id} className="cursor-pointer">
                    <td>{row.userId}</td>
                    <td>{row.email}</td>
                    <td>{row.firstName}</td>
                    <td>{row.lastName}</td>
                    <td>{row.role}</td>
                    <td>{formatDate(row.lastAccessTS)}</td>
                    <td>{row.accessCount}</td>
                    <td>{row.inactive ? "Yes" : "No"}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          <i
                            id="dropdown-basic"
                            className="fa-regular fa-ellipsis-vertical text-dark"
                          ></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => displayEditUserModal(row)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => displaySuspendUserModal(row)}
                          >
                            {row.inactive ? "Resume" : "Suspend"}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => displayDeleteUserModal(row.id)}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  {!loading && (
                    <td className="text-center" colSpan="9">
                      No matching users found.
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        {renderCustomers.length > 0 && (
          <div className="d-flex justify-content-end mt-3">
            <BootstrapPagination>
              {[...Array(totalPages).keys()].map((number) => (
                <BootstrapPagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </BootstrapPagination.Item>
              ))}
            </BootstrapPagination>
          </div>
        )}
      </div>

      {loading && (
        <div className="loader">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* NEW USER MODAL */}

      <Modal
        show={showNewUserModal}
        onHide={newUserModalClose}
        size="lg"
        centered
      >
        <form onSubmit={handleSubmit1(onSubmitForm1)}>
          <Modal.Header closeButton>
            <Modal.Title>New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-body p-0">
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="userId">
                    User ID
                  </label>
                  <input
                    {...register1("userId", { required: true })}
                    type="text"
                    placeholder="User ID"
                    className={`form-control input ${
                      errors1.userId ? "is-invalid" : ""
                    }`}
                    id="userId"
                  />
                  {errors1.userId && (
                    <span className="invalid-feedback">
                      User ID is required
                    </span>
                  )}
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="id">
                    Role
                  </label>
                  <select
                    className="form-select form-control"
                    {...register1("role", { required: true })}
                  >
                    <option value={"admin"}>admin</option>
                    <option value={"user"}>user</option>
                    <option value={"userUI"}>userUI</option>
                    <option value={"userSFTP"}>userSFTP</option>
                    <option value={"viewer"}>viewer</option>
                  </select>
                  {errors1.role && (
                    <span className="invalid-feedback">Role is required</span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    {...register1("password", { required: true,minLength: 8 })}
                    type="password"
                    placeholder="Password"
                    className={`form-control input ${errors1.password ? "is-invalid" : ""}`}
                    id="password"
                  />
                  {errors1.password && (
                <span className="invalid-feedback">
                    {errors1.password.type === "required"
                    ? "Password is required"
                    : "Password must be at least 8 characters long"}
                </span>
                )}
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="rptPassword">
                    Confirm Password
                  </label>
                  <input
                    {...register1("rptPassword", { required: true , minLength:8,validate:(value)=> value === password})}
                    type="password"
                    placeholder="Confirm Password"
                    className={`form-control input ${errors1.rptPassword ? "is-invalid" : ""}`}
                    id="rptPassword"
                  />
                  {errors1.rptPassword && (
                <span className="invalid-feedback">
                  {errors1.rptPassword.type === "required"
                    ? "Repeat password is required"
                    : "Passwords do not match"}
                </span>
              )}
                </div>
              </div>
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    {...register1("email", { required: true })}
                    type="text"
                    placeholder="Email"
                    className={`form-control input ${errors1.email ? "is-invalid" : ""}`}
                    id="email"
                  />
                  {errors1.email && (
                    <span className="invalid-feedback">Email is required</span>
                  )}
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="mobilePhone">
                    Mobile Phone
                  </label>
                  <input
                    {...register1("mobilePhone", { required: false })}
                    type="number"
                    placeholder="Mobile Phone"
                    className="form-control input"
                    id="mobilePhone"
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    {...register1("firstName", { required: true })}
                    type="text"
                    placeholder="First Name"
                    className={`form-control input ${errors1.firstName ? "is-invalid" : ""}`}
                    id="firstName"
                  />
                  {errors1.firstName && (
                    <span className="invalid-feedback">Email is required</span>
                  )}
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    {...register1("lastName", { required: true })}
                    type="text"
                    placeholder="Last Name"
                    className={`form-control input ${errors1.lastName ? "is-invalid" : ""}`}
                    id="lastName"
                  />
                  {errors1.lastName && (
                    <span className="invalid-feedback">Email is required</span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-sm-6">
                  <label className="form-label" htmlFor="companyName">
                    Company
                  </label>
                  <input
                    {...register1("comapany", { required: false })}
                    type="text"
                    placeholder="Company"
                    className="form-control input"
                    id="companyName"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label" htmlFor="deptName">
                    Department
                  </label>
                  <input
                    {...register1("deptName", { required: true })}
                    type="text"
                    placeholder="Department"
                    className="form-control input"
                    id="deptName"
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={newUserModalClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}

      <Modal
        show={showEditUserModal}
        onHide={newUserModalClose}
        size="lg"
        centered
      >
        <form onSubmit={handleSubmit2(onSubmitForm2)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          
            <div className="modal-body p-0">
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="userId">
                    User ID
                  </label>
                  <input
                    {...register2("userId", { required: true })}
                    readOnly={true}
                    type="text"
                    placeholder="User ID"
                    className={`form-control input ${
                      errors2.userId ? "is-invalid" : ""
                    }`}
                    id="userId"
                    value={editFormData.userId}
                  />
                  {errors2.userId && (
                    <span className="invalid-feedback">
                      User ID is required
                    </span>
                  )}
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="id">
                    Role
                  </label>
                  <select
                    className="form-select form-control"
                    {...register2("role", { required: true })}
                  >
                    <option value={"admin"}>admin</option>
                    <option value={"user"}>user</option>
                    <option value={"userUI"}>userUI</option>
                    <option value={"userSFTP"}>userSFTP</option>
                    <option value={"viewer"}>viewer</option>
                  </select>
                  {errors2.role && (
                    <span className="invalid-feedback">Role is required</span>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    {...register2("email", { required: true })}
                    readOnly={true}
                    type="text"
                    placeholder="Email"
                    className="form-control input"
                    id="email"
                    defaultValue={editFormData.email}
                  />
                  {errors2.email && (
                    <span className="invalid-feedback">Email is required</span>
                  )}
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="mobilePhone">
                    Mobile Phone
                  </label>
                  <input
                    {...register2("mobilePhone", { required: false })}
                    type="number"
                    placeholder="Mobile Phone"
                    className="form-control input"
                    id="mobilePhone"
                    defaultValue={editFormData.mobilePhone}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    {...register2("firstName", { required: true })}
                    type="text"
                    placeholder="First Name"
                    className={`form-control input ${errors2.firstName ? "is-invalid" : ""}`}
                    id="firstName"
                    defaultValue={editFormData.firstName}
                  />
                  {errors2.firstName && (
                    <span className="invalid-feedback">
                      First Name is required
                    </span>
                  )}
                </div>
                <div className="form-group mb-3 col-md-6">
                  <label className="form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    {...register2("lastName", { required: true })}
                    type="text"
                    placeholder="Last Name"
                    className={`form-control input ${errors1.lastName ? "is-invalid" : ""}`}
                    id="lastName"
                    defaultValue={editFormData.lastName}
                  />
                  {errors2.lastName && (
                    <span className="invalid-feedback">
                      Last Name is required
                    </span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-sm-6">
                  <label className="form-label" htmlFor="companyName">
                    Company
                  </label>
                  <input
                    {...register2("company", { required: false })}
                    type="text"
                    placeholder="Company"
                    className="form-control input"
                    id="companyName"
                    defaultValue={editFormData.companyName}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label" htmlFor="deptName">
                    Department
                  </label>
                  <input
                    {...register2("deptName", { required: false })}
                    type="text"
                    placeholder="Department"
                    className="form-control input"
                    id="deptName"
                    defaultValue={editFormData.deptName}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={editUserModalClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* DELETE USER MODAL */}

      <Modal
        show={showDeleteUserModal}
        onHide={deleteUserModalClose}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the selected user?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={deleteUserModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => deleteSelectedUser()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SUSPEND USER MODAL */}

      <Modal
        show={showSuspendUserModal}
        onHide={suspendUserModalClose}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {inactiveStatus ? "Resume User" : "Suspend User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inactiveStatus
            ? "User is suspended. This action will resume the user's login."
            : "Are you sure you want to delete the selected user?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={suspendUserModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => suspendSelectedUser()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};
