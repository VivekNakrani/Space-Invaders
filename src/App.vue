<script setup>
import main from './main';

  const login = async () => {
    const provider = main.provider;
    const passportInstance = main.passportInstance;
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    const accessToken = await passportInstance.getAccessToken();
    const idToken = await passportInstance.getIdToken();
    document.getElementById("idRaw").innerHTML = idToken;
    document.getElementById("accessRaw").innerHTML = accessToken;
    const dAccess = await main.validateJWT(accessToken)
    const dId = await main.validateJWT(idToken)
    document.getElementById('idToken').innerHTML = JSON.stringify(dId, null, 2);
    document.getElementById('accessToken').innerHTML = JSON.stringify(dAccess, null, 2);
    checkBalance();
  }

  const logout = () => {
    const passportInstance = main.passportInstance;
    passportInstance.logout();
  };

  const checkBalance = async () => {
    console.log('checking...')
    document.getElementById('checkB').innerHTML = 'Refreshing...'
    
    const provider = main.provider;
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    
    const hexBalance = await provider.request({
      method: 'eth_getBalance',
      params: [
        accounts[0],
        'latest'
      ]
    })

    const decimalBalance = parseInt(hexBalance, 16);
    const weiToEther = Math.pow(10, 18);
    const balance = (decimalBalance / weiToEther).toFixed(4);
    document.getElementById('balance').innerHTML = 'Balance <br>' + balance + ' tIMX';
    document.getElementById('checkB').innerHTML = 'Refresh'
  }

  const transact = async () => {
    const receiver = document.getElementById('add').value;
    const value = document.getElementById('amount').value;
    
    if(!receiver) return alert('Input the reciever\'s address');
    if(!value) return alert('Input the amount');
    if(value < 0) return alert('Value can not be negative');
    
    document.getElementById('sendBtn').innerHTML = 'Sending...'
    
    const weiToEther = Math.pow(10, 18);
    const wei = value * weiToEther;
    const hexString = wei.toString(16);
    
    const provider = main.provider;
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    
    try {
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            to: receiver,
            value: '0x' + hexString
          }
        ]
      });
      alert("Transaction Successful! \nTransaction hash: " + transactionHash)
      console.log(transactionHash)
    } catch (e){
      alert(e)
    } finally {
      document.getElementById('sendBtn').innerHTML = 'Send tIMX'
      document.getElementById('add').value = "";
      document.getElementById('amount').value = "";
      checkBalance();
    }
  }
    window.onload = async function (){
    const passportInstance = main.passportInstance;
    let userObj = await passportInstance.getUserInfo();
    if(userObj){
      document.getElementById('nickname').innerHTML = `Nickname: ${userObj.nickname}`;
      document.getElementById('email').innerHTML = `Email: ${userObj.email}`;
      const accessToken = await passportInstance.getAccessToken();
      const idToken = await passportInstance.getIdToken();
      document.getElementById("idRaw").innerHTML = idToken;
      document.getElementById("accessRaw").innerHTML = accessToken;
      const dAccess = await main.validateJWT(accessToken)
      const dId = await main.validateJWT(idToken)
      checkBalance()
      document.getElementById('idToken').innerHTML = JSON.stringify(dId, null, 2);
      document.getElementById('accessToken').innerHTML = JSON.stringify(dAccess, null, 2);
      document.getElementById('loggedIn').style.visibility = "visible";
      document.getElementById('loggedOut').style.visibility = "hidden";
    } else {
      document.getElementById('loggedOut').style.visibility = "visible";
      document.getElementById('loggedIn').style.visibility = "hidden";
    }
  }
</script>

<template>
  <main class="w-full min-h-screen bg-teal-600">
    <div id="loggedOut" style="visibility: hidden; display: block">
      <h1 style = "position: absolute; color: white; font-size: 54px; width: 100vw; text-align: center; font-weight: bold">Integrate Immutable Passport</h1>
        <button @click="login" class="rounded-md bg-teal-800 px-4 py-2 text-teal-100 hover:bg-teal-900 shadow-lg border-b-4 border-b-teal-900" style = "position: absolute; top: 50%; left: calc(50% - 100px); width: 200px">
          Login
        </button>
    </div>
    <div id="loggedIn" style="visibility: hidden; display: block">
      <div id="nickname" style = "position: absolute; top: 0; left: 0; background-color: #064741; margin: 10px; border-radius: 5px; padding: 3px 6px">
        
      </div>
      <div id="email" style = "position: absolute; top: 40px; left: 0; background-color: #064741; margin: 10px; border-radius: 5px; padding: 3px 6px">
      </div>
      <div style = "position: absolute; top: 100px; left: 0; width: 500px; margin: 10px;">
      <div style = "background-color: #115e59; width: calc(55vw + 10px); background-color: #115e59; margin: 10px; border-radius: 3px; padding: 5px">
        <b>ID-Token</b>
        <pre><div id="idRaw" style = "width: 55vw; overflow-x: auto;  background-color: #064741; padding: 3px 6px; border-radius: 5px">Getting the ID-Token...</div>
<div id="idToken" style = "width: 55vw; height: 25vh; overflow-y: auto; background-color: #064741; padding: 3px 6px; border-radius: 5px"></div></pre>
      </div>
      <div style = "background-color: #115e59; width: calc(55vw + 10px); background-color: #115e59; margin: 10px; border-radius: 3px; padding: 5px">
        <b>Access-Token</b>
        <pre><div id="accessRaw" style = "width: 55vw; overflow-x: auto;  background-color: #064741; padding: 3px 6px; border-radius: 5px">Getting the Access-Token...</div>
<div id="accessToken" style = "width: 55vw; height: 25vh; overflow-y: auto; background-color: #064741; padding: 3px 6px; border-radius: 5px"></div></pre>
      </div>
      </div>
      <div style = "top: 120px; position: absolute;  right: 110px; width: 220px; background-color: #115e59; height: 335px; border-radius: 5px">
      <div style = "background-color: #064741;  padding: 10px; border-radius: 5px; width: 200px; position: relative; display: block; margin: 10px; margin-bottom: 0;">
        <div id="balance" style="font-size: 24px; font-weight: bold; text-align: center">Getting Balance...
        </div>
        <button @click="checkBalance" id="checkB" class="rounded-md bg-teal-800 px-4 py-2 text-teal-100 hover:bg-teal-900 shadow-lg border-b-4 border-b-teal-900" style="position:relative; width: 120px; left: calc(50% - 60px)">
          Refresh
        </button>
      </div>
      <div id="transaction" style = "background-color: #064741;  padding: 10px; border-radius: 5px; width: 200px; position: relative;  right: 0px; margin: 10px;">
        <label for="add">Reciever's Address:</label><br>
        <input type="text" id="add" name="add" style="background-color:#032e2a; border-radius: 2px"><br>
        <label for="amount">Amount:</label><br>
        <input type="number" step="0.0001" min="0" id="amount" name="amount" style="background-color:#032e2a; border-radius: 2px"><br>
        <button @click="transact()" id="sendBtn" class="rounded-md bg-teal-800 px-4 py-2 text-teal-100 hover:bg-teal-900 shadow-lg border-b-4 border-b-teal-900" style="margin-top:10px; width: 110px; position: relative; left: calc(50% - 55px)">
          Send tIMX
        </button>
      </div>
      </div>
      <button @click="logout" class="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 shadow-lg border-b-4 border-b-red-600" style = "position: absolute; top: 0; right: 0; margin: 10px; width: 90px">
        Logout
      </button>
    </div>
  </main>
</template>

<style scoped>
</style>
