import {useState} from "react";
import * as api from '../../api';
import {CountryList} from "../../components/countryList/CountryList";
import {Route, useNavigate} from "react-router-dom";
import {Login} from "../login/Login";
import Navbar from "../../components/navbar/Navbar";
import './Register.css';

export const Register = () =>{
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleSelectCountry = (value) =>{
        setCountry(value);
    }
    const onSubmit = async (e) =>{
        e.preventDefault();
        const register = await api.register(username, password, retypePassword,
            firstName, lastName, email, country, birthDate);
        navigate("/");
    }

    return(
        <div>
            <Navbar></Navbar>
        <form className="form-horizontal" onSubmit={onSubmit}>
        <div className="windowWrapper">
            <div className="card-header title">Register</div>
        <div className="container window">
            <div className="section" >
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">


                                <div className="form-group">
                                    <label htmlFor="username" className="cols-sm-2 control-label">Username: *</label>
                                    <div className="cols-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-user fa"
                                                                                   aria-hidden="true"></i></span>
                                            <input  type="text" className="textField form-control" name="username" id="username"
                                                   placeholder="Enter your Username" onChange={e => setUsername(e.target.value)} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="cols-sm-2 control-label">Password: *</label>
                                    <div className="cols-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-envelope fa"
                                                                                   aria-hidden="true"></i></span>
                                            <input  type="password" className="textField form-control" name="password" id="password"
                                                   placeholder="Enter your password" onChange={e => setPassword(e.target.value)} required minLength='6'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="retype_password" className="cols-sm-2 control-label">Confirm password: *</label>
                                    <div className="cols-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-envelope fa"
                                                                                   aria-hidden="true"></i></span>
                                            <input  type="password" className="textField form-control" name="retype_password" id="retype_password"
                                                   placeholder="Retype your password" onChange={e => setRetypePassword(e.target.value)} required minLength='6'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="first_name" className="cols-sm-2 control-label">First Name:</label>
                                    <div className="cols-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-users fa"
                                                                                   aria-hidden="true"></i></span>
                                            <input  type="text" className="textField form-control" name="first_name" id="first_name"
                                                   placeholder="Enter your First Name" onChange={e => setFirstName(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="section" >
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="last_name" className="cols-sm-2 control-label">Last Name:</label>
                                    <div className="cols-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                            <input  type="text" className="textField form-control" name="last_name"
                                                   id="last_name" placeholder="Enter your Last Name" onChange={e => setLastName(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="cols-sm-2 control-label">Email: *</label>
                                    <div className="cols-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                            <input  type="email" className="textField form-control" name="email"
                                                   id="email" placeholder="Enter your e-mail" onChange={e => setEmail(e.target.value)} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <CountryList onSelectChange={handleSelectCountry} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date_of_birth" className="cols-sm-2 control-label">Date of Birth:</label>
                                    <div className="cols-sm-10">
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                            <input  type="date" className="textField form-control" name="date_of_birth"
                                                   id="date_of_birth" placeholder="Enter your Date of Birth" onChange={e => setBirthDate(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                                
                        </div>

                    </div>
                </div>
            </div>
           
        </div>
        <div className="form-group ">
            <button type="submit"
                    className="btn btn-primary btn-lg btn-block login-button registerButton">Register
            </button>
        </div>
        <div className="login-register"></div>
    </div>

    </form>
    </div>
    );
}