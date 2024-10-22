import './index.css';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    withCredentials: true
});

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
        const input = window.prompt('Please enter your input:');
        if (input !== null) {
            setUserInput(input);
        }
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg])
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.off('connect');
            socket.off('message');
            socket.off('disconnect');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage = { message, name: userInput };
            socket.emit('message', newMessage);
            
            setMessage('');
        }
    };

    return (
        <>
        <div className='w-3/4 h-screen bg-emerald-300 p-4 rounded-lg shadow-lg flex flex-col m-auto'>
            <div className='flex-1 overflow-y-auto p-4 bg-white rounded-lg mb-4'>
                {messages.map((msg, index) => (
                    <div key={index} className='mb-2 p-2 bg-gray-100 rounded'>
                        {msg.name + ': ' + msg.message}
                    </div>
                ))}
            </div>
            <form className='flex' onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    className='flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Type your message...'
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className='p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    Send
                </button>
            </form>
        </div>
        </>
    );
}

export default App;
