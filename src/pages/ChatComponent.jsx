import { useEffect, useState } from "react";
import { sendMessage } from "../services/sendMessageService";
import { getMessages } from "../services/ChatService";
import { auth } from "../firebase";

const ChatComponent = ({ chatId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const unsubscribe = getMessages(chatId, setMessages);
        return () => unsubscribe();
    }, [chatId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        await sendMessage(chatId, auth.currentUser.uid, receiverId, newMessage);
        setNewMessage("");
    };

    return (
        <div>
            <h1>Chat Component</h1>
            <div>
                {messages.map((msg) => (
                    <p key={msg.id} style={{ textAlign: msg.senderId === auth.currentUser.uid ? "right" : "left" }}>
                        {msg.text}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default ChatComponent;