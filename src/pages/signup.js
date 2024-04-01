import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { authentication } from '../firebase';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [verifyBoolean, setVerifyBoolean] = useState(false)
    const [loader, setLoader] = useState(false)
    const [verificationCodeError, setVerificationCodeError] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const [newUserForm, setNewUserForm] = useState({
        email: { value: '', invalid: false, dirty: false, required: false },
        userId: { value: '', invalid: false, dirty: false, required: false },
        mobilePhone: { value: '', invalid: false, dirty: false, required: false },
        firstName: { value: '', invalid: false, dirty: false, required: false },
        lastName: { value: '', invalid: false, dirty: false, required: false },
        password: { value: '', invalid: false, dirty: false, required: false },
        rptPassword: { value: '', invalid: false, dirty: false, required: false }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserForm(prevState => ({
            ...prevState,
            [name]: {
                ...prevState[name],
                value: value,
                dirty: true,
                invalid: name === 'email' ? !validateEmail(value) : false,
                required: value.trim() === ''
            }
        }));
    }
    const validateEmail = (email) => {
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    const generateRecaptcha = () => {
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
                handleSignUp();
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

    const handleSignUp = async (e) => {

        // Form is valid, proceed with submission
        // You can add your login logic here
        try {
            const response = await fetch('https://api.apps-demo-2.trilloapps.com/_preauthsvc/user/signup', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'x-app-name': 'main',
                    'x-org-name': 'cloud',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    userId: newUserForm.userId.value,
                    role: ['user'],
                    tenantName: ['cloud'],
                    password: newUserForm.password.value,
                    rptPassword: newUserForm.rptPassword.value,
                    email: newUserForm.email.value,
                    mobilePhone: newUserForm.mobilePhone.value,
                    firstName: newUserForm.firstName.value,
                    lastName: newUserForm.lastName.value,
                })
            });
            const data = await response.json();

            if (data.status === 'connected') {
                window.location.href = ('/customers');
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userDetails', JSON.stringify(data.user));
            }
            else {
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
        catch (error) {
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


    }

    const handleVerifyCodeChange = (e) => {
        console.log(e.target.value)
        setVerificationCode(e.target.value)
    }
    const handleSendCode = (e) => {
        let phoneNumber = newUserForm.mobilePhone.value;
        e.preventDefault()
        generateRecaptcha()
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(authentication, phoneNumber, appVerifier).then(confirmationResult => {
            console.log(confirmationResult, "confirmationResult")
            window.confirmationResult = confirmationResult;
            setVerifyBoolean(true);
        }).catch((error) => {
            console.log(error, "error")
        })
    }

    useEffect(() => {
        let header = document.getElementById('header');
        header.style.display = 'none';
      }, []);
      const navigate = useNavigate();
      const navigateToLogin = () =>{
        navigate('/')
      }

    return (
        <div>
            {!verifyBoolean ? (
                <div>
                    <div className='auth-bg'></div>
                    <div className='auth-card shadow'>
                        <div id="recaptcha-container"></div>
                        <form onSubmit={handleSendCode}>
                            <h2 className='login-logo mb-3 text-center'>SignUp</h2>
                            <div className="row">
                                <div className="form-group mb-3 col-md-12">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="form-control input"
                                        id="email"
                                        name="email"
                                        value={newUserForm.email.value}
                                        onChange={handleChange}
                                    />
                                    {/* Validation messages */}
                                    {(newUserForm.email.required && newUserForm.email.dirty) &&
                                        <small className="text-danger support-text">Email is required</small>}
                                    {(newUserForm.email.invalid && newUserForm.email.dirty) &&
                                        <small className="text-danger support-text">You have not given a correct email address</small>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                    <label className="form-label" htmlFor="userId">User ID</label>
                                    <input
                                        type="text"
                                        placeholder="User ID"
                                        className="form-control input"
                                        id="userId"
                                        name="userId"
                                        value={newUserForm.userId.value}
                                        onChange={handleChange}
                                    />
                                    {/* Validation messages */}
                                    {(newUserForm.userId.required && newUserForm.userId.dirty) &&
                                        <small className="text-danger support-text">User ID is required</small>}
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label className="form-label" htmlFor="mobilePhone">Mobile Phone</label>
                                    <input
                                        type="text"
                                        placeholder="Mobile Phone"
                                        className="form-control input"
                                        id="mobilePhone"
                                        name="mobilePhone"
                                        value={newUserForm.mobilePhone.value}
                                        onChange={handleChange}
                                    />
                                    {/* Validation messages */}
                                    {(newUserForm.mobilePhone.required && newUserForm.mobilePhone.dirty) &&
                                        <small className="text-danger support-text">Mobile Phone is required</small>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                    <label className="form-label" htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="form-control input"
                                        id="firstName"
                                        name="firstName"
                                        value={newUserForm.firstName.value}
                                        onChange={handleChange}
                                    />
                                    {/* Validation messages */}
                                    {(newUserForm.firstName.required && newUserForm.firstName.dirty) &&
                                        <small className="text-danger support-text">First name is required</small>}
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label className="form-label" htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="form-control input"
                                        id="lastName"
                                        name="lastName"
                                        value={newUserForm.lastName.value}
                                        onChange={handleChange}
                                    />
                                    {/* Validation messages */}
                                    {(newUserForm.lastName.required && newUserForm.lastName.dirty) &&
                                        <small className="text-danger support-text">Last name is required</small>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="form-control input"
                                        id="password"
                                        name="password"
                                        value={newUserForm.password.value}
                                        onChange={handleChange}
                                    />
                                    {/* Validation messages */}
                                    {(newUserForm.password.required && newUserForm.password.dirty) &&
                                        <small className="text-danger support-text">Password is required</small>}
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label className="form-label" htmlFor="rptPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="form-control input"
                                        id="rptPassword"
                                        name="rptPassword"
                                        value={newUserForm.rptPassword.value}
                                        onChange={handleChange}
                                    />
                                    {/* Validation messages */}
                                    {(newUserForm.rptPassword.required && newUserForm.rptPassword.dirty) &&
                                        <small className="text-danger support-text">Confirm password is required</small>}
                                </div>
                            </div>
                            <div className='form-group mb-3'>
                                <button className='btn btn-primary w-100' type="submit">
                                    Submit
                                </button>
                            </div>
                            <div className="text-center mb-3">
                                <span>Already have a member? <a className="text-primary" style={{cursor:'pointer'}} onClick={navigateToLogin}>Login</a></span>
                            </div>
                        </form>
                    </div>
                            <div id='testing'></div>
                </div>
            ) :

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
            <ToastContainer />
        </div>
    );
}


export default SignUp;

// Assuming AppAlert and AppPhoneVerification are React components defined elsewhere in your codebase.
