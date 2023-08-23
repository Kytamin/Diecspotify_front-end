import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import {useFormik} from "formik";
import { useState} from "react";
import AdminService from "../../services/admin.service";
import * as Yup from 'yup';
import {createTheme, ThemeProvider} from "@mui/material/styles";

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
                        borderWidth: 1,
                        borderColor: '#ffffff1a', // Màu viền (border) ban đầu
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff', // Màu viền khi hover
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff', // Màu viền khi input được chọn (focus)
                        backgroundColor: '#ffffff1a'
                    },
                    '& input': {
                        backgroundColor: '#ffffff1a',
                        borderRadius: '5px'
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
    width: 400,
    bgcolor: "#282828",
    border: "none",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "row-reverse",
    color: "white",
    borderRadius: '10px'
};

const validationSchema = Yup.object({
    name: Yup.string().required('name is reqired'),
});
export default function AddTag({reload}) {
    const [open, setOpen] = useState(false);
    const [showError, setShowError] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setShowError('')
        setOpen(false)
    };
  const formAdd = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            try {
                setShowError("Submitting...");
                let data = {
                    name:values.name
                };
                AdminService.addTag(data)
                .then((res) => {
                    reload(res)
                })
                .catch((err) => console.log(err));
                handleClose()
                formAdd.resetForm()
            } catch (e) {
                console.log(e);
            }
        },
    });
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
                +
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
                        <div style={{position: "relative"}}>
                            <h1
                                style={
                                    showError === "" || showError === "Submitting..."
                                        ? {color: "white", fontSize: '30px'}
                                        : {color: "red"}
                                }
                            >
                                {showError === "" ? "Add Tag" : showError}
                            </h1>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                value={formAdd.values.name}
                                onChange={formAdd.handleChange}
                                id="name"
                                label="Tag name"
                                name="name"
                                autoComplete="Tag name"
                                autoFocus
                            />
                            {formAdd.errors.name && (
                                <div style={{color: 'red'}}>{formAdd.errors.name}</div>
                            )}
                        <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: "white",
                                    borderRadius: '50px',
                                    
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        backgroundColor: 'white',
                                        fontWeight: 600
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </ThemeProvider>
        </>
    );
}