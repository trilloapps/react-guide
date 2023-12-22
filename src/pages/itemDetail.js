import {React, useState} from 'react'
import "./../css/itemDetail.css"
import { Header } from './header';
import { Modal ,Form, Button} from 'react-bootstrap';
export const ItemDetail = () => {
    const [show, setShow] = useState(false);
  // State to manage form values
  const [formData, setFormData] = useState({
    code: 'cs-45468',
    weight: '50g',
    price: '50$',
    quantity: '4',
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
 // Function to handle form submission (you can replace this with your actual form submission logic)
 const handleSubmit = (e) => {
     e.preventDefault();
     console.log('Form Data:', formData);
     handleClose();
    // Use formData for your desired action (e.g., API call, validation, etc.)
  };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleRowClick = (customerId) => {
        // Navigate to the order screen with the customerId parameter
        window.location.href = `/items`;
      };
  return (
  <>
  <Header/>
  <section  className='p-4'>
    <div onClick={()=>handleRowClick()} className="cursor-pointer mb-4 back-button" ><i className="fa-solid fa-arrow-turn-down-left me-2"></i> Back to orders</div>
    <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Items</h4>
        <button className="btn btn-primary" onClick={handleShow}><i className="fa-light fa-pen-to-square"></i> Edit</button>
    </div>
    <div className="row">
        <div className="col-lg-7">
            <div className="border details rounded">
                <figure>
                    <img src="https://currenwatches.com.pk/cdn/shop/products/wefew.jpg?v=1699506412" height="500"
                        alt=""/>
                </figure>
            </div>
        </div>
        <div className="col-lg-5">
            <div className="border-bottom mb-3"> 
                <h4>Watch</h4>
                <p>
                    A watch is a timekeeping device typically worn on the wrist or carried in a pocket. It is designed
                    to measure and display the passage of time. Watches come in various styles, ranging from simple and
                    functional to elaborate and fashionable.

                    The basic components of a traditional wristwatch include a timekeeping mechanism, usually a movement
                    or quartz crystal, which powers the hands that indicate the hours, minutes, and sometimes seconds.
                    The watch may also feature additional complications such as date displays, chronographs (stopwatch
                    functions), and other specialized features.

                    Watches can be powered by mechanical movements, where the energy is derived from winding the watch
                    manually or automatically through the motion of the wearer's wrist. Alternatively, quartz watches
                    use a battery to power the movement.
                </p>
            </div>

            <div>
                 <p> <strong>Code:</strong> {formData.code}</p>
                 <p> <strong>Weight:</strong> {formData.weight}</p>
                 <p> <strong>Price:</strong> {formData.price}</p>
                 <p> <strong>Quantity:</strong> {formData.quantity}</p>
            </div>
        </div>
    </div>
</section>

<Modal show={show} onHide={handleClose}>
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
                value={formData.code}
                 onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter weigth"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
  </>
  )
}
