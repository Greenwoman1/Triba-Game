import React from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import * as api from "../../api";
import { Login } from "../../pages/login/Login";
import { Register } from "../../pages/register/Register";
import { Profile } from "../../pages/profile/Profile";
import Home from "../home/Home";
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ resetGame, gameStarted }) => {
  const isLogged = localStorage.getItem("token") != null;
  const navigate = useNavigate();

  const logout = () => {
    alert("Odjavili ste se");
    localStorage.removeItem("token");
    navigate("/");

    if(gameStarted){ resetGame();}
  };

  const onViewProfileClick = async () => {
    const data = await api.viewProfile();
    alert(JSON.stringify(data));
  };

  return (
    <div className="navbar nav-wrapper">
      <div className="navButtons">
        <Link className="link" to="/">
          <button className="buttonNavbar" onClick={resetGame}>
            <h2>MAIN MENU</h2>
          </button>
        </Link>
        {!isLogged &&
        <Link className="link" to="/login">
          <button className="buttonNavbar" onClick={resetGame}>
            <h2>LOGIN</h2>
          </button>
        </Link>
        }
        {!isLogged &&
        <Link className="link" to="/register">
          <button className="buttonNavbar" onClick={resetGame}>
            <h2>REGISTER</h2>
          </button>
        </Link>
        }
        {isLogged &&
        <Link className="link" to="/profile">
          <button className="buttonNavbar" onClick={resetGame}>
            <h2>VIEW PROFILE</h2>
          </button>
        </Link>
        }
        {isLogged &&
        <Link className="link" to="/">
          <button className="buttonNavbar" onClick={logout}>
            <h2>LOGOUT</h2>
          </button>
        </Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
