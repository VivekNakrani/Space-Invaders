# Immutable passport Integration 

This guide helps get you started developing an app to integrate immutable passport with Vue 3 in Vite and @imtbl/sdk.
> Prerequisites: Node.js, NPM and Git installed.

[My Immutable Passport Integration App](https://immutable-passport-sample.adityanarayan13.repl.co/)

## Cloning sample app
```sh
git clone https://github.com/stackieval/immutable-passport-sample
cd immutable-passport-sample
```

## Customize configuration

You need to change `vite.config.js` file as follows:

#### Add these lines to `export default defineConfig`:

```js
server: {
    host: '0.0.0.0',
    port: 5173,
    disableHostCheck: true,
    cors: false
  }
```
this enables your app to host onto any ip, in case you wanna host it online.


```js
  resolve: {
    define: {
        global: {}
    }
  }
```
this defines global for your app.


#### `defineConfig` should look like this now:
```js
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    disableHostCheck: true,
    cors: false
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    global: {}
  }
})
```

## Project Setup

```sh
npm install
```
install the dependencies for making app

```sh
npm install @imtbl/sdk jose events
```
`@imtbl/sdk` is the main package you will be using for passport authentication.
`jose` is a package used to validate JWTs.
`events` is used to access global events in vite app.

## Customising app
You need to change `App.vue` according to your application.

In `src/App.vue` replace everything in `<main>` tag with these lines:
```html
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
```
### Explanation:
There are divs, havind ids "loggedIn" and "loggedOut" respectively. The "loggedOut" div contains a login button while the "loggedOut" div contains information (or placeholders for information) about the logged in user. 
#### Note: You can choose your own style and hence change the style attributes of different elements, you can also add your own `<style>` element in `<head>` of `index.js` if you like.

## Registering your application on Immutable Developer Hub
Now that we are finished setting up our project, we now need to Register our application on [Immutable Developer Hub](https://hub.immutable.com/).

1. Go to https://hub.immutable.com/
2. Click "Login Using Password", a popup should open.
3. Login (or Create Passport if you haven't already) using your preferred method.
4. Click on "Add Project", Enter your project name, choose "Immutable zkEVM" in rollup and click "Create". The project should be created.
5. In "Create Environment" dialog enter the name for your environment, select Testnet and click "Create".
6. Inside your environment, in passport tab, create a passport client:
* Application Type: Web Application
* Client Name: Any
* Logout URLs: The URL where you want the application to redirect after loggin out of the app.
* Redirect URLs: The URL that your users will be redirected to once the authentication is complete. This where your application process the authentication response.
Once you have successfully registered your application in the Immutable Developer Hub. Be sure to make a note of your application's Client ID, Callback URL and the Logout URL that you entered.

## Initialising passport client
Now get back to your IDE, we have already installed all the necessary packages, now we will initialise our client.

In `src/main.js` file, first import the necessary packages (leave the initial lines as it is, we will insert our code from next lines):
```js
import { config, passport  } from '@imtbl/sdk';
import * as jose from 'jose';
```

Now we create a passport instance for our client, add these codes from next line:
```js
const passportInstance = new passport.Passport({
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
  clientId: '<YOUR_CLIENT_ID>',
  redirectUri: 'https://example.com',
  logoutRedirectUri: 'https://example.com/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});
```
* `config.Environment.SANDBOX` defines our environment, which is a testnet environment.
* `clientId`, `redirectUri` and `logoutRedirectUri` should be same as we recoreded when registering your application on immutable developer hub.
* `platform_api` is the identifier for the Immutable protocol APIs.
* Learn more about [scopes](https://docs.immutable.com/docs/zkEVM/products/passport/install#26-scope)

## Logging in a user with Passport
We will be now logging in users to our application with immutable passport. First we create a passport provider:
```js
const provider = passportInstance.connectEvm();
```
We can call various methods using the `request()` function of provider. Since we need to login the user using a button (see the elements we inserted in `App.vue`), we need to export the provider so that we can use it in our webpage (It's not really necessary, but better for organising the script).

Add the following code to the next line:
```js
const main = { provider }
export default main;
```

Now navigate to `src/App.vue`, we will be adding our codes between `<script setup></script>` tags.

First we import the necessary data from `main.js`
```js
import main from './main';
```

Now will create a `login` function:
```js
const login = async () => {
    const provider = main.provider;
    const accounts = await provider.request({ method: "eth_requestAccounts" });
  }
```
Once the `requestAccounts` RPC method has been called, the Passport module will begin the authentication process. If the user successfully authenticates, then the user will be redirected to the `Redirect URI` that was set in the OIDC Configuration.

Now we need to configure the login callback on redirect uri.
We will add a logic to `main.js` to check for page url and if it matches our set callback url, we call the `loginCallback` method.

Add following code after `const provider...` in `main.js`:
```js
(window.location.href === '<YOUR_LOGIN_CALLBACK_URL>') {
  window.onload = async () => {
    await passportInstance.loginCallback();
  }
}
```
#### Note: You can also use `location.path === '/pathname'` if u just need to check for path.

The `loginCallback` method will then process the response from the Immutable's auth domain, store the authenticated user in session storage and close the pop-up. Once the authentication flow is complete, the Promise returned from requestAccounts will also resolve with a single-item array containing the user's address.

## Displaying the id token, access token obtained from authenticating with Passport after login, and the user's nickname
After we have logged in successfully, we can now display user info, such as the id token, access token, nickname, email, etc.

### Getting Nickname
```js
let userObj = await passportInstance.getUserInfo();
```
The `getUserInfo()` method returns a promise which resolves into a json object containing user's nickname, email and oauth id.

You can access nickname as follows:
```js
const nickname = userObj.nickname
```

### Getting ID and Access token
You can get ID and Access token for the logged in user using following method:
```js
    const accessToken = await passportInstance.getAccessToken();
    const idToken = await passportInstance.getIdToken();
```
However, these tokens are in form of `JWTs(JSON Web Tokens)` which are not human readable. We need to validate them in order to make them readable. We can use a js module like `jose to validate, or alternatively, we can use [online JWT debugger](https://jwt.io/#debugger-io) for the same.

Here is the function through which you can validate those JWTs and return the token payload using `jose`:
```js
async function validateJWT(jwt){
  const JWKS = jose.createRemoteJWKSet(new URL('https://auth.immutable.com/.well-known/jwks.json'))
  const { payload } = await jose.jwtVerify(jwt, JWKS)
  return payload;
}
```
This method returns a promise that resolves into json objects, you can display them in the app by using `JSON.stringify()` mehtod:
```js
const dAccess = await main.validateJWT(accessToken)
const dId = await main.validateJWT(idToken)
```

### Displaying the information
Now you can display these information in your app using `element.innerHTML` property. Look up for the placeholder in `App.vue` and think of the occasions you need to input the details inside the elements. Modify your code accordingly. Also, remember we exported `provider` from `main.js`? You can similarly export other methods and properties too if needed, just add them in `const main = {...}`.

## Initiate a transaction from Passport and obtaining the transaction hash
We will now try to initiate a transaction, send some tIMX tokens to an adress and obtaining the transaction hash, which can be used to get details of the transaction in [blockchain explorer](https://explorer.testnet.immutable.com/).

The `sendTransaction` RPC method is used to initiate transactions, however, we first need to call `requestAccounts` RPC method before we can call `sendTransaction` method:
```js
try {
    await provider.request({ method: "eth_requestAccounts" });
    const transactionHash = await provider.request({
    method: 'eth_sendTransaction',
    params: [
        {
        to: '0x', //reciever's address
        value: '0x...' //The value transferred for the transaction in wei, encoded as a hex string.
        }
    ]
    });
    alert("Transaction Successful! \nTransaction hash: " + transactionHash)
    console.log(transactionHash)
} catch (e){
    alert(e)
} finally {
    //do something
}
```
In the `eth_sendTransaction` method, `to` is the hex encoded address of the reciever of the transaction and `value` is the value transferred for the transaction in wei, encoded as a hex string. The sender is the user logged in. Note that **1 ETH = 10⁸ wei** so be careful when passing the parameter. After a successful transaction, the app will alert the user about the transaction hash. If there is an error, it will alert the same.

#### Note: Have a look at `App.vue` and you can find a div element having some inputs, use that as the inputs for your transaction.

## Logging out a user
Now finally, after the user have used the app, the user needs to be logged out of the application, `passportInstance.logout();` method logs the user out of the application and redirects to the speciefied `logoutURI`.

```js
const logout = () => {
    passportInstance.logout();
  };
```
This code will call `passportInstance.logout();` method after the logout button is clicked (see `App.vue`)
<hr>

Thank you for using the guide and learning about immutable zkEVM. You can check the source files in this repository in case you need to verify your codes, also, you can use your own methods of displaying data in the webpage. If u want to know more about the immutable zkEVM passport, visit the [documentation](https://docs.immutable.com/docs/zkevm/products/passport/)

Do check my app integrated with immutable passport [here](https://immutable-passport-sample.adityanarayan13.repl.co/)
