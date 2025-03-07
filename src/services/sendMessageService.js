import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const sendMessage = async (chatId, senderId, text) => {
    try {
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        await addDoc(messagesRef, {
            senderId,
            text,
            timestamp: serverTimestamp()
        });

    } catch (error) {
        console.error("Error sending message:", error);
    }
};