import React, { useEffect, useState } from 'react';
import "./../css/itemDetail.css"
import { Modal ,Form, Button} from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';

const EDIT_API_URL = 'https://fe-wb-lab1.kdlabs.dev/ds/function/shared/EditLineItem';
const GET_DETAILS_API_URL = 'https://fe-wb-lab1.kdlabs.dev/ds/function/shared/GetItemDetails';
const headers = {
  'Accept':'*/*',
  'x-app-name':'main',
  'x-org-name':'cloud',
  'content-type':'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
}

export const ItemDetail = () => {
  const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [itemId, setItemId] = useState('');
    const [itemData, setItemData] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
  // State to manage form values
  

  // Handle input change
  const handleInputChange = (e) => {
   setQuantity(e.target.value)
  };

  const handleKeyPress = (event) => {
    // Allow only numeric characters
    const isNumeric = /^[0-9]$/;
    if (!isNumeric.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleQuantity = async (e) =>{
    e.preventDefault();
    try{
      const response = await fetch(EDIT_API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          "lineItemId": itemId,
          "quantity": quantity

        })
      });
      const data = await response.json();
      if(data.status === 'success'){
        toast.success('Quantity updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setItemData(data.data)
      handleClose()
      
    }
    catch(error)
    {
      console.error('Error during login:', error);
    }
  }
 // Function to handle form submission (you can replace this with your actual form submission logic)
 const handleSubmit = (e) => {
     e.preventDefault();
     
     handleClose();
    // Use formData for your desired action (e.g., API call, validation, etc.)
  };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleRowClick = () => {
        // Navigate to the order screen with the customerId parameter
        const queryParams = {
          orderId: orderId,
          customerId: customerId
        };
    
        navigate({
          pathname: '/items',
          search: new URLSearchParams(queryParams).toString(),
        });
        // window.location.href = `/items`;
      };

       // ---------- GETTING THE PARAMS ---------- 
       const location = useLocation();
       const queryParams = new URLSearchParams(location.search);
      
       useEffect(() => {
        const itemId = queryParams.get('itemId');
        setItemId(itemId);
        const orderId = queryParams.get('orderId');
        setOrderId(orderId);
        const customerId = queryParams.get('customerId');
        setCustomerId(customerId);
      }, [queryParams]);
      
      useEffect(() => {
        const fetchItemDetails = async () => {
          try {
            if (itemId) {
              // Make an API call
              setLoading(true)
              const response = await fetch(GET_DETAILS_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ "itemId": itemId }),
              });
              const data = await response.json();

              setItemData(data.data);
              setQuantity(data.data.quantity)
            }
          } catch (error) {
            console.error('Error fetching item details:', error);
          }
          finally{
            setLoading(false)
          }
        };
      
        // Call the fetchItemDetails function only if itemId has changed
        if (itemId !== null) {
          fetchItemDetails();
        }
      }, [itemId]);
  return (
  <>
  
  <section  className='p-4'>
  <div onClick={()=>handleRowClick()} className="cursor-pointer mb-4 back-button" ><i className="fa-solid fa-arrow-turn-down-left me-2"></i> Back to items</div>
  <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 className="m-0">Item Details</h4>
      <button className="btn btn-primary" onClick={handleShow}><i className="fa-light fa-pen-to-square"></i> Edit</button>
  </div>
  {!loading &&
  <div className="row">
      <div className="col-lg-7">
          <div className="border details rounded">
              <figure>
                  <img src={itemData?.picture} height="500" 
                      alt="item"/>
              </figure>
          </div>
      </div>
      <div className="col-lg-5">
          <div className="border-bottom mb-3"> 
              <h4>{itemData?.itemName}</h4>
              <p>
                  {itemData?.itemDescription}
              </p>
          </div>

          <div>
               <p> <strong>Code:</strong> {itemData?.itemCode}</p>
               <p> <strong>Weight:</strong> {itemData?.weight + ' lbs'}</p>
               {/* <p> <strong>Price:</strong> {itemData?.picture}</p> */}
               <p> <strong>Quantity:</strong> {itemData?.quantity}</p>
          </div>
      </div>
  </div>
}
</section>
{loading && 
  <div className='loader'>
<Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
</div>
}

<ToastContainer />
<Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="code">
              <Form.Label>Enter Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="code"
                autoFocus
                value={itemData?.itemCode}
                disabled
                 
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter weigth"
                value={itemData?.weight}
                disabled
                
              />
            </Form.Group>
           
            <Form.Group className="mb-3" controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Quantity"
                maxLength={5}
                defaultValue={itemData?.quantity}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </Form.Group>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleQuantity}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
  </>
  )
}
