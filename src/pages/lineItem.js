import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import "./../css/lineItems.css"
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination as BootstrapPagination } from 'react-bootstrap';


const API_URL = 'https://api.eng-dev-1.trilloapps.com/ds/function/shared/GetOrderItems'
const headers = {
  'Accept': '*/*',
  'x-app-name': 'main',
  'x-org-name': 'cloud',
  'content-type': 'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}


export const LineItem = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsData, setItemsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const tableHeadings = [
    { id: 2, key: "Name" },
    { id: 3, key: "Description" },
    { id: 4, key: "Code" },
    { id: 5, key: "Weight" },
    { id: 6, key: "Quantity" },
  ];
  
  const items = [];
  const handleBackClick = () => {
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
    };
  
    const handleRowClick = (itemId) => {
      // Navigate to the order screen with the customerId parameter
      const queryParams = {
        itemId: itemId,
        orderId: orderId,
        customerId: customerId
      };
  
      navigate({
        pathname: '/item-detail',
        search: new URLSearchParams(queryParams).toString(),
      });
    };

    const renderItems = itemsData.filter((item)=> item.itemName.toLowerCase().includes(searchTerm))

  

      // ---------- GETTING THE PARAMS ---------- 
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      useEffect(() => {
        const orderId = queryParams.get('orderId');
        setOrderId(orderId)
        const customerId = queryParams.get('customerId');
        setCustomerId(customerId)
        console.log('Param :', orderId, customerId);
      }, [queryParams]);


          // -------------- GETTING THE ORDERS --------------------------------
        // Fetch customers based on the current page
  const fetchItems = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          orderId: orderId,
          start: (page - 1) * itemsPerPage + 1,
          size: itemsPerPage,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const totalData = data.data.totalData;
      setItemsData(data.data.items);
      setTotalPages(Math.ceil(totalData / itemsPerPage));
    } catch (error) {
      console.error('Error during fetch:', error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch orders if 'paramValue' is available
    if (orderId) {
      fetchItems(currentPage);
    }
  }, [orderId, currentPage]);

      const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
      };
  return (
    <>
    { !loading &&
    <div className='p-4'>
    <div onClick={()=>handleBackClick()} className="cursor-pointer mb-4 back-button" ><i className="fa-solid fa-arrow-turn-down-left me-2"></i> Back to orders</div>
    <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Items</h4>
        <input type="text" className="w-50 form-control" placeholder="Search by Name"  value={searchTerm}
            onChange={handleSearch} />
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
        { renderItems.length > 0  ? (
        renderItems.map((row) => (
          <tr key={row.id} onClick={() => handleRowClick(row.id)} className="cursor-pointer">
            <td><span className='d-flex gap-2 align-items-center'><img height={40} width={40} className="rounded-pill" src={row.picture} alt=''/><p className='m-0'>{row.itemName}</p></span></td>
            <td>{row.itemDescription.slice(0,50)}...</td>
            <td>{row.itemCode}</td>
            <td>{row.weight}</td>
            <td>{row.quantity}</td>
          </tr>
        ))
        ):  
        <tr>
        <td className='text-center' colSpan="6">No matching items found.</td>
      </tr>
        }
        </tbody>
      </Table>
      {renderItems.length > 0 && (
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
)}

    </div>
    }
    {loading && 
  <div className='loader'>
<Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
</div>
}
    </>
  )
}
