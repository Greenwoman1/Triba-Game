import React, {useEffect, useState} from 'react';
import * as api from '../../api';
import {Message} from '../../components/message/Message';
import "./chat.css"


const Chat = ({
                  sendMessageToParent,
                  chatMessage,
                  socket,
                  chatRoomParent,
                  tableDataParent,
                  fetchChatMessages,
                  sendMessage
              }) => {
    function convertDateBA(djangoTimeStamp) {
        var dateObj = new Date(djangoTimeStamp);

        var day = dateObj.getDate();
        var month = dateObj.getMonth() + 1; // Months are zero-based, so we add 1
        var year = dateObj.getFullYear();

        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
    }

    const [isConnected, setIsConnected] = useState(socket.connected);

    const [chatRoom, setChatRoom] = useState(chatRoomParent);
    const [chatMessages, setChatMessage] = useState("");
    const [profile, setProfile] = useState(null);

    const [tableDatas, setTableData] = useState(tableDataParent);
    useEffect(() => {
        setTableData(tableDataParent)
    }, [tableDataParent])
    useEffect(() => {
        sendMessageToParent(chatMessages)
    }, [chatMessages])

    useEffect(() => {
        (async () => {
            const profile = await api.getProfile();
            setProfile(profile);
        })()
    }, []);

    return (
        <div className="chat">

            {chatRoom && (<div className="chatBoxBottom">
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        <form onSubmit={sendMessage}>
                            <div style={{display:'flex', gap:'3px'}}>
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(event) => setChatMessage(event.target.value)}
                                placeholder="Enter your message..."
                                className="chatInput"
                            />
                            <button type="submit" className="chatButton">Send</button>
                            </div>
                        </form>
                        <div className="chat-table-container">
                            <table>
                                <tbody>
                                {tableDatas.map((row) => (
                                    <tr key={row.id} className="table-row-chat">
                                        <div className="chatBoxTop">
                                            <Message profile={profile}
                                                     sender={row.sender_username}
                                                     content={row.content}
                                                     timestamp={convertDateBA(row.timestamp)}></Message>
                                        </div>

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default Chat