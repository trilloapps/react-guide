import React, { useEffect, useState } from 'react';
import { Table, Pagination as BootstrapPagination } from 'react-bootstrap';
import { Header } from './header';
import './../css/customer.css';
import { useNavigate } from 'react-router-dom';


const API_URL = 'https://api.eng-dev-1.trilloapps.com/ds/function/shared/GetCustomers';
const itemsPerPage = 10;

export const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [customerData, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const tableHeadings = [
    { id: 1, key: 'Name' },
    { id: 2, key: 'Email' },
    { id: 3, key: 'Phone' },
    { id: 4, key: 'Address' },
    { id: 5, key: 'Status' },
  ];

  const handleRowClick = (customerId) => {
    // Navigate to the order screen with the customerId parameter
    const queryParams = {
      param: customerId,
    };

    navigate({
      pathname: '/order',
      search: new URLSearchParams(queryParams).toString(),
    });
    // window.location.href = `/order`;
  };

  // Update filtered items when the search term changes
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    // Filter items based on the search term
    const filtered = customerData.filter(
      (item) => item.firstName.toLowerCase().includes(searchTerm)
    );
    setFilteredCustomer(filtered);
  };

  // Fetch customers based on the current page
  const fetchCustomers = async (page) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'x-app-name': 'main',
          'x-org-name': 'cloud',
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
          start: (page - 1) * itemsPerPage + 1,
          size: itemsPerPage,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const totalData = data.data.totalData;
      setCustomers(data.data.customers);
      setTotalPages(Math.ceil(totalData / itemsPerPage));
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  // Fetch customers when the component mounts or the current page changes
  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  const renderCustomers = filteredCustomer.length > 0 ? filteredCustomer : customerData || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Customers</h4>
          <input
            type="text"
            className="w-50 form-control"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Table className="table-striped, table-hover" responsive="lg">
          <thead>
            <tr>
              {tableHeadings.map((head) => (
                <th key={head.id}>{head.key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderCustomers.map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row.id)} className="cursor-pointer">
                <td>
                  <span className="d-flex gap-2 align-items-center">
                    <img height={40} width={40} className="rounded-pill" src={row.profilePicture} alt="" />
                    <p className="m-0">{row.firstName + ' ' + row.lastName}</p>
                  </span>
                </td>
                <td>{row.email}</td>
                <td>{row.phone}</td>
                <td>{row.address}</td>
                <td>
                  <span className={`capitalize-text badge ${row.status === 'active' ? 'text-bg-success' : 'text-bg-danger'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
       <div className='d-flex justify-content-end mt-3'>
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
      </div>
    </>
  );
};
