import { Navbar, Dropdown } from 'react-bootstrap';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect , useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import errorImage from '../assets/images/error.png';


export function Header() {
  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    const storedData =  JSON.parse( localStorage.getItem('userDetails'))
    setUserData(storedData.firstName);
    getUserDetails();
  },[])
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  };

  const handleFileChange = (e) => {
    let userId = JSON.parse(localStorage.getItem('userDetails'));
    console.log(userId);
    // setUserd(userId.id)
    let functionParam = {
      userId: userId.id
    }
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('folder', 'public/images');
    formData.append('makePublic', true);
    formData.append('functionName', 'AddUserImage');
    formData.append('functionParam', JSON.stringify(functionParam));


    // Example using fetch:
    fetch('https://api.eng-dev-1.trilloapps.com/foldersvc/cloudstorage/upload', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'x-app-name': 'main',
        'x-org-name': 'cloud',
        // 'content-type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded successfully', data);
        setUserProfile(data.pictureUrl)
      })
      .catch((error) => {
        console.error('Error uploading file', error);
      });
  }

  const getUserDetails = async () => {
    let userId = JSON.parse(localStorage.getItem('userDetails'))
    try {
      const response = await fetch('https://api.eng-dev-1.trilloapps.com/ds/function/shared/GetUserDetails', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'x-app-name': 'main',
          'x-org-name': 'cloud',
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
          userId: userId.id.toString()
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUserProfile(data.data[0].pictureUrl)
      console.log(data);
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };


  return (
    <>
     
      <Navbar bg="light" expand="lg">
      <div className='container-fluid'> 
        <Navbar.Brand href="#home">Sample App</Navbar.Brand>
        <div className="ml-auto">
          <Dropdown show={showDropdown}>
           <img  id="dropdown-basic" onClick={handleDropdownToggle} src={userProfile ? userProfile : errorImage} className='profile-dropdown' alt='profile pic'/>
              {/* <i  id="dropdown-basic" onClick={handleDropdownToggle} style={{ cursor: 'pointer' }} className="fa-regular fa-circle-user fa-lg" /> */}
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
  <Modal.Title>Profile</Modal.Title>
</Modal.Header>
<Modal.Body>
  <div className='mb-3 text-center'>
    <div className='profile-avatar position-relative'>
    <img src={userProfile ? userProfile : errorImage} alt='profile pic' />
    <label className='edit-option' htmlFor='file'>
    <i className="fa-light fa-pen-to-square"></i>
    <input type='file' id='file' className='d-none' onChange={handleFileChange}/>
    </label>
    </div>
  </div>
  <div className='form-group mb-3'>
    <label className='form-label'>First Name</label>
    <input type='text' className='form-control' value='Zeeshan' disabled/>
  </div>

  <div className='form-group mb-3'>
    <label className='form-label'>Last Name</label>
    <input type='text' className='form-control' value='Ahmad' disabled/>
  </div>
</Modal.Body>
{/* <Modal.Footer>
  <Button variant="secondary" onClick={handleModalClose}>
    Close
  </Button>
  <Button variant="primary" onClick={handleModalClose}>
    Save
  </Button>
</Modal.Footer> */}
</Modal>
</>
  );
};