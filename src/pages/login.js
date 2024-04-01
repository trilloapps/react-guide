import React, { useState , useEffect} from 'react';
import  '../css/login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { authentication } from '../firebase';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false)
  const [errors, setErrors] = useState({});
  const[userDetail,setUserDetail]=useState()
  const [verifyBoolean, setVerifyBoolean] = useState(false)
  const [verificationCodeError, setVerificationCodeError] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const navigate = useNavigate();


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
  };
  const navigateToAdmin = () =>{
    navigate('/signup')

  }
  const generateRecaptcha = () => {
    console.log("heyyy")
    window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'testing', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            //   onSignInSubmit();
        }
    });
}
const verifyToken = (e) => {

    if (verificationCode.length === 6) {
        window.confirmationResult.confirm(verificationCode).then(async (result) => {

            console.log(result, "reseeeee")
            window.location.href=('/customers');
            localStorage.setItem('accessToken',userDetail.accessToken);
            localStorage.setItem('userDetails',JSON.stringify(userDetail.user));
        },
            (error) => {
                console.log("Error catched===>>>>>", error);
                //  this.Loader = false;
                //  this.displayAlertMessage('Invalid code!', 'error', 'danger');
            })
            .catch((error) => {
                console.log("error: ", error);
                //  this.Loader = false;
                //  this.displayAlertMessage('An internal server error occured. Please try again later.', 'error', 'danger');
            });
    }
}

  const handleVerifyCodeChange = (e) => {
    console.log(e.target.value)
    setVerificationCode(e.target.value)
}
  const handleSubmit = async (e) =>{
    e.preventDefault();


    const validationErrors = {};
    if (!username.trim()) {
      validationErrors.username = 'User ID is required';
    }
    if (!password.trim()) {
      validationErrors.password = 'Password is required';
    }

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submission
      // You can add your login logic here
      try{
        const response = await fetch('https://api.apps-demo-2.trilloapps.com/_preauthsvc/user/authenticate', {
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
        
        if(data.status === 'connected'){
          generateRecaptcha()
          setUserDetail(data)
          let phoneNumber = data.user.mobilePhone;
          let appVerifier = window.recaptchaVerifier;
          console.log(phoneNumber,appVerifier)
          signInWithPhoneNumber(authentication, phoneNumber, appVerifier).then(confirmationResult => {
              console.log(confirmationResult, "confirmationResult")
              window.confirmationResult = confirmationResult;
              setVerifyBoolean(true);
          }).catch((error) => {
              console.log(error, "error")
          })

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

    {!verifyBoolean ? (
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
          <input type='text' placeholder='User ID' className={`form-control ${errors.username ? 'is-invalid' : ''}`} value={username} onChange={handleUsernameChange}/>
          {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
        </div>

        <div className='form-group mb-3'>
          <label className='form-label'>
            Password
          </label>
          <input type='password' placeholder='Password' className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={handlePasswordChange}/>
          {errors.password && <div className='invalid-feedback'>{errors.password}</div>}

        </div>
        </div>
        <div className='form-group mb-3 text-center'>
          <button className='btn btn-primary w-100'>Submit</button>
        </div>
       </form>
       <div className="text-center">
        <span >Don't have an account? <a  className=" text-primary"  style={{cursor:'pointer'}} onClick={navigateToAdmin} >Signup</a> </span>
     </div>
      </div>
      <div id='testing'></div>
      <ToastContainer />
     </div>):
     

      (
        <div>
      <div className='auth-bg'></div>
      <div className="auth-card shadow" >
      <div className="">
          <h2 className="text-primary fw-bold text-center mb-4">
              We just texted you
          </h2>
          <p className="m-0 pb-2 text-center">
              <b>A verification code was sent to your Phone Number</b>
          </p>
          <form>
              <div className="d-flex align-items-center gap-2 pb-2">
                  <input
                      type="text"
                      maxLength="6"
                      className="form-control"
                      placeholder="Enter 6 digit code"
                      value={verificationCode}
                      onChange={handleVerifyCodeChange}
                  />
              </div>
              <small className="text-danger support-text">
                  {verificationCodeError}
              </small>
              <small
                  className="text-danger font-14 mt-1"
                  style={{
                      display:
                          verificationCode.length > 1 && verificationCode.length < 6 ? 'block' : 'none',
                  }}
              >
                  Please enter verification code
              </small>
          </form>
          <div className="text-center mt-4">
              <button
                  className="btn btn-primary"
                  onClick={verifyToken}

              >
                  {!loader ? (
                      'Submit Code'
                  ) : (
                      <div className="spinner-border spinner-border-sm" role="status">
                          <span className="sr-only">Loading...</span>
                      </div>
                  )}
              </button>
          </div>
          <div className="text-center mt-5">
              <div className="d-flex gap-2 text-center">
                  <p className="m-0 pt-2 pb-2">
                      <b>Having issues receiving a code?</b>
                  </p>{' '}
                  <a href='/' className="pt-2 pb-2">
                      Contact support
                  </a>
              </div>
          </div>
      </div>
  </div>
  </div>
     )}
        </div>
  );
}

