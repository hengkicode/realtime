"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://192.168.3.80:3001";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      // Menambahkan event listener untuk menerima history pesan saat login
      socket.on("chat history", (history) => {
        setMessages(history);
      });
    }
  }, [isLoggedIn]); // Menambahkan dependency isLoggedIn agar useEffect dijalankan setelah status login berubah

  const handleLogin = () => {
    if (username.trim() !== "") {
      setIsLoggedIn(true);
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      newSocket.on("chat", ({ username, message }) => {
        setMessages((prevMessages) => [...prevMessages, { username, message }]);
      });

      newSocket.emit("login", username);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== "") {  
      socket.emit("chat", { username, message: input });
      setInput("");
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-pink-500">
        <div className="bg-blue-500 p-8 rounded-lg">
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full mb-4 px-4 py-2 rounded"
            value={username}
            onChange={handleUsernameChange}
          />
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-between bg-gradient-to-r from-fuchsia-500 to-pink-500">
      <div className="p-4">
        {messages.map((message, index) => (
          <p key={index} className="mb-2">
            <strong className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {message.username}:{" "}
            </strong>
            <span className="text-white">{message.message}</span>
          </p>
        ))}
      </div>
      <div className="p-4">
        <textarea
          className="w-full mb-4 px-4 py-2 rounded"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type your message here..."
          rows="3"
        />

        <button
          className="text-white px-4 py-2 rounded hover:bg-blue-600 bg-gradient-to-r from-blue-600 to-violet-600"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
