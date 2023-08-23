import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import {useState, useEffect} from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import './Notification.css';
import Stack from "@mui/material/Stack";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {Link} from "react-router-dom";
import Badge from '@mui/material/Badge';
import UserService from "../services/user.service";

export default function Notification() {
    const userInfo = JSON.parse(localStorage.getItem('userLogin'));
    const userId = userInfo._id;
    const [anchorEl, setAnchorEl] = useState(null);
    const [allNotify, setAllNotify] = useState([]);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    useEffect(() => {
        const eventSource = new EventSource(
            "http://localhost:8000/sse/notifyInNavbar/" + userId
        );

        eventSource.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            setAllNotify(eventData.allNotifyOfUploader.reverse());
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);
    const NotSeenArray = allNotify.filter(notify => !notify.seen);

    return (
        <div>
            <Badge badgeContent={NotSeenArray.length} color="error">
                <NotificationsIcon onClick={handleClick}/>
            </Badge>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                className="popper-container"
            >
                {
                    allNotify.length === 0
                        ? <div className="notification-box"
                               style={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                               }}
                        >
                            <Stack
                                direction={"column"}
                                alignItems={"center"}
                            >
                                <NotificationsOffIcon
                                    sx={{
                                        fontSize: '50px'
                                    }}
                                />
                                <p
                                    style={{
                                        fontSize: '25px'
                                    }}
                                >
                                    No notice
                                </p>
                            </Stack>
                        </div>
                        : (
                            <div
                                className="notification-box"
                            >
                                {allNotify.map((notify, index) => (
                                    <Stack
                                        direction='row'
                                        alignItems='center'
                                        gap={1}
                                        className="notification"
                                        key={notify._id}
                                        style={{
                                            color: notify.seen ? "gray" : "white"
                                        }}
                                    >     
                                    <img
                                            src={notify.sourceUser.avatar}
                                            alt="Error"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        {
                                            notify.entityType === "Songs" ? (
                                                notify?.entity?._id?(
                                                <Link to={`/song/detail/${notify?.entity?._id}`} onClick={() => {
                                                    UserService.changeToSeen(notify?._id);
                                                    handleClick();
                                                }}>
                                                    <Box
                                                        style={{
                                                            overflowWrap: 'break-word'
                                                        }}
                                                    >
                                                        {`${notify?.sourceUser?.firstName} ${notify?.action} on the ${notify?.entityType} ${(notify?.entityType === "Songs") ? notify?.entity?.songName : notify?.entity?.playlistName}`}
                                                    </Box>
                                                </Link>
                                                ):(<Link>The post has deleted</Link>)
                                                
                                            ) : (
                                                notify?.entity?._id?(
                                                    <Link to={`/playlist/detail/${notify?.entity?._id}`} onClick={() => {
                                                        UserService.changeToSeen(notify?._id);
                                                        handleClick();
                                                    }}>
                                                        <Box
                                                            style={{
                                                                overflowWrap: 'break-word'
                                                            }}
                                                        >
                                                            {`${notify?.sourceUser?.firstName} ${notify?.action} on the ${notify?.entityType} ${(notify?.entityType === "Songs") ? notify?.entity?.songName : notify.entity?.playlistName}`}
                                                        </Box>
                                                    </Link>
                                                ):(<Link>The post has deleted</Link>)
                                            )
                                        }
                                    </Stack>
                                ))}
                            </div>
                        )
                }
            </Popper>
        </div>
    );
}
