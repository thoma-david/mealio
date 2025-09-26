import React from "react";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("worked");

    const url = "http://localhost:5000/api/token";

    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" } body: JSON.stringify({
        email: email,
        password: password,
    })})
      .then((respone) => {
        return respone.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
