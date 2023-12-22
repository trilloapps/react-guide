import {React,useState} from 'react'
import { Table ,Form} from 'react-bootstrap';
import { Header } from './header'
import "./../css/orders.css"
export const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredorders, setFilteredOrders] = useState([]);
  const tableHeadings = [
    { id: 1, key: "Order No" },
    { id: 2, key: "Title" },
    { id: 3, key: "Description" },
    { id: 4, key: "Booking Date" },
    { id: 5, key: "DeliveryTime" },
    { id: 6, key: "Status" },
  ];
  const orders = [
    { orderNo: 'o-789', title: 'Alice', description: 'Johnson', bookingDate: +92786546865, deliveryTime: 'Apt 2, Green Valley', status: 'Delivered' },
    { orderNo: 'o-123', title: 'Bob', description: 'Williams', bookingDate: +92786546865, deliveryTime: 'Suite 5, Downtown Plaza', status: 'In Transit' },
    { orderNo: 'o-987', title: 'Eva', description: 'Martin', bookingDate: +92786546865, deliveryTime: '123 Main St, City Center', status: 'Cancel' },
    { orderNo: 'o-654', title: 'David', description: 'Garcia', bookingDate: +92786546865, deliveryTime: 'Unit 8, Seaside Tower', status: 'Pending' },
    { orderNo: 'o-321', title: 'Sophia', description: 'Jones', bookingDate: +92786546865, deliveryTime: '22 Oak St, Riverside', status: 'In Transit' },
    { orderNo: 'o-111', title: 'Michael', description: 'Brown', bookingDate: +92786546865, deliveryTime: 'Suite 3, Skyline Residences', status: 'Cancel' },
    { orderNo: 'o-222', title: 'Olivia', description: 'White', bookingDate: +92786546865, deliveryTime: '44 Maple St, Uptown', status: 'In Transit' },
    { orderNo: 'o-333', title: 'Matthew', description: 'Taylor', bookingDate: +92786546865, deliveryTime: 'Unit 7, Hillside Gardens', status: 'Delivered' },
    { orderNo: 'o-444', title: 'Emma', description: 'Smith', bookingDate: +92786546865, deliveryTime: 'Suite 10, Lakeside View', status: 'Cancel' },
    { orderNo: 'o-555', title: 'Liam', description: 'Miller', bookingDate: +92786546865, deliveryTime: '55 Elm St, Lakeside', status: 'Delivered' }
  ];
  const formatBookingDates = (orders) => {
    return orders.map(order => {
      const formattedDate = new Date(order.bookingDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
  
      return {
        ...order,
        bookingDate: formattedDate
      };
    });
  };
  const ordersWithFormattedDate = formatBookingDates(orders);
  const handleBackClick = () => {
    // Navigate to the order screen with the customerId parameter
    window.location.href = `/`;
  };
  const handleRowClick = (customerId) => {
    // Navigate to the order screen with the customerId parameter
    window.location.href = `/items`;
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
    
      const renderOrders = filteredorders.length > 0 ? filteredorders : ordersWithFormattedDate;
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
          <tr key={row.orderNo} onClick={() => handleRowClick(row.orderNo)} className="cursor-pointer">
            <td>{row.orderNo}</td>
            <td>{row.title}</td>
            <td>{row.description}</td>
            <td>{row.bookingDate}</td>
            <td>{row.deliveryTime}</td>
            <td> <span className={`badge ${row.status === 'Delivered' ? 'text-bg-success' :row.status === 'Cancel'? 'text-bg-danger':row.status === 'Pending'?'text-bg-secondary':'text-bg-warning'}`}>{row.status}</span></td>
          </tr>
        ))}
        </tbody>
      </Table>

    </div>
    </>
  )
}
