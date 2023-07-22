import axios, {toFormData} from 'axios';

export const login = async (username, password) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/token`, {username, password});
    return res.data.access;
}

export const register = async (username, password, retype_password,
                               first_name, last_name, email, country, birth_date) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        username,
        password,
        retype_password,
        first_name,
        last_name,
        email,
        country,
        birth_date
    });
}
export const updateGrade = async (
    grade) =>{
    await axios.post(
        `${process.env.REACT_APP_API_URL}/grade`,
        {grade}
    );
}

export const statistic = async () => {
    const token = localStorage.getItem('token');

    if (!token || token === '') {
        // Token je prazan
        // Možete vratiti null, throwati grešku ili izvršiti odgovarajuće radnje
        return null;
    }
    else {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/statistic`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return res.data;
    }
}
export const updateProfile = async (
    username,
    password,
    new_password,
    retype_new_password,
    first_name,
    last_name,
    email,
    country,
    birth_date,
    imageFile
) => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('new_password', new_password);
    formData.append('retype_new_password', retype_new_password);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('country', country);
    formData.append('birth_date', birth_date);
    formData.append('image', imageFile);

    await axios.post(
        `${process.env.REACT_APP_API_URL}/update_profile`,
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
            },
        }
    );
};

export const updateProfileStats = async (
    winnerUsername,
    loserUsername
) =>{
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('winnerUsername', winnerUsername)
    formData.append('loserUsername', loserUsername)

    await axios.post(
        `${process.env.REACT_APP_API_URL}/update_profile_stats`,
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );
}
export const updateProfileRating = async (
    playerToBeRated,
    grade
) =>{
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('playerToBeRated', playerToBeRated)
    formData.append('grade', grade)

    await axios.post(
        `${process.env.REACT_APP_API_URL}/update_profile_rating`,
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );
}







export const getProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token || token === '') {

        return null;
    } else {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.data;
    }
}

export const hello = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/hello`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
}
export const viewProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token || token === '') {
        // Token je prazan
        // Možete vratiti null, throwati grešku ili izvršiti odgovarajuće radnje
        return null;
    }
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/view_profile`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return res.data;
}

export const sendChatMessage = async (room, message) =>{
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('room', room)
    formData.append('message', message)

    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/send_message`,
        formData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    return res.data;
}

export const sendGameState = async (room, state) => {
    const token = localStorage.getItem('token');

  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send_game_state`,
        {
            room: room,
            gameState: JSON.stringify(state)
          },
                  {
          headers: {
            'Authorization': `Bearer ${token}`,
            
          }
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };


  export const sendGameSettings = async (room, state) => {
    const token = localStorage.getItem('token');

  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send_game_settings`,
        {
            room: room,
            gameSettings: JSON.stringify(state)
          },
                  {
          headers: {
            'Authorization': `Bearer ${token}`,
            
          }
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };

  export const getConnectedUserCount = async (room) => {
    const token = localStorage.getItem('token');

  
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get_conected_user_count`,
        {
            params: {
          room: room,
            
          },
                  
          headers: {
            'Authorization': `Bearer ${token}`,
            
          }
        }
      );
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };
  

  export const sendEndGame = async (room, payload) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/end_game`,
        {
          room: room,
          payload: JSON.stringify(payload)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
// export const getChatMessages = async (room) =>{
//     const token = localStorage.getItem('token');
//     const formData = new FormData();
//     formData.append('room', 'soba')
//     const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_messages`, {
//         data:{
//             'room': room,
//         }
//     });
//     return res.data;
// }
export const getChatMessages = async (room) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_messages`, {
            params: {
                room: room,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getUsername = async (room) => {
const token = localStorage.getItem('token');
try {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_username`, {
      params: {
          room: room,
      },
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
  return await res.data;
} catch (error) {
  throw error;
}

}


