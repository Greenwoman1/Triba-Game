import {useEffect, useState} from "react";
import * as api from '../../api';
import {CountryList} from "../../components/countryList/CountryList";
import {Link, useNavigate} from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import './Profile.css';
export const Profile = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypeNewPassword, setRetypeNewPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePath, setImagePath] = useState('');
    const [logged, setLogged] = useState(false);
    const [gamesWon, setGamesWon] = useState(0);
    const [gamesLost, setGamesLost] = useState(0);
    const [totalGrades, setTotalGrades] = useState(0);
    const [timesGraded, setTimesGraded] = useState(0);

    const handleSelectCountry = (value) => {
        setCountry(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();

        const updateProfile = await api.updateProfile(username, password, newPassword, retypeNewPassword,
            firstName, lastName, email, country, birthDate, imageFile);
    }
    const fetchUserData = async (e) => {
        const response = await api.getProfile();
        if (response != null) {
            setLogged(true);
            setUsername(response.username)
            setPassword(response.password)
            setFirstName(response.first_name)
            setLastName(response.last_name)
            setEmail(response.email)
            setCountry(response.country)
            setBirthDate(response.birth_date)
            setGamesWon(response.games_won)
            setGamesLost(response.games_lost)
            setTotalGrades(response.total_grades)
            setTimesGraded(response.times_graded)
            setImagePath(`${process.env.REACT_APP_BASE_URL}${response.image_path}`)
        }
        else navigate("/");

    }
    useEffect(() => {
        (async () => {
            await fetchUserData();
        })();
    }, [])
    return (
        <div >
            <Navbar></Navbar>
            <form className="form-horizontal" onSubmit={onSubmit}>
            <div className="container windowWrapper" >
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header title">Profile</div>
                            <div className="card-body window">
                            <div className="section">
                            <div className="form-group">
                                        <label htmlFor="username" className="cols-sm-2 control-label">Username:
                                            *</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-user fa"
                                                                                   aria-hidden="true"></i></span>
                                                <input type="text"  className="form-control textField" name="username"
                                                       id="username"
                                                       placeholder="Enter your Username" value={username}
                                                       onChange={e => setUsername(e.target.value)} required/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="cols-sm-2 control-label">Type your old
                                            password: </label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-envelope fa"
                                                                                   aria-hidden="true"></i></span>
                                                <input type="password"  className="form-control textField" name="password"
                                                       id="password"
                                                       placeholder="Enter your password"
                                                       onChange={e => setPassword(e.target.value)} required
                                                       minLength='6'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="new_password" className="cols-sm-2 control-label">Type your new
                                            password:</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-envelope fa"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="password" className="form-control textField" name="new_password"
                                                       id="new_password"
                                                       placeholder="Enter your password"
                                                       onChange={e => setNewPassword(e.target.value)} required
                                                       minLength='6'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="retype_new_password" className="cols-sm-2 control-label">Confirm
                                            your new password:</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-envelope fa"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="password" className="form-control textField"
                                                       name="retype_new_password"
                                                       id="retype_new_password"
                                                       placeholder="Enter your password"
                                                       onChange={e => setRetypeNewPassword(e.target.value)} required
                                                       minLength='6'/>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="section">
                            <div className="form-group">
                                        <label htmlFor="first_name" className="cols-sm-2 control-label">First
                                            Name:</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-users fa"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="text" className="form-control textField" name="first_name"
                                                       id="first_name"
                                                       placeholder="Enter your First Name"
                                                       onChange={e => setFirstName(e.target.value)} value={firstName}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last_name" className="cols-sm-2 control-label">Last
                                            Name:</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="text" className="form-control textField" name="last_name"
                                                       id="last_name" placeholder="Enter your Last Name"
                                                       onChange={e => setLastName(e.target.value)} value={lastName}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="cols-sm-2 control-label">Email: *</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="email" className="form-control textField" name="email"
                                                       id="email" placeholder="Enter your e-mail"
                                                       onChange={e => setEmail(e.target.value)} required value={email}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <CountryList onSelectChange={handleSelectCountry}/>
                                    </div>
                            </div>
                            <div className="section">
                            <div className="form-group">
                                        <label htmlFor="date_of_birth" className="cols-sm-2 control-label">Date of
                                            Birth:</label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="date" className="form-control textField" name="date_of_birth"
                                                       id="date_of_birth" placeholder="Enter your Date of Birth"
                                                       onChange={e => setBirthDate(e.target.value)} value={birthDate}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="games_won" className="cols-sm-2 control-label">Games
                                            won: </label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="text" className="form-control textField" name="games_won"
                                                       id="games_won" placeholder=""
                                                       value={gamesWon} readOnly/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="games_won" className="cols-sm-2 control-label">Games
                                            lost: </label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                                <input  type="text" className="form-control textField" name="games_lost"
                                                       id="games_lost" placeholder=""
                                                       value={gamesLost} readOnly/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="games_won" className="cols-sm-2 control-label">Average
                                            grade: </label>
                                        <div className="cols-sm-10">
                                            <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-lock fa-lg"
                                                                                   aria-hidden="true"></i></span>
                                                <input t type="text" className="form-control textField" name="avg_grade"
                                                       id="avg_grade" placeholder=""
                                                       value={(timesGraded != 0)? (totalGrades/timesGraded) : 0} readOnly/>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="section">
                                <label htmlFor="image" className="updateButton">Profile Image</label>
                                    <input className="imageInput"
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files[0])}
                                    />
                                <div className="imageWrapper">
                                    <img className="profileImage" src={imagePath} alt="Profile Image"/>  
                                </div>
                            </div>   
                            </div>
                        </div>
                    </div>
                </div>   
                <div className="form-group ">
                    <button type="submit"
                            className="updateButton btn btn-primary btn-lg btn-block login-button">Update
                    </button>
                </div>
                <div className="login-register"></div>
                </div>
                
            </form>
        </div>
    )


}