import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

import { config, passport  } from '@imtbl/sdk';
import * as jose from 'jose';

async function validateJWT(jwt){
  const JWKS = jose.createRemoteJWKSet(new URL('https://auth.immutable.com/.well-known/jwks.json'))
  const { payload } = await jose.jwtVerify(jwt, JWKS)
  return payload;
}

const passportConfig = {
  clientId: import.meta.env.VITE_IMMUTABLE_CLIENT_ID ?? "YOUR_CLIENT_ID",
  redirectUri: "http://www.vivek-spaceinvaders.netlify.com",
  logoutRedirectUri: "http://www.vivek-spaceinvaders.netlify.com/logout",
  scope: "transact openid offline_access email",
  audience: "platform_api",
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX, 
    apiKey: "", 
  })
};
const passportInstance = new passport.Passport(passportConfig);

const passportProvider = passportInstance.connectEvm();

if (window.location.pathname === '/login') {
  window.onload = async () => {
    await passportInstance.loginCallback();
  }
}
const provider = passportInstance.connectEvm();
const main = {provider, passportInstance, validateJWT}
export default main;

setInterval(async()=>{
  let userObj = await passportInstance.getUserInfo();
  if(userObj){document.getElementById('nickname').innerHTML = `Nickname: ${userObj.nickname}`;
  document.getElementById('email').innerHTML = `Email: ${userObj.email}`;
  document.getElementById('loggedIn').style.visibility = "visible";
  document.getElementById('loggedOut').style.visibility = "hidden";} else {
    document.getElementById('loggedOut').style.visibility = "visible";
    document.getElementById('loggedIn').style.visibility = "hidden";
  }
},200)