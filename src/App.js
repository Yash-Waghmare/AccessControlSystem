import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AccessControlContract from "./contracts/AccessControl.json";

function AccessControlApp() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function initWeb3() {
      const web = new Web3(window.ethereum);
      await window.ethereum.enable();
      setWeb3(web);
      console.log(web);
      const account = await web.eth.getAccounts();
      setAccounts(account);
      const networkId = await web.eth.net.getId();
      const deployedNetwork = AccessControlContract.networks[networkId];
      const contract1 = new web.eth.Contract(
        AccessControlContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contract1);
    }
    initWeb3();
  }, []);

  async function handleAddUser() {
    setIsLoading(true);
    setIsError(false);
    try {
      await contract.methods
        .addUser(userAddress, role)
        .send({ from: accounts[0] });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setIsError(true);
    }
  }

  async function handleRemoveUser() {
    setIsLoading(true);
    setIsError(false);
    try {
      await contract.methods
        .removeUser(userAddress)
        .send({ from: accounts[0] });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setIsError(true);
    }
  }

  return (
    <div>
      <h1>Access Control App</h1>
      <p>Connected to {web3 && web3.currentProvider.host}</p>
      <p>Current account: {accounts && accounts[0]}</p>
      <label>
        User address:
        <input
          type="text"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
      </label>
      <br />
      <label>
        Role:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleAddUser}>Add User</button>
      <button onClick={handleRemoveUser}>Remove User</button>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error occurred</p>}

    

    </div>
  );
}

export default AccessControlApp;
