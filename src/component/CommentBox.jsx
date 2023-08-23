import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
const ITEM_HEIGHT = 48;
export function TextareaComment() {
  const navigate = useNavigate()
  const [eventData, setEventData] = useState("");
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const songId = useParams().id;
  const commentsArray = eventData;
  const userLoginJSON = localStorage.getItem('userLogin');
  const userLogin = JSON.parse(userLoginJSON);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const open = Boolean(anchorEl);
  const handleClick = (event, commentId) => {
        setAnchorEl(event.currentTarget);
        setCommentId(commentId);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
  useEffect(() => {
    UserService.showCommentInSong(songId)
      .then((result) => {
        setEventData(result.data.allComment);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleComment = () => {
    if(userLogin){
      if (comment) {
        UserService.submitComment(comment, songId)
          .then(() => {
            setComment("");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }else{
       navigate('/login')
    }
  };

  const handleDeleteComment = (commentId) => {
    UserService.deleteComment(commentId)
      .then(res=>{
        
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8000/sse/comment-on-song/" + songId
    );

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if(eventData.songId===songId){
          console.log(eventData)
        setEventData(eventData.relatedComments);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <FormControl sx={{width:"75vw"}}>
      <FormLabel sx={{ color: "white", marginLeft: "10px", fontSize: "16px" }}>
        Comment here
      </FormLabel>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%"
        }}
      >
        <TextField
          placeholder="Type something here…"
          multiline
          minRows={3}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                  }}
                  onClick={handleComment}
                >
                  Send
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#bdbdbd",
                },
              },
            width: "100%",
            backgroundColor: "#000",
          }}
        />
      </Box>

      <h1 style={{ color: "white", marginLeft: "10px", fontSize: "16px" }}>
        All Comments
      </h1>
      {commentsArray &&
        commentsArray.length > 0 &&
        commentsArray.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              marginLeft: "10px",
              border: "1px solid black",
              padding: "5px",
              boxShadow: "3px 3px 5px rgba(1, 1, 1, 1)",
              marginBottom: "10px",
            }}
          >
            {comment?.user?._id.toString() === userLogin?._id?(
                        <div>
                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(event) => {
                                    handleClick(event, comment._id);
                                }}
                                style={{ float: 'right' }} // Dropdown
                            >
                                <MoreVertIcon style={{ transform: 'rotate(90deg)', color: 'white' }} />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'long-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                    },
                                }}
                            >
                                
                                <MenuItem>
                                    <button onClick={()=>{
                                            handleDeleteComment(commentId)
                                        }}>Delete</button>
                                   
                                </MenuItem>
                                 
                            </Menu>
                        </div>
                        ):(<MenuItem></MenuItem>)}
            
            <Typography
                            variant="body2"
                            style={{
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                            <img
                                src={comment?.user?.avatar}
                                alt="error"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '100%'
                                }}
                            />
                            &nbsp;{comment?.user?.lastName + " " + comment?.user?.firstName}
                        </Typography>
                        <Typography sx={{ color: "white" }}>{comment.content}</Typography>
                        <Typography sx={{ color: "white" }}>
                            {comment.uploadTime}
             </Typography>
          </Box>
        ))}
    </FormControl>
  );
}
