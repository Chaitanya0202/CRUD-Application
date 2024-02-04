import React, { useState, useEffect } from "react";

import { useGlobelContext } from "./Context/UserContext";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrudFile = () => {
  const {
    formData,
    setFormData,
    showData,
    deleteData,
    saveData,
    peopleList,
    isOnline,
    setIsOnline,
    setPeopleList,
    BASE_URL,
  } = useGlobelContext();

  useEffect(() => {
    showData(); // Call showData when the component mounts
  }, []);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  const dataStoreDB = async (index) => {
    const localData = JSON.parse(localStorage.getItem("peopleList")) || [];

    if (index >= 0 && index < localData.length) {
      const selectedData = localData[index];
      try {
        await axios.post(`${BASE_URL}saveUser`, selectedData);
        deleteData(index);
        toast("Your Data Saved");
        
      } catch (error) {
        toast("We haven't deployed the backend yet. Try it after disconnecting your internet...");
        
      }
      
      console.log("Data to be sent to the database:", selectedData);
    } else {
      console.log("Invalid index or no data found at the specified index.");
    }
  };

  return (
    <div className="container">
      <h2>Crud Application</h2>

      <div>
        {isOnline ? (
          <p>You are currently online.</p>
        ) : (
          <p>
            You are currently offline. Please check your internet connection.
          </p>
        )}
      </div>
      <div class="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
            <div className="form-floating mt-3">
              <input
                type="text"
                name="name"
                className="form-control"
                id="name"
                placeholder="Enter Name :"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <label htmlFor="name">Name</label>
            </div>

            <div className="form-floating mt-3">
              <input
                type="text"
                name="email"
                className="form-control"
                id="email"
                placeholder="Enter Email :"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <label htmlFor="email">Email </label>
            </div>
            <div className="form-floating mt-3">
              <input
                type="text"
                name="address"
                className="form-control"
                id="address"
                placeholder="Enter Address :"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <label htmlFor="address">Address </label>
            </div>
            <div className="form-floating mt-3">
            <input
            type="text"
            name="phone"
            className="form-control"
                id="phone"
                placeholder="Enter Phone No :"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                />
                <label htmlFor="phone">Phone No </label>
                </div>
            <div className="form-floating mt-3">
            <input
            type="text"
            name="password"
            className="form-control"
                id="password"
                placeholder="Enter Password :"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                />
                <label htmlFor="password">Password </label>
            </div>
          </div>
          <div className="col-lg-12 mt-5">
            <button
              className="btn btn-success"
              id="submit"
              onClick={saveData}
              style={{ margin: "10px" }}
            >
              Save
            </button>
          </div>
        </div>

        <hr />

        <table className="table table-bordered" id="crudTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone No</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {peopleList.map((person, index) => (
              <tr key={index}>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.address}</td>
                <td>{person.phone}</td>
                <td>{person.password}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteData(index)}
                  >
                    Delete
                  </button>
                  
                  {isOnline && (
                    <button
                      className="btn btn-outline-success"
                      onClick={() => dataStoreDB(index)}
                    >
                      Sync
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CrudFile;
