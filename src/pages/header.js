import { Navbar, Dropdown } from 'react-bootstrap';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect , useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export function Header() {
  const [show, setShow] = useState(false);

  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const storedData =  JSON.parse( localStorage.getItem('userDetails'))
    setUserData(storedData.firstName);
  },[])
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  };
  return (
    <>
     
      <Navbar bg="light" expand="lg">
      <div className='container-fluid'> 
        <Navbar.Brand href="#home">Sample App</Navbar.Brand>
        <div className="ml-auto">
          <Dropdown show={showDropdown}>
              <i  id="dropdown-basic" onClick={handleDropdownToggle} style={{ cursor: 'pointer' }} className="fa-regular fa-circle-user fa-lg" />
            <Dropdown.Menu>
              <Dropdown.Item eventKey="username"><i className="fa-light fa-user"></i><span> {userData}</span></Dropdown.Item>
              <Dropdown.Item eventKey="logout" className='mar' onClick={handleModalShow}><i className="fa-light fa-address-card"></i><span> Profile</span></Dropdown.Item>
              <Dropdown.Item eventKey="logout" className='mar' onClick={handleLogout}><i className="fa-regular fa-right-from-bracket"></i><span> Log Out</span></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>

<Modal show={show} onHide={handleModalClose}>
<Modal.Header closeButton>
  <Modal.Title>Modal heading</Modal.Title>
</Modal.Header>
<Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleModalClose}>
    Close
  </Button>
  <Button variant="primary" onClick={handleModalClose}>
    Save Changes
  </Button>
</Modal.Footer>
</Modal>
</>
  );
};