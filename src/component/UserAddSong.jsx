import {FileUploader} from "react-drag-drop-files";
import {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import {useFormik} from "formik";
import UserService from "../services/user.service";
import storage from "../config/firebase.config";
import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
import CircularProgress from '@mui/material/CircularProgress';
import AutocompleteTextField from './shared/AutocompleteTextField'
import SongService from "../services/song.service";

const fileTypes = ["MP3"];
const BoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "row",
    color: "black",
    borderRadius: '10px',
};

function UploadSongDragAndDrop() {
    const [hover, setHover] = useState(false);

    return (
        <>
            <div
                style={{
                    width: "100%",
                    height: "100px",
                    marginBottom: "10px",
                    border: "3px dashed #eeeeee",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <p>
          <span
              style={{
                  marginRight: "5px",
                  borderBottom: hover ? "3px solid white" : "2px solid white",
                  fontWeight: hover ? "700" : "500",
                  cursor: "pointer",
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
          >
            Select
          </span>
                    <span>or drop your track here!</span>
                </p>
            </div>
        </>
    );
}

function UploadImageDragAndDrop({imageSrc}) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {imageSrc === "" ? (
                <div
                    style={{
                        width: "75%",
                        height: "75%",
                        border: "3px dashed #000000",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <>
                        <div
                            style={{
                                width: "80%",
                                height: "80%",
                                textAlign: 'center',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignContent: 'center',
                                fontSize: '100px',
                                fontWeight: '100',
                            }}
                        >
                            +
                        </div>
                        <p id={"upload"} style={{marginBottom: "20px"}}>
                            Select an image
                        </p>
                    </>
                </div>
            ) : (
                <img
                    src={imageSrc}
                    alt="img"
                    style={{width: "75%", height: "75%"}}
                />
            )}
        </div>
    );
}

function UserAddSong({reload}) {
    const [file, setFile] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [haveFile, setHaveFile] = useState(false);
    const [haveAvatar, setHaveAvatar] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);

    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    const userLoginJSON = localStorage.getItem("userLogin");
    const userLogin = JSON.parse(userLoginJSON);
    const userID = userLogin._id;

    const [singers, setSingers] = useState(null)
    const [composers, setComposers] = useState(null)
    const [tags, setTags] = useState(null)

    const handleOpen = (input) => {
        formAdd.setFieldValue('songName', input.name.substring(0, input.name.length - 4))
        setOpen(true);
    };
    const handleClose = () => {
        setImageSrc('')
        formAdd.resetForm();
        setOpen(false);
    };
    const resetFormFileAndImage = () => {
        setFile(null);
        setAvatar(null);
        setHaveFile(false);
        setHaveAvatar(false);
    };
    const handleChangeFile = (input) => {
        console.log(input);
        setFile(input);
        handleOpen(input);
    };
    const handleChangeAvatar = (input) => {
        console.log(input);
        setAvatar(input);
        setImageSrc(URL.createObjectURL(input));
    };
    const handleUploadFile = () => {
        return new Promise((resolve, reject) => {
            const imgRef = ref(storage, `/images/${avatar.name}`);
            const imageTask = uploadBytesResumable(imgRef, avatar);
            const fileRef = ref(storage, `/songs/${file.name}`);
            const fileTask = uploadBytesResumable(fileRef, file);

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
                            setAvatar(avatarFirebase);
                            setHaveAvatar(true);
                            resolve();
                        })
                        .catch((err) => reject(err));
                }
            );

            fileTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    if (percent === 100) console.log("file uploaded");
                },
                (err) => {
                    console.log(err);
                    reject(err);
                },
                () => {
                    getDownloadURL(fileTask.snapshot.ref)
                        .then((fileFirebase) => {
                            setFile(fileFirebase);
                            setHaveFile(true);
                            resolve();
                        })
                        .catch((err) => reject(err));
                }
            );
        });
    };
    const formAdd = useFormik({
        initialValues: {
            songName: "",
            description: "",
            singers: [],
            composers: [],
            tags: [],
            uploader: userID,
            isPublic: false,
        },
        onSubmit: (values) => {
            try {
                if (!file || !avatar) {
                    return console.log("no file");
                }
                if (formAdd.values.songName === "") {
                    return console.log("no song name");
                }
                console.log("submitting");
                setIsSubmit(true);
                handleUploadFile();
            } catch (e) {
                console.log(e);
            }
        },
    });
    useEffect(() => {
        Promise.all([
            SongService.getSingers(),
            SongService.getComposers(),
            SongService.getTags()
        ])
            .then(values => {
                setSingers(values[0].data.data)
                setComposers(values[1].data.data)
                setTags(values[2].data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }, [])
    useEffect(() => {
        if (haveFile && haveAvatar) {
            let data = {
                ...formAdd.values,
                fileURL: file,
                avatar: avatar,
            };
            console.log(data);
            const accessToken = localStorage.getItem("token");
            UserService.addSong(data, accessToken)
                .then((res) => {
                    setIsSubmit(false);
                    resetFormFileAndImage();
                    reload(data);
                    handleClose();
                })
                .catch((err) => console.log(err.response.data.message));
        }
    }, [haveFile, haveAvatar]);
    return (
        <>
            <FileUploader
                handleChange={handleChangeFile}
                name="file"
                label="Upload or drop your track here"
                types={fileTypes}
                multiple={false}
                required={true}
                children={<UploadSongDragAndDrop/>}
            />
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
                    sx={BoxStyle}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "50%",
                            height: "100%",
                            top: 0,
                            left: 0,
                        }}
                    >
                        <FileUploader
                            handleChange={handleChangeAvatar}
                            name="avatar"
                            types={["JPG", "PNG", "GIF"]}
                            multiple={false}
                            required={true}
                            children={<UploadImageDragAndDrop imageSrc={imageSrc}/>}
                        />
                    </div>
                    <div
                        style={{
                            position: "relative",
                            width: "50%",
                            marginLeft: "50%",
                        }}
                    >
                        <h1>Add a new song</h1>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            value={formAdd.values.songName}
                            onChange={formAdd.handleChange}
                            id="songName"
                            label="Song Name"
                            name="songName"
                            autoComplete="songName"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            value={formAdd.values.description}
                            onChange={formAdd.handleChange}
                            id="description"
                            label="Description"
                            name="description"
                            autoComplete="description"
                            autoFocus
                        />
                        <AutocompleteTextField
                            datalist={singers}
                            setValue={formAdd.setFieldValue}
                            inputText={"Singer:"}
                            formField={"singers"}
                            defaultValues={[]}
                        />
                        <AutocompleteTextField
                            datalist={composers}
                            setValue={formAdd.setFieldValue}
                            inputText={"Composers:"}
                            formField={"composers"}
                            defaultValues={[]}
                        />
                        <AutocompleteTextField
                            datalist={tags}
                            setValue={formAdd.setFieldValue}
                            inputText={"Tags:"}
                            formField={"tags"}
                            defaultValues={[]}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2, backgroundColor: "green"}}
                            disabled={isSubmit}
                        >
                            {
                                isSubmit
                                    ? <CircularProgress size={25} color='inherit'/>
                                    : 'Save'
                            }
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default UserAddSong;
