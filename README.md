# selfish-google-drive
-----
Google drive api wrapper that access your own account

# Installation
```
npm install selfish-google-drive --save
```

# Usage
##### 1. mkdir

```js
const credential = {
  clientID: 'somestring',
  clientSecret: 'somestring',
  refreshToken: 'somestring'
}

const sgd =require('selfish-google-drive')(credential);

return sgd.loadToken(true).then(console.log)
```