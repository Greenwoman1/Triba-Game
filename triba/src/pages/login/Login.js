import {useState} from "react";
import * as api from '../../api';
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import './Login.css';
export const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        const token = await api.login(username, password);
        localStorage.setItem('token', token);
        navigate("/");
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="container windowLogin">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header title">Login</div>
                            <div className="card-body">
                                <form className="form-horizontal" onSubmit={onSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="username" className="cols-sm-2 control-label">Username:</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-user fa"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="text" className="form-control textField" name="username"
                                                       id="username"
                                                       placeholder="Enter your Username"
                                                       onChange={e => setUsername(e.target.value)} required/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="cols-sm-2 control-label">Password:</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-envelope fa"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="password" className="form-control textField" name="password"
                                                       id="password"
                                                       placeholder="Enter your password"
                                                       onChange={e => setPassword(e.target.value)} required
                                                       minLength='6'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group ">
                                        <button type="submit"
                                                className="btn btn-primary btn-lg btn-block login-button loginButton">Login
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}