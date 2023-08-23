import { useState } from "react";
import MenuAppBar from "./NavBar";
import Footer from "./Footer";
import EditInfo from "./EditInfo";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import { useOutletContext } from "react-router-dom";
const DetailUser = () => {
    const search = useOutletContext()
    const userLoginJSON = localStorage.getItem('userLogin');
    const userLogin = JSON.parse(userLoginJSON);
    const [userChange, setUserChange] = useState(null);
    console.log(userLogin);
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
            <div className="logo p-5 border-b border-solid border-gray-300 w-full flex justify-center">
                <style>
                    {`
          .custom-table {
            background-color: black;
          }

          .custom-cell {
            color: white;
          }
        `}
                </style>
                <div style={{ textAlign: 'left' }}>
                    <img src={userLogin.avatar} style={{ width: '250px', height: '250px' }} />
                </div>
                <TableContainer component={Paper} style={{ maxWidth: '500px' }}>
                    <Table className="custom-table" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="custom-cell"><h1>Your Profile</h1></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell className="custom-cell">Username</TableCell>
                                <TableCell className="custom-cell">{userLogin.username}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="custom-cell">First Name</TableCell>
                                <TableCell className="custom-cell">{userLogin.firstName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="custom-cell">Last Name</TableCell>
                                <TableCell className="custom-cell">{userLogin.lastName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="custom-cell">Role</TableCell>
                                <TableCell className="custom-cell">{userLogin.role}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="custom-cell">Phone Number</TableCell>
                                <TableCell className="custom-cell">{userLogin.phoneNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="custom-cell">Gender</TableCell>
                                <TableCell className="custom-cell">{userLogin.gender}</TableCell>
                            </TableRow>

                            {/* Add a new row for the Edit button */}
                            <TableRow>
                                <TableCell colSpan={2}>
                                    {/* Align the Edit button to the left */}
                                    <div style={{ textAlign: 'left' }}>
                                        <EditInfo reload={setUserChange} />
                                    </div>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Footer />
        </div>
    );
};

export default DetailUser;