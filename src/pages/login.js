import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  '../css/login.css'
export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(username, password);
    try{
      const response = await fetch('https://api.kidm-demo-dev.trilloapps.com/_preauthsvc/user/authenticate', {
        method: 'POST',
        headers: {
          'Accept':'*/*',
          'x-app-name':'main',
          'x-org-name':'cloud',
          'content-type':'application/json',
        },
        body: JSON.stringify({
          userId: username,
          password: password
        })
      });
      const data = await response.json();
      console.log(data);
      if(data.status === 'connected'){
        navigate('/dashboard');
        localStorage.setItem('accessToken',data.accessToken);
        localStorage.setItem('userDetails',JSON.stringify(data.user));
      }

      
    }
    catch(error)
    {
      console.error('Error during login:', error);
    }
  }

  return (

    <div>
     <div className='auth-bg'></div>
     <div className='auth-card shadow'>
        <div className='login-text mb-3'>Login</div>
       <form onSubmit={handleSubmit}>
        <div className='form-group mb-3'>
          <label className='form-label'>
            User ID
          </label>
          <input type='text' className='form-control' value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div className='form-group mb-3'>
          <label className='form-label'>
            Password
          </label>
          <input type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)}/>

        </div>
        <div className='form-group mb-3'>
          <button className='btn btn-primary'>Submit</button>
        </div>
       </form>
      
      </div>
     </div>
    
  );
}

