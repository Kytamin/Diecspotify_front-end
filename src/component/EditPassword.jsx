import PasswordInput from "../component/shared/PasswordInput";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField/TextField";
import MenuAppBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as Yup from 'yup';
import { useOutletContext } from "react-router-dom";
import Footer from "./Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
const editpasswordSchema = Yup.object().shape({
    newpassword: Yup.string()
        .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
            'Password tối thiểu 1 chữ hoa,1 số và 1 ký tự đặc biệt,8 ký tự trở lên'
        ),
});

const EditPassword = () => {
    const search = useOutletContext();
    const userLoginJSON = localStorage.getItem('userLogin');
    const userLogin = JSON.parse(userLoginJSON);
    const [errMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
    }, [errMessage]);
    const formEdit = useFormik({
        initialValues: {
            oldpassword: "",
            newpassword: "",
            newpasswordconfirm: "",
        },
        validationSchema: editpasswordSchema,
        onSubmit: values => {
            const accessToken = localStorage.getItem("token");
            let data = {
                id: userLogin._id,
                oldpassword: values.oldpassword,
                newpassword: values.newpassword,
                newpasswordconfirm: values.newpasswordconfirm
            }
            UserService.editPassword(data, accessToken).then(res => {
                if (res.data.status === "failed") {
                    setErrorMessage(res.data.message)
                } else {
                    navigate('/')
                }
            }).catch(err => {
                console.log(err);
            })
        }
    })
    return (

        <div style={{
            marginLeft: "20.5%",
            marginBottom: "155px",
            marginRight: "1%",
            color: "#fff",
            padding: "30px 20px 20px 20px",
            background: "black",
            borderRadius: "10px",
        }} >
            <MenuAppBar search={search}/>
            <ThemeProvider theme={theme}>
                <div className="w-full h-full flex flex-col items-center">
                    <div className="logo p-5 border-b border-solid border-gray-300 w-full flex justify-center">
                        {/* <Icon icon="logos:spotify" width="150" /> */}
                    </div>
                    <div className="inputRegion w-full px-4 sm:w-2/3 md:w-1/2 lg:w-1/3 py-10 flex flex-col items-center">
                        <div className="font-bold mb-4 text-2xl">
                            Security Management
                        </div>
                        <form onSubmit={formEdit.handleSubmit}>
                            <p style={{ color: "red" }}>{errMessage}</p>
                            <TextField
                                type="password"
                                label="Current Password"
                                placeholder="Enter Current Password"
                                className="my-8"
                                name="oldpassword"
                                onChange={formEdit.handleChange}
                                value={formEdit.values.oldpassword}
                                inputProps={{ style: { color: "white" } }}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                type="password"
                                label="New Password"
                                placeholder="Enter New Password"
                                className="my-8"
                                onChange={formEdit.handleChange}
                                value={formEdit.values.newpassword}
                                name="newpassword"
                                inputProps={{ style: { color: "white" } }}
                                fullWidth
                                margin="normal"
                            />
                            {formEdit.errors.newpassword && (
                                <div style={{ color: 'red' }}>{formEdit.errors.newpassword}</div>
                            )}
                            <TextField
                                type="password"
                                label="Confirm newpassword"
                                placeholder="reEnter new password"
                                className="my-8"
                                onChange={formEdit.handleChange}
                                value={formEdit.values.newpasswordconfirm}
                                name="newpasswordconfirm"
                                inputProps={{ style: { color: "white" } }}
                                fullWidth
                                margin="normal"
                            />

                            <div className="w-full flex items-center justify-center my-8">
                                <button className="bg-green-400 font-semibold p-3 px-10 rounded-full" style={{ width: "100%" }}>
                                    Edit password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </ThemeProvider>

            <Footer />
        </div>
    );
};

export default EditPassword;