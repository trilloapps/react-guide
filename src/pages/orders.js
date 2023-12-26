import React, { useEffect, useState } from 'react';
import { Table, Pagination as BootstrapPagination } from 'react-bootstrap';
import { Header } from './header';
import { useLocation } from 'react-router-dom';
import "./../css/orders.css";
import { useNavigate } from 'react-router-dom';



export const Orders = () => {
  const navigate = useNavigate();
  const [paramValue, setparamValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredorders, setFilteredOrders] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const tableHeadings = [
    { id: 1, key: "Order No" },
    { id: 2, key: "Title" },
    { id: 3, key: "Description" },
    { id: 4, key: "Booking Date" },
    { id: 5, key: "DeliveryTime" },
    { id: 6, key: "Status" },
  ];
  const orders = [];

  const handleBackClick = () => {
    // Navigate to the order screen with the customerId parameter
    window.location.href = `/customers`;
  };

  // ----------- HANDLE ROW CLICK --------------------------------

  const handleRowClick = (orderId) => {
    // Navigate to the order screen with the customerId parameter
    const queryParams = {
      orderId: orderId,
      customerId: paramValue
    };

    navigate({
      pathname: '/items',
      search: new URLSearchParams(queryParams).toString(),
    });
    // window.location.href = `/items`;
  };
      // Update filtered items when the search term changes
      const handleSearch = (event) => {
        console.log(event.target.value,"event.target.value")
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
    
        // Filter items based on the search term
        const filtered = orders.filter(
          (order) => order.title.toLowerCase().includes(searchTerm)
        );
        setFilteredOrders(filtered);
      };
    
      const renderOrders = filteredorders.length > 0 ? filteredorders : ordersData;



      // ---------- GETTING THE PARAMS ---------- 
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      useEffect(() => {
        const param1Value = queryParams.get('param');
        setparamValue(param1Value)
        console.log('Param :', param1Value);
      }, [queryParams]);


      // -------------- GETTING THE ORDERS --------------------------------
        // Fetch customers based on the current page
  const fetchOrders = async (page) => {
    try {
      const response = await fetch('https://api.eng-dev-1.trilloapps.com/ds/function/shared/GetCustomerOrders', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'x-app-name': 'main',
          'x-org-name': 'cloud',
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
          customerId: paramValue,
          start: (page - 1) * itemsPerPage + 1,
          size: itemsPerPage,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const totalData = data.data.totalData;
      setOrdersData(data.data.orders);
      setTotalPages(Math.ceil(totalData / itemsPerPage));
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  useEffect(() => {
    // Only fetch orders if 'paramValue' is available
    if (paramValue) {
      fetchOrders(currentPage);
    }
  }, [paramValue, currentPage]);

      const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
      };

  return (
    <>
    <Header/>
    <div className='p-4'>
    <div onClick={()=>handleBackClick()} className="cursor-pointer mb-4 back-button" ><i className="fa-solid fa-arrow-turn-down-left me-2"></i> Back to Customer</div>
    <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Orders</h4>
        <input type="text" className="w-50 form-control" placeholder="Search by Title" value={searchTerm} onChange={handleSearch}/>
    </div>
      <Table className='table-striped , table-hover' responsive="lg">
        <thead>
          <tr>
        {tableHeadings.map((head) => (
            <th key={head.id}>{head.key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {renderOrders.map((row) => (
          <tr key={row.id} onClick={() => handleRowClick(row.id)} className="cursor-pointer">
            <td>{row.id}</td>
            <td>{row.title}</td>
            <td>{row.description}</td>
            <td>{row.bookingDateTime}</td>
            <td>{row.deliverDateTime}</td>
            <td> <span className={`text-capitalize badge ${row.status === 'delivered' ? 'text-bg-success' :row.status === 'Cancel'? 'text-bg-danger':row.status === 'pending'?'text-bg-secondary':'text-bg-warning'}`}>{row.status}</span></td>
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
  )
}
