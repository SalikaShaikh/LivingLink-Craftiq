import React from "react";

const Settings = () => {
  return (
    <div>
      <h2>Settings</h2>
      <form className="settings-form">
        <label>Name: <input type="text" placeholder="Treasurer Name" /></label>
        <label>Email: <input type="email" placeholder="example@mail.com" /></label>
        <label>Password: <input type="password" placeholder="********" /></label>
        <button className="btn">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;
