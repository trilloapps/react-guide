import React, { useState , useEffect} from 'react';
import  '../css/login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) =>{
    e.preventDefault();

    const validationErrors = {};
    if (!username.trim()) {
      validationErrors.username = 'Username is required';
    }
    if (!password.trim()) {
      validationErrors.password = 'Password is required';
    }

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submission
      // You can add your login logic here
      console.log('Form submitted');
      try{
        const response = await fetch('https://api.eng-dev-1.trilloapps.com/ajaxLogin', {
          method: 'POST',
          headers: {
            'Accept':'*/*',
            'x-app-name':'main',
            'x-org-name':'cloud',
            'content-type':'application/json',
          },
          body: JSON.stringify({
            j_username: username,
            j_password: password
          })
        });
        const data = await response.json();
        
        if(data.status === 'connected'){
          window.location.href=('/customers');
          localStorage.setItem('accessToken',data.accessToken);
          localStorage.setItem('userDetails',JSON.stringify(data.user));
        }
        else{
          toast.error(`${data.message}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
  
        
      }
      catch(error)
      {
        toast.error(`API call failed: ${error.message}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error('Error during login:', error);
      }
    } else {
      // Update state with validation errors
      setErrors(validationErrors);
    }
   
  }
  useEffect(() => {
    let header = document.getElementById('header');
    header.style.display = 'none';

    // The empty dependency array [] means this effect will run once when the component mounts
  }, []);

  return (

    <div>
     <div className='auth-bg'></div>
     <div className='auth-card'>
        <h2 className='mb-3 text-center'>Login</h2>
       <form onSubmit={handleSubmit}>
        <div className='py-3'>
        <div className='form-group mb-3'>
          <label className='form-label'>
            User ID
          </label>
          <input type='text' className={`form-control ${errors.username ? 'is-invalid' : ''}`} value={username} onChange={(e) => setUsername(e.target.value)} />
          {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
        </div>

        <div className='form-group mb-3'>
          <label className='form-label'>
            Password
          </label>
          <input type='password' className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)}/>
          {errors.password && <div className='invalid-feedback'>{errors.password}</div>}

        </div>
        </div>
        <div className='form-group mb-3 text-center'>
          <button className='btn btn-primary w-100'>Submit</button>
        </div>
       </form>
      
      </div>
      <ToastContainer />
     </div>
    
  );
}

