# selfish-google-drive
-----
Google drive api wrapper that access your own account

# Installation
```
npm install selfish-google-drive --save
```

# Usage
If you use the api for the first time, it will generate `sgd-token.json` (recommended to add it to .gitignore). Everytime you use the api, It will read the json file instead of call the api again to get the token, it will call the google api again if the sgd-token.json expired (expired in 3600s) or invalid.

The sgd-token.json should be like this
```json
{
  "access_token": "somestring",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

To init the package you should provide credential like below from google.
```js
const credential = {
  clientID: 'somestring',
  clientSecret: 'somestring',
  refreshToken: 'somestring'
}
```
You can check how to generate the credential at [How do I authorise an app (web or installed) without user intervention?
](https://stackoverflow.com/questions/19766912/how-do-i-authorise-an-app-web-or-installed-without-user-intervention) 

##### 1. mkdir
Create folder at your google drive
```js
return sgd.mkdir('HADOKE1N').then(console.log)

// Example return object
// { kind: 'drive#file',
//   id: '1rKARa_6zPZPPp4s5_ruOaxZLX6p3aIaE',
//   name: 'HADOKE1N',
//   mimeType: 'application/vnd.google-apps.folder' }
```