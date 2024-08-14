<template>
    <div class="chat-container">
        <div class="chat-messages">
            <div v-for="(message, index) in chatHistory" :key="index" :class="['message', message.sender]">
                <p>{{ message.content }}</p>
            </div>
        </div>
        <form @submit.prevent="handleSendMessage" class="chat-input">
            <input v-model="userMessage" type="text" placeholder="Write your message..." required />
            <button type="submit" class="send-button">
                <img src="../assets/send-alt.svg" class="icon" alt="Icon" />
            </button>
        </form>

    </div>
</template>

<script>
import { sendMessageToChatGPT } from '../services/chatgptService';
export default {
    data() {
        return {
            userMessage: '',
            chatHistory: [], // Keeps track of all messages
        };
    },
    components: {
    },
    methods: {
        async handleSendMessage() {
            if (!this.userMessage.trim()) return;

            // Add user's message to chat history
            const userMessage = { sender: 'user', content: this.userMessage };
            this.chatHistory.push(userMessage);

            // Clear input field
            this.userMessage = '';

            try {
                // Add loading message
                const loadingMessage = { sender: 'bot', content: '...' };
                this.chatHistory.push(loadingMessage);

                // Send message to ChatGPT
                const response = await sendMessageToChatGPT([
                    { role: 'user', content: userMessage.content },
                ]);

                // Remove loading message and add bot's response
                this.chatHistory.pop();
                this.chatHistory.push({ sender: 'bot', content: response });
            } catch (error) {
                // Handle error and show in the chat
                this.chatHistory.push({ sender: 'bot', content: 'Error fetching response.' });
            }
        },
    },
};
</script>

<style>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 80vh;
    width: 720px;
    max-width: 1080px;
    margin: auto;
    background: #e5e5ff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 15px;
    max-width: 70%;
    word-wrap: break-word;
}

.message.user {
    align-self: flex-end;
    background: #5457c1;
    color: #fff;
    border-bottom-right-radius: 0;
}

.message.bot {
    align-self: flex-start;
    background: #fff;
    color: #000;
    border-bottom-left-radius: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: left;
}

.chat-input {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 25px;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.chat-input input {
    background: #fff;
    color: #000;
    border: none;
    flex-grow: 1;
    padding: 0px 10px 0 10px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
    border-radius: 30%;
}

.chat-input input:focus {
    border-color: #007bff;
}

.send-button {
    padding: 5px;
    border: none;
    background: #5457c1;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
}

.icon {
    max-height: 20px;
    /* width: 30px; */
}

.message p {
    margin: 0;
}
</style>