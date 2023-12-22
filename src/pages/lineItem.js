import {React,useState} from 'react'
import { Table } from 'react-bootstrap';
import { Header } from './header'
import "./../css/lineItems.css"
export const LineItem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const tableHeadings = [
    { id: 2, key: "Name" },
    { id: 3, key: "Description" },
    { id: 4, key: "Code" },
    { id: 5, key: "Weight" },
    { id: 6, key: "Quantity" },
  ];
  
  const items = [
    { 
      id:1,
      image: 'https://currenwatches.com.pk/cdn/shop/products/wefew.jpg?v=1699506412',
      name: 'Watch',
      description: 'A watch is a timekeeping device typically worn on the wrist',
      code: 'fd-45486',
      weight: '50g',
      quantity: '3'
    },
    { 
      id:2,
      image: 'https://cdn.dribbble.com/userupload/4058878/file/original-87daae31fb2b541441fef5d03f37e9cd.jpg?resize=400x0',
      name: 'Product 2',
      description: 'Description for Product 2',
      code: 'pd-12345',
      weight: '75g',
      quantity: '5'
    },
    { 
      id:3,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDBGKi51cCntcIvPrIv1-AieyXvFq7UfSUPA&usqp=CAU',
      name: 'Product 3',
      description: 'Description for Product 3',
      code: 'pd-67890',
      weight: '100g',
      quantity: '2'
    },
    { 
      id:4,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbzahj1XgbP6THVZhgA2Db7pK-zeViyMKqNW914dwl5ZgAVvYApVLEUwYHjnV8sw-D0ck&usqp=CAU',
      name: 'Product 4',
      description: 'Description for Product 4',
      code: 'pd-54321',
      weight: '30g',
      quantity: '8'
    },
    { 
      id:5,
      image: 'https://www.shutterstock.com/image-vector/realistic-smartphone-mockup-mobile-phone-260nw-2252483375.jpg',
      name: 'Product 5',
      description: 'Description for Product 5',
      code: 'pd-98765',
      weight: '65g',
      quantity: '4'
    },
    { 
      id:6,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTia7bu14ENB2vjT9dhaC_ud-zxHt6cXWnaqw&usqp=CAU',
      name: 'Product 6',
      description: 'Description for Product 6',
      code: 'pd-13579',
      weight: '85g',
      quantity: '6'
    },
    { 
      id:7,
      image: 'https://cdn.dribbble.com/userupload/4058878/file/original-87daae31fb2b541441fef5d03f37e9cd.jpg?resize=400x0',
      name: 'Product 7',
      description: 'Description for Product 7',
      code: 'pd-24680',
      weight: '120g',
      quantity: '1'
    },
    { 
      id:8,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcmK0JPdcajdOYXpxSaNXaK1Zs7KiN0Vp5ug&usqp=CAU',
      name: 'Product 8',
      description: 'Description for Product 8',
      code: 'pd-11223',
      weight: '40g',
      quantity: '7'
    },
    { 
      id:9,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuREaRaHVb3T6P0RijueB3d6FHLW0zjvCF4Q&usqp=CAU',
      name: 'Product 9',
      description: 'Description for Product 9',
      code: 'pd-33445',
      weight: '95g',
      quantity: '3'
    },
    { 
      id:10,
      image: 'https://www.eatthis.com/wp-content/uploads/sites/4/2019/10/i-cant-believe-its-not-butter.jpg',
      name: 'Product 10',
      description: 'Description for Product 10',
      code: 'pd-55667',
      weight: '60g',
      quantity: '5'
    },
    // Add more records as needed
    // ...
  ];
  const handleBackClick = () => {
    // Navigate to the order screen with the customerId parameter
    window.location.href = `/order`;
  };
    // Update filtered items when the search term changes
    const handleSearch = (event) => {
      const searchTerm = event.target.value.toLowerCase();
      setSearchTerm(searchTerm);
  
      // Filter items based on the search term
      const filtered = items.filter(
        (item) => item.name.toLowerCase().includes(searchTerm)
      );
      setFilteredItems(filtered);
    };
  
    const handleRowClick = (customerId) => {
      // Navigate to the order screen with the customerId parameter
      window.location.href = `/item-detail`;
    };

    const renderItems = filteredItems.length > 0 ? filteredItems : items;
  

  return (
    <>
    <Header/>
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
        {renderItems.map((row) => (
          <tr key={row.id} onClick={() => handleRowClick(row.id)} className="cursor-pointer">
            <td><span className='d-flex gap-2 align-items-center'><img height={40} width={40} className="rounded-pill" src={row.image} alt=''/><p className='m-0'>{row.name}</p></span></td>
            <td>{row.description}</td>
            <td>{row.code}</td>
            <td>{row.weight}</td>
            <td>{row.quantity}</td>
          </tr>
        ))}
        </tbody>
      </Table>

    </div>
    </>
  )
}
