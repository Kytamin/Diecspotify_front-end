import {useFormik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useState} from "react";
import {GGLogin} from "./GGLogin";
import {AuthService} from "../services/auth.service";
import { InputAdornment,IconButton,TextField } from "@mui/material";
import { Visibility,VisibilityOff } from "@mui/icons-material";
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

export function LoginComponent() {
    const [loginFail, setLoginFail] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
    const formik = useFormik({
            initialValues: {
                username: "",
                password: "",
            },
            onSubmit: async (values) => {
                try {
                    const response = await AuthService.jwtLogin(values);
                    localStorage.setItem("token", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                    const userObject = response.data.user;
                    const userString = JSON.stringify(userObject);
                    localStorage.setItem("userLogin", userString);
                    navigate('/');
                } catch (error) {
                    setLoginFail(true);
                }
            }

        }
    )

    return (
        <ThemeProvider theme={theme}>
            <div className="w-full h-full flex flex-col items-center">
                <div className="logo p-5 border-b border-solid border-gray-300 w-full flex justify-center">
                    <h1 className="text-4xl font-bold">
                        DieC<span className="text-green-500">Music</span>
                    </h1>

                </div>
                <div className="inputRegion w-full px-4 sm:w-2/3 md:w-1/2 lg:w-1/3 py-10 flex flex-col items-center">
                    <div className="font-bold mb-4 text-center text-xl">
                        To continue, log in to Spotify.
                    </div>
                    <form onSubmit={formik.handleSubmit} style={{width: '100%'}}>

                        <div style={{marginBottom: '10px'}}>
                            <TextField
                                label="Username"
                                placeholder="Enter your username"
                                className="textFieldLogin-width"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                name="username"
                            />
                        </div>

                        <div style={{marginBottom: '10px',display: 'flex', justifyContent: 'space-between' }} >
                            <TextField
                                label="Password"
                                placeholder="Password"
                                className="textFieldLogin-width"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton style={{color:"white",}} onClick={handleTogglePassword}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                            />
                            
                        </div>
                        
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            {loginFail && <div style={{color: 'red'}}><p>Wrong password or user name</p></div>}
                        </div>

                        <div className="w-full flex items-center justify-center my-8">
                            <button className="bg-green-400 font-semibold p-3 px-10 rounded-full" type="submit">
                                LOG IN
                            </button>
                        </div>
                    </form>
                    <div className="w-full border border-solid border-gray-300"></div>
                    <div className="my-6 font-semibold text-center text-lg" style={{marginTop: "20px"}}>
                        Or login with social net world
                        <div style={{marginTop: "20px"}}>
                            <GGLogin/>
                        </div>
                    </div>
                    <div className="my-6 font-semibold text-center text-lg">
                        Don't have an account?
                    </div>
                    <div
                        className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold  cursor-pointer hover:opacity-75">
                        <Link to="/signup">SIGN UP FOR DieCMusic</Link>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </ThemeProvider>
    );
}