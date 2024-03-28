import { Navbar, Dropdown } from 'react-bootstrap';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef , useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import errorImage from '../assets/images/error.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function Header() {
  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    const storedData =  JSON.parse( localStorage.getItem('userDetails'))
    setUserData(storedData?.firstName);
    getUserDetails();
  },[])
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  };
  const navigateToCustomers = () =>{
    navigate('/customers')
  }
  const navigateToAdmin = () =>{
    navigate('/admin')

  }


  const handleFileChange = (e) => {
    let userId = JSON.parse(localStorage.getItem('userDetails'));
    // setUserd(userId.id)
    let functionParam = {
      userId: userId?.id
    }
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('folder', 'public/images');
    formData.append('makePublic', true);
    formData.append('functionName', 'AddUserImage');
    formData.append('functionParam', JSON.stringify(functionParam));


    // Example using fetch:
    fetch('https://api.apps-demo-2.trilloapps.com/foldersvc/cloudstorage/upload', {
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
        getUserDetails()
        toast.success('Picture updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error('Error uploading file', error);
      });
  }

  const getUserDetails = async () => {
    let userId = JSON.parse(localStorage.getItem('userDetails'))
    try {
      const response = await fetch('https://api.apps-demo-2.trilloapps.com/ds/function/shared/GetUserDetails', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'x-app-name': 'main',
          'x-org-name': 'cloud',
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({
          userId: userId?.id.toString()
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUserProfile(data.data.pictureUrl)
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };


  return (
    <>
     
      <Navbar bg="light" expand="lg" id='header'>
      <div className='container-fluid'> 
        <Navbar.Brand className='cursor-pointer text-white' onClick={navigateToCustomers}>Sample App</Navbar.Brand>
        <div ref={dropdownRef} className="ml-auto">
          <Dropdown show={showDropdown}>
           <img  id="dropdown-basic" onClick={handleDropdownToggle} src={userProfile ? userProfile : errorImage} className='profile-dropdown' alt='profile pic'/>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="username"><i className="fa-light fa-user me-1"></i><span> {userData}</span></Dropdown.Item>
              <Dropdown.Item eventKey="profile" className='mar' onClick={navigateToAdmin}><i className="fa-solid fa-user-tie-hair me-1"></i><span> User Manger</span></Dropdown.Item>
              <Dropdown.Item eventKey="profile" className='mar' onClick={handleModalShow}><i className="fa-light fa-address-card me-1"></i><span> Profile</span></Dropdown.Item>
              <Dropdown.Item eventKey="logout" className='mar' onClick={handleLogout}><i className="fa-regular fa-right-from-bracket me-1"></i><span> Logout</span></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>

<Modal show={show} onHide={handleModalClose} centered>
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
</Modal>
<ToastContainer />
</>
  );
};