import {useFormik} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import TextField from '@mui/material/TextField';
import {useState} from "react";
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff', // Đổi màu chữ (text) thành trắng
        },
        text: {
            primary: '#ffffff', // Đổi màu chữ (text) thành trắng
            secondary: '#ffffff', // Đổi màu chữ phụ (secondary text) thành trắng
        },
    },
    components: {
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    color: 'red',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#ffffff', // Màu chữ (text) khi label được focus
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                        borderColor: '#ffffff', // Màu viền (border) ban đầu
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff', // Màu viền khi hover
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff', // Màu viền khi input được chọn (focus)
                    },
                },

            },
        },
    },
});

export function SignupComponent() {
    const [alert_exist_user, set_alert_exist_user] = useState(false);
    const navigate = useNavigate();
    const validateSignup = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .matches(/^[a-z0-9]+$/, 'Username cannot contain uppercase letters or special characters'),
        password: Yup.string()
            .required('Password is required')
            .matches(
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                'Minimum of 8 characters that contains uppercase, numbers and symbols'
            ),
        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        phoneNumber: Yup.string()
            .nullable()
            .matches(/^\d{9,10}$/, 'Phone number must have 9 to 10 digits'),
        firstName: Yup.string()
            .matches(/^[A-Za-z ]+$/, 'First name cannot contain numbers or special characters'),
        lastName: Yup.string()
            .matches(/^[A-Za-z ]+$/, 'Last name cannot contain numbers or special characters'),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            gender: "",
            avatar: "",
            countryCode: "",
        },
        validationSchema: validateSignup,
        onSubmit: async (values) => {
            try {
                let data = {
                    username: values.username,
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    firstname: values.firstName,
                    lastname: values.lastName,
                    phoneNumber: values.countryCode + values.phoneNumber,
                    gender: values.gender,
                    avatar: values.avatar,
                }
                await axios.post("http://localhost:8000/auth/register", data);
                navigate('/login');
            } catch (error) {
                set_alert_exist_user(true);
            }
        }
    });

    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <div className="w-full h-full flex flex-col items-center">
                <div className="logo p-5 border-b border-solid border-gray-300 w-full flex justify-center">
                    <h1 className="text-4xl font-bold">
                        DieC<span className="text-green-500">Music</span>
                    </h1>
                </div>
                <div
                    className="inputRegion w-full px-4 sm:w-2/3 md:w-1/2 lg:w-1/3 py-10 flex flex-col items-center">
                    <div className="font-bold mb-4 text-2xl">
                        Sign up for free to start listening.
                    </div>

                    <form onSubmit={formik.handleSubmit} style={{width: '100%'}}>
                        {!showAdditionalFields && (
                            <>
                                <div style={{display: 'flex', justifyContent: 'center', flexDirection: "column"}}>
                                    <div style={{marginBottom: '10px'}}>
                                        <TextField
                                            label="Username"
                                            placeholder="Enter your username"
                                            className="textFieldSignup-width"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            name="username"
                                            sx={{borderColor: "white"}}
                                            required
                                            error={showErrorMessage}
                                            helperText={formik.errors.username ? formik.errors.username : " "}
                                        />
                                    </div>

                                    <div style={{marginBottom: '10px'}}>
                                        <TextField
                                            label="Create password"
                                            placeholder="Enter a strong password here"
                                            className="textFieldSignup-width"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            name="password"
                                            type="password"
                                            required
                                            error={showErrorMessage}
                                            helperText={formik.errors.password ? formik.errors.password : " "}
                                        />
                                    </div>

                                    <div style={{marginBottom: '10px'}}>
                                        <TextField
                                            label="Confirm password"
                                            placeholder="Confirm your password here"
                                            className="textFieldSignup-width"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            error={showErrorMessage}
                                            helperText={formik.errors.confirmPassword ? formik.errors.confirmPassword : " "}
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex items-center justify-center my-8">
                                    <button
                                        className="bg-green-400 font-semibold p-3 px-10 rounded-full"
                                        type="button"
                                        onClick={() => {
                                            if (formik.isValid && formik.dirty) {
                                                setShowAdditionalFields(true);
                                                setShowErrorMessage(false);
                                            } else {
                                                setShowErrorMessage(true);
                                            }
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    {showErrorMessage &&
                                        <div style={{color: 'red'}}>{"Need to complete field"}</div>}
                                </div>
                            </>
                        )}

                        {showAdditionalFields && (
                            <>
                                <div style={{marginBottom: '10px'}}>
                                    <TextField
                                        label="First Name"
                                        placeholder="Enter your firstName"
                                        className="textFieldSignup-width"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        name="firstName"
                                        helperText={formik.errors.firstName ? formik.errors.firstName : null}
                                    />
                                </div>

                                <div style={{marginBottom: '10px'}}>
                                    <TextField
                                        label="Last Name"
                                        placeholder="Enter your lastName"
                                        className="textFieldSignup-width"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        name="lastName"
                                        helperText={formik.errors.lastName ? formik.errors.lastName : null}
                                    />
                                </div>

                                <div style={{marginBottom: '10px', display: 'flex', flexDirection: 'row'}}>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-black text-white"
                                        name="countryCode"
                                        value={formik.values.countryCode}
                                        onChange={formik.handleChange}
                                        style={{
                                            width: '50%',
                                            borderWidth: 2,
                                            borderColor: '#ffffff',
                                            marginRight: '5px',
                                        }}
                                    >
                                        <option value="" hidden>Country code</option>
                                        <option value="+1">US (+1)</option>
                                        <option value="+44">UK (+44)</option>
                                        <option value="+81">JP (+81)</option>
                                        <option value="+84">VN (+84)</option>
                                    </select>
                                    <TextField
                                        label="Phone Number"
                                        placeholder="Enter your phoneNumber"
                                        className="textFieldSignup-width"
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        name="phoneNumber"
                                        helperText={formik.errors.phoneNumber ? formik.errors.phoneNumber : null}
                                    />
                                </div>

                                <div className="textInputDiv flex flex-col space-y-2 w-full">
                                    <label className="font-semibold pt-5">Gender</label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-black text-white"
                                        name="gender"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#ffffff',
                                        }}
                                    >
                                        <option value="" hidden>Select your gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="w-full flex items-center justify-center my-8">
                                    <button className="bg-green-400 font-semibold p-3 px-10 rounded-full"
                                            type="submit">
                                        Sign Up
                                    </button>
                                </div>

                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    {alert_exist_user &&
                                        <div style={{color: 'red'}}><p>This user is already exist</p></div>}
                                </div>
                            </>
                        )}
                    </form>
                    {/* ... other content ... */}
                    <div className="w-full border border-solid border-gray-300"></div>
                    <div className="my-6 font-semibold text-lg">
                        Already have an account?
                    </div>
                    <div
                        className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold cursor-pointer hover:opacity-75">
                        <Link to="/login">LOG IN INSTEAD</Link>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </ThemeProvider>
    )
}