import { useState } from 'react';
import * as api from '../api';

export const OldLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        const token = await api.login(username, password);
        localStorage.setItem('token', token);
    };

    const onHelloClick = async () => {
        const data = await api.hello();
        alert(JSON.stringify(data));
    }
    const onViewProfileClick = async () => {
        const data = await api.viewProfile();
        alert(JSON.stringify(data));
    }

    const logout = () => {
        localStorage.removeItem('token');
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" onChange={e => setUsername(e.target.value)}/>
            <input type="text" onChange={e => setPassword(e.target.value)}/>
            <button type="submit">Login</button>

            <button type="button" onClick={onHelloClick}>Hello</button>
            <button type="button" onClick={onViewProfileClick}>Who Am I?</button>
            <button type="button" onClick={logout}>Logout</button>
        </form>
    );
};
