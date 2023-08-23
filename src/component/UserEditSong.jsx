import {FileUploader} from "react-drag-drop-files";
import {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import AutocompleteTextField from "./shared/AutocompleteTextField";
import {useFormik} from "formik";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import storage from "../config/firebase.config";
import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
import SongService from "../services/song.service";
import UserService from "../services/user.service";

const BoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '60%',
    height: '70%',
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "row",
    color: "black",
    borderRadius: "10px",
};

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
                                textAlign: "center",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                alignContent: "center",
                                fontSize: "100px",
                                fontWeight: "100",
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
                <img src={imageSrc} alt="img" style={{width: "75%", height: "75%"}}/>
            )}
        </div>
    );
}

const UserEditSong = ({songID, reload}) => {
    const [avatar, setAvatar] = useState(null);
    const [haveAvatar, setHaveAvatar] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [song, setSong] = useState('')

    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    const userLoginJSON = localStorage.getItem("userLogin");
    const userLogin = JSON.parse(userLoginJSON);
    const userID = userLogin._id;

    const [singers, setSingers] = useState(null);
    const [composers, setComposers] = useState(null);
    const [tags, setTags] = useState(null);

    const handleChangeAvatar = (input) => {
        setAvatar(input);
        const imgURL = URL.createObjectURL(input)
        if (input) setImageSrc(imgURL);
    };

    const handleUploadFile = () => {
        return new Promise((resolve, reject) => {
            const imgRef = ref(storage, `/images/${avatar.name}`);
            const imageTask = uploadBytesResumable(imgRef, avatar);

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
        });
    };
    const handleOpen = () => {
        UserService.getOneSong(songID)
            .then(res => {
                setSong(res.data.song)
            })
            .catch(err => console.log(err))
        setOpen(true);
    };
    useEffect(() => {
        if (song) {
            setImageSrc(song.avatar)
            formEdit.setFieldValue('songName', song.songName)
            formEdit.setFieldValue('description', song.description)
            formEdit.setFieldValue('singers', song.singers)
            formEdit.setFieldValue('composers', song.composers)
            formEdit.setFieldValue('tags', song.tags)
        }
    }, [song])
    const handleClose = () => {
        setSong('')
        formEdit.resetForm();
        setOpen(false);
    };
    const resetFormFileAndImage = () => {
        setAvatar(null);
        setHaveAvatar(false);
    };

    const formEdit = useFormik({
        initialValues: {
            songName: '',
            description: '',
            singers: [],
            composers: [],
            tags: [],
            uploader: userID,
            isPublic: false,
        },
        onSubmit: (values) => {
            try {
                if (formEdit.values.songName === "") {
                    return console.log("no song name");
                }
                console.log("submitting");
                setIsSubmit(true);
                if (avatar) handleUploadFile();
                else setHaveAvatar(true);
            } catch (e) {
                console.log(e);
            }
        },
    });
    useEffect(() => {
        Promise.all([
            SongService.getSingers(),
            SongService.getComposers(),
            SongService.getTags(),
        ])
            .then((values) => {
                setSingers(values[0].data.data);
                setComposers(values[1].data.data);
                setTags(values[2].data.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);
    useEffect(() => {
        if (haveAvatar) {
            let data = {
                ...formEdit.values,
                fileURL: song.fileURL,
                avatar: avatar ? avatar : song.avatar,
                _id: song._id,
            };
            UserService.editSong(data)
                .then((res) => {
                    setImageSrc(res.data.song.avatar);
                    setIsSubmit(false);
                    resetFormFileAndImage();
                    reload(data);
                    handleClose();
                })
                .catch((err) => console.log(err));
        }
    }, [haveAvatar]);
    return (
        <>
            <IconButton aria-label="delete" onClick={handleOpen}>
                <EditIcon
                    sx={{
                        color: "#4f48cb",
                    }}
                />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    component="form"
                    onSubmit={formEdit.handleSubmit}
                    noValidate
                    sx={BoxStyle}
                >
                    {song ? (
                        <>
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
                                <h1>Edit a song</h1>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    value={formEdit.values.songName}
                                    onChange={formEdit.handleChange}
                                    id="songName"
                                    label="Song Name"
                                    name="songName"
                                    autoComplete="songName"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    value={formEdit.values.description}
                                    onChange={formEdit.handleChange}
                                    id="description"
                                    label="Description"
                                    name="description"
                                    autoComplete="description"
                                    autoFocus
                                />

                                <AutocompleteTextField
                                    datalist={singers}
                                    setValue={formEdit.setFieldValue}
                                    inputText={"Singer:"}
                                    formField={"singers"}
                                    defaultValues={song.singers}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                />
                                <AutocompleteTextField
                                    datalist={composers}
                                    setValue={formEdit.setFieldValue}
                                    inputText={"Composers:"}
                                    formField={"composers"}
                                    defaultValues={song.composers}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                />
                                <AutocompleteTextField
                                    datalist={tags}
                                    setValue={formEdit.setFieldValue}
                                    inputText={"Tags:"}
                                    formField={"tags"}
                                    defaultValues={song.tags}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
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
                        </>
                    ) : (
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                Loading...
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>
        </>
    );
};
export default UserEditSong;
