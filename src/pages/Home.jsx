import React from 'react'
import MusicPlayBar from '../component/MusicPlayBar'
import SideBar from '../component/SideBar'
import {useState} from 'react'
import {Outlet} from "react-router-dom";
export default function Home() {
    const [search, setSearch] = useState("")
    const handleChange = (a) => {
        setSearch(a)
    }
    return (
        <div style={{height: "100%", background: "#1a1a1a"}}>
            <SideBar handleChange={handleChange}/>
            <Outlet context={search}/>
            <MusicPlayBar/>
        </div>
    )
}
