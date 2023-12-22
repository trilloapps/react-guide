import { Navbar, Container, Dropdown } from 'react-bootstrap';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect , useState} from 'react';


export function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // const [userData, setUserData] = useState(null);
  // useEffect(() => {
  //   const storedData = JSON.parse( localStorage.getItem('userDetails'));
  //   setUserData(storedData);
  //   console.log("Data",userData);
  // },[])
  // const navigate = useNavigate();
  // const handleLogout = () => {
  //   localStorage.clear()
  //   navigate('/')
  // };
  return (
      // <Navbar bg="light"data-bs-theme="light">
      //   <Container>
      //     <Navbar.Brand href="#home">Sample App</Navbar.Brand>
      //   </Container>
      //   <i className="fa-regular fa-circle-user fa-lg"></i>
      // </Navbar>
      <Navbar bg="light" expand="lg">
      <div className='container-fluid'> 
        <Navbar.Brand href="#home">Sample App</Navbar.Brand>
        <div className="ml-auto">
          <Dropdown show={showDropdown}>
              <i  id="dropdown-basic" onClick={handleDropdownToggle} style={{ cursor: 'pointer' }} className="fa-regular fa-circle-user fa-lg" />
            <Dropdown.Menu>
              <Dropdown.Item eventKey="username"><i className="fa-light fa-user"></i><span> Bilal Mughal</span></Dropdown.Item>
              <Dropdown.Item eventKey="logout" className='mar'><i className="fa-regular fa-right-from-bracket"></i><span> Log Out</span></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};