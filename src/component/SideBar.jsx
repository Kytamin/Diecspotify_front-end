import React from "react";
import logo from "../images/logo.png";
import "./component.css";
import { Link, NavLink } from "react-router-dom";
import SideBarMenu from "./SideBarMenu";

export default function SideBar({ handleChange }) {
  return (
    <div
      style={{
        width: "19.5%",
        background: "black",
        height: "560px",
        padding: "20px 20px 0px 20px",
        baxSizing: "border-box",
        position: "fixed",
        borderRadius: "10px",
        marginTop: "0px",
      }}
    >
      <div className="logoDiv">
        <img src={logo} alt="logo" />
        <h1 className="text-3xl font-bold">
          <Link to={"/"}>
            DieC<span style={{ color: "#1DB954" }}>Team</span>
          </Link>
        </h1>
      </div>
      <div className="linkDiv">
        <input
          className="w-70 h-10 rounded-md border border-gray-400 px-4 bg-black text-white "
          type="text"
          placeholder="Search Songs"
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          style={{ width: "100%" }}
        />
        <br />
        <SideBarMenu />
      </div>
    </div>
  );
}
