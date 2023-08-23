import {NavLink} from "react-router-dom";
import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import UploadIcon from '@mui/icons-material/Upload';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function SideBarMenu() {
    const userLoginJSON = localStorage.getItem('userLogin');
    const userLogin = JSON.parse(userLoginJSON);
    return (
        <>
            <NavLink to="/" className={({isActive}) =>
                isActive ? "navLinksClick" : "navLinks"
            }>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <HomeIcon/>
                    &emsp;Home
                </div>
            </NavLink>
            {userLogin ? (
                <div>
                    <NavLink to="/playlists" className={({isActive}) =>
                        isActive ? "navLinksClick" : "navLinks"
                    }>
                        <div
                            style={{
                                display: 'flex',
                            }}
                        >
                            <QueueMusicIcon/>
                            &emsp;Your Playlists
                        </div>
                    </NavLink>
                    <NavLink to="/songs-uploaded" className={({isActive}) =>
                        isActive ? "navLinksClick" : "navLinks"
                    }>
                        <div
                            style={{
                                display: 'flex',
                            }}
                        >
                            <UploadIcon/>
                            &emsp;Songs Uploaded
                        </div>
                    </NavLink>
                    {userLogin.role === "admin" ? (
                        <NavLink to="/users-manager" className={({isActive}) =>
                            isActive ? "navLinksClick" : "navLinks"
                        }>
                            <div
                                style={{
                                    display: 'flex',
                                }}
                            >
                                <DashboardIcon/>
                                &emsp;Admin Dashboard
                            </div>
                        </NavLink>
                    ) : (<></>)}
                </div>
            ) : (<div></div>)}
        </>
    )
}