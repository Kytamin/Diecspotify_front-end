import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Add } from "@mui/icons-material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import storage from "../config/firebase.config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import UserService from "../services/user.service";

const style = {
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
};
const imageInputLabelStyle = {
  display: "inline-block",
  width: "20%",
  textAlign: "left",
  marginBottom: "5px",
};

const imageInputStyle = {
  marginLeft: "10px",
  maxWidth: "70%",
  marginBottom: "5px",
};

const fileInputLabelStyle = {
  display: "inline-block",
  width: "20%",
  textAlign: "left",
};

const fileInputStyle = {
  marginLeft: "10px",
  maxWidth: "70%",
};

export default function EditSong({ reload }) {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const [imageSrc, setImageSrc] = useState("");

  const [haveFile, setHaveFile] = useState(false);
  const [haveImage, setHaveImage] = useState(false);

  const [showError, setShowError] = useState("");

  const handleOpen = () => {
    setShowError("");
    setOpen(true);
  };
  const handleClose = () => {
    setImageSrc("");
    setOpen(false);
  };
  const handleFileInput = (e) => setFile(e.target.files[0]);
  const handleImageInput = (e) => {
    setImage(e.target.files[0]);
    setImageSrc(URL.createObjectURL(e.target.files[0]));
  };
  const resetFormFileAndImage = () => {
    setFile(null);
    setImage(null);
    setHaveFile(false);
    setHaveImage(false);
  };

  const handleUploadFile = () => {
    return new Promise((resolve, reject) => {
      const imgRef = ref(storage, `/images/${image.name}`);
      const imageTask = uploadBytesResumable(imgRef, image);
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
              setImage(avatarFirebase);
              setHaveImage(true);
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
      uploader: "64ca21378646dc995d7f7683",
      isPublic: false,
    },
    onSubmit: (values) => {
      try {
        if (!file || !image) {
          return setShowError("Avatar/File is required");
        }
        if (formAdd.values.songName === "") {
          return setShowError("SongName is requried");
        }
        setShowError("Submitting...");
        handleUploadFile();
      } catch (e) {
        console.log(e);
      }
    },
  });
  useEffect(() => {
    if (haveFile && haveImage) {
      let data = {
        ...formAdd.values,
        fileURL: file,
        avatar: image,
      };
      UserService.addSong(data)
        .then((res) => {
          resetFormFileAndImage();
          formAdd.resetForm();
          handleClose();
          reload(data);
        })
        .catch((err) => setShowError(err.response.data.message));
    }
  }, [haveFile, haveImage]);
  return (
    <>
      <Button
        sx={{
          backgroundColor: "green",
          color: "white",
          margin: "10px",
          "&:hover": {
            backgroundColor: "grey",
            color: "white",
          },
        }}
        onClick={handleOpen}
      >
        <Add />
      </Button>
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
          <div
            style={{
              position: "absolute",
              width: "50%",
              height: "100%",
              top: 0,
              left: 0,
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
          <div
            style={{
              position: "relative",
              width: "50%",
              marginLeft: "50%"
            }}
          >
            <h1
              style={
                showError === "" || showError === "Submitting..."
                  ? { color: "black" }
                  : { color: "red" }
              }
            >
              {showError === "" ? "Add a new song" : showError}
            </h1>
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
              required
              fullWidth
              value={formAdd.values.description}
              onChange={formAdd.handleChange}
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              autoFocus
            />
            <div>
              <label htmlFor="avatar" style={imageInputLabelStyle}>
                Avatar:
              </label>
              <input
                id="avatar"
                type="file"
                onChange={handleImageInput}
                style={imageInputStyle}
              />
              <label htmlFor="song" style={fileInputLabelStyle}>
                Song:
              </label>
              <input
                id="song"
                type="file"
                onChange={handleFileInput}
                style={fileInputStyle}
              />
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "green" }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
