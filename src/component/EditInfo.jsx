import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import storage from "../config/firebase.config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import UserService from "../services/user.service";
import * as Yup from 'yup';
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
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "black",
    border: "2px solid #fff",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "row",
    color: "white",
};
const imageInputLabelStyle = {
    display: "inline-block",
    width: "20%",
    textAlign: "left",
    marginBottom: "5px"
};

const imageInputStyle = {
    marginLeft: "10px",
    maxWidth: "70%",
    marginBottom: "5px"
};
const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
});
export default function EditInfo({ reload }) {
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [haveImage, setHaveImage] = useState(false);
    const userLoginJSON = localStorage.getItem('userLogin');
    const userLogin = JSON.parse(userLoginJSON);
    const [showError, setShowError] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleImageInput = (e) => {
        setImage(e.target.files[0]);
        setImageSrc(URL.createObjectURL(e.target.files[0]));
    };
    const resetFormFileAndImage = () => {
        setImage("");
        setHaveImage(false);
    };
    const handleUploadFile = () => {
        return new Promise((resolve, reject) => {
            console.log(image);
            const imgRef = ref(storage, `/images/${image?.name}`);
            const imageTask = uploadBytesResumable(imgRef, image);
            imageTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    if (percent === 100) console.log("img uploaded");
                },
                (err) => {
                    console.log(err);
                    reject(err);
                },
                () => {
                    getDownloadURL(imageTask.snapshot.ref)
                        .then((avatarFirebase) => {
                            console.log(avatarFirebase);
                            setImage(avatarFirebase);
                            setHaveImage(true);
                            resolve();
                        })
                        .catch((err) => reject(err));
                }
            );
        });
    };

    const formAdd = useFormik({
        initialValues: {
            firstName: userLogin.firstName,
            lastName: userLogin.lastName,
            phoneNumber: userLogin.phoneNumber,
            gender: userLogin.gender,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            try {
                setShowError("Submitting...");
                handleUploadFile();
            } catch (e) {
                console.log(e);
            }
        },
    });
    useEffect(() => {
        const accessToken = localStorage.getItem("token");
        if (haveImage) {
            let data = {
                id: userLogin._id,
                ...formAdd.values,
                avatar: image,
            };
            console.log(data);
            resetFormFileAndImage();
            formAdd.resetForm();
            handleClose()
            UserService.editInfo(data, accessToken)
                .then((res) => {
                    reload(userLogin)
                })
                .catch((err) => console.log(err));
            const dataLogin = {
                _id: userLogin._id,
                username: userLogin.username,
                role: userLogin.role,
                ...formAdd.values,
                avatar: image,
            }
            const userString = JSON.stringify(dataLogin);
            localStorage.setItem("userLogin", userString);
        }
    }, [haveImage]);
    return (
        <>
            <Button
                sx={{
                    backgroundColor: "black",
                    color: "white",
                    margin: "10px",
                    border: "2px solid white",
                    "&:hover": {
                        backgroundColor: "grey",
                        color: "white",
                    },
                }}
                onClick={handleOpen}
            >
                Edit
            </Button>
            <ThemeProvider theme={theme}>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        component="form"
                        onSubmit={formAdd.handleSubmit}
                        noValidate
                        sx={style}
                    >
                        <div style={{ position: "relative", width: "50%" }}>
                            <h1
                                style={
                                    showError === "" || showError === "Submitting..."
                                        ? { color: "black" }
                                        : { color: "red" }
                                }
                            >
                                {showError === "" ? "Edit Profile" : showError}
                            </h1>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                value={formAdd.values.firstName}
                                onChange={formAdd.handleChange}
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                autoComplete="firstName"
                                autoFocus
                            />
                            {formAdd.errors.firstName && (
                                <div style={{ color: 'red' }}>{formAdd.errors.firstName}</div>
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                value={formAdd.values.lastName}
                                onChange={formAdd.handleChange}
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lastName"
                                autoFocus
                            />
                            {formAdd.errors.lastName && (
                                <div style={{ color: 'red' }}>{formAdd.errors.lastName}</div>
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                value={formAdd.values.phoneNumber}
                                onChange={formAdd.handleChange}
                                id="phoneNumber"
                                label="Phone Number"
                                name="phoneNumber"
                                autoComplete="phoneNumber"
                                autoFocus
                            />

                            {formAdd.errors.phoneNumber && (
                                <div style={{ color: 'red' }}>{formAdd.errors.phoneNumber}</div>
                            )}
                            <div className="textInputDiv flex flex-col space-y-2 w-full">
                                <label className="font-semibold pt-5">Gender</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-black text-white"
                                    name="gender"
                                    value={formAdd.values.gender}
                                    onChange={formAdd.handleChange}
                                    required
                                >
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <label htmlFor="avatar" style={imageInputLabelStyle}>Avatar:</label>
                            <input id="avatar" name="avatar" type="file" onChange={handleImageInput} style={imageInputStyle} />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: "green" }}
                            >
                                Save
                            </Button>
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                width: "50%",
                                height: "100%",
                                top: 0,
                                right: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {imageSrc !== "" ? (
                                <img
                                    src={imageSrc}
                                    alt="Image Preview"
                                    style={{ width: "80%", height: "80%" }}
                                />
                            ) : (
                                <p>Image Preview</p>
                            )}
                        </div>
                    </Box>
                </Modal>
            </ThemeProvider>
        </>
    );
}
