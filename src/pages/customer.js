import {React,useState} from 'react'
import { Table } from 'react-bootstrap';
import { Header } from './header'
import "./../css/customer.css"
export const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomer, setFilteredCustomer] = useState([]);
    const tableHeadings = [
        { id: 0, key:"Customer id" },
        { id: 1, key:"Name"},
        { id: 2, key:"Email"},
        { id: 3, key:"Phone"},
        { id: 4, key:"Address"},
        { id: 5, key:"Status"},
      ];
      const customerData = [
        {
          customerId: 1,
          name: 'John',
          email: 'john.doe@example.com',
          phone: '555-1234',
          address: '123 Main St, Cityville',
          status: 'Active'
        },
        {
          customerId: 2,
          name: 'Jane',
          email: 'jane.smith@example.com',
          phone: '555-5678',
          address: '456 Oak St, Townsville',
          status: 'Inactive'
        },
        {
          customerId: 3,
          name: 'Alice',
          email: 'alice.johnson@example.com',
          phone: '555-9876',
          address: '789 Pine St, Villageland',
          status: 'Active'
        },
        {
          customerId: 4,
          name: 'Bob',
          email: 'bob.williams@example.com',
          phone: '555-4321',
          address: '101 Cedar St, Hamletville',
          status: 'Active'
        },
        {
          customerId: 5,
          name: 'Eva',
          email: 'eva.martin@example.com',
          phone: '555-8765',
          address: '202 Birch St, Countryside',
          status: 'Inactive'
        },
        {
          customerId: 6,
          name: 'Michael',
          email: 'michael.brown@example.com',
          phone: '555-2345',
          address: '303 Elm St, Suburbia',
          status: 'Active'
        },
        {
          customerId: 7,
          name: 'Sophia',
          email: 'sophia.jones@example.com',
          phone: '555-6543',
          address: '404 Maple St, Hamletville',
          status: 'Inactive'
        },
        {
          customerId: 8,
          name: 'David',
          email: 'david.garcia@example.com',
          phone: '555-8765',
          address: '505 Walnut St, Villageland',
          status: 'Active'
        },
        {
          customerId: 9,
          name: 'Olivia',
          email: 'olivia.white@example.com',
          phone: '555-7890',
          address: '606 Oak St, Countryside',
          status: 'Inactive'
        },
        {
          customerId: 10,
          name: 'Matthew',
          email: 'matthew.taylor@example.com',
          phone: '555-3456',
          address: '707 Pine St, Suburbia',
          status: 'Active'
        }
      ];
      const handleRowClick = (customerId) => {
        // Navigate to the order screen with the customerId parameter
        window.location.href = `/order`;
      };


  // Update filtered items when the search term changes
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    // Filter items based on the search term
    const filtered = customerData.filter(
      (item) => item.name.toLowerCase().includes(searchTerm)
    );
    setFilteredCustomer(filtered);
  };

  const renderCustomers = filteredCustomer.length > 0 ? filteredCustomer : customerData;
  return (
    <>
    <Header/>
    <div  className='p-4'>
    <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Customers</h4>
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
        {renderCustomers.map((row) => (
          <tr key={row.customerId} onClick={() => handleRowClick(row.customerId)} className="cursor-pointer">
            <td>{row.customerId}</td>
            <td>{row.name}</td>
                   <td>{row.email}</td>
            <td>{row.phone}</td>
            <td>{row.address}</td>
            <td> <span className={`badge ${row.status === 'Active' ? 'text-bg-success' : 'text-bg-danger'}`}>{row.status}</span></td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
    </>
  )
}
