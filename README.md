# selfish-google-drive
-----
Google drive api wrapper that access your own account with function that named with linux command line

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

// { kind: 'drive#file',
//   id: '1rKARa_6zPZPPp4s5_ruOaxZLX6p3aIaE',
//   name: 'HADOKE1N',
//   mimeType: 'application/vnd.google-apps.folder' }
```

##### 2. ls
Show list all files in drive or in a specific folder
```js
return sgd.ls('1rKARa_6zPZPPp4s5_ruOaxZLX6p3aIaE').then(console.log)

// { kind: 'drive#fileList',
//   incompleteSearch: false,
//   files:
//    [ { kind: 'drive#file',
//        id: '1ipyXmH1DFQFSE1MPsBZ6J0O6KOGmYO-i',
//        name: 'abc.jpg',
//        mimeType: 'image/jpeg' },
//      { kind: 'drive#file',
//        id: '1bsyupFgTuUbepwA_DAN-9pypN0EEkN2q',
//        name: 'abc',
//        mimeType: 'application/vnd.google-apps.folder' } ]
```

##### 3. find
Find and list by search query object (by name or mimetype)
```js
const searchObject = {
  name: 'fakta',
  mimeType: 'image/jpeg',
}

return sgd.find(searchObject).then(console.log)

// { kind: 'drive#fileList',
//   incompleteSearch: false,
//   files:
//    [ { kind: 'drive#file',
//        id: '1ipyXmH1DFQFSE1MPsBZ6J0O6KOGmYO-i',
//        name: 'fakta.jpg',
//        mimeType: 'image/jpeg' } ] }
```

##### 4. wget
Download file from google drive to given path
```js
const dummyFile = {
  id: '0B68_w41xvLYFc3RhcnRlcl9maWxl',
  path: 'data/Getting started.pdf',
  mimeType: 'application/pdf'
}

return sgd.wget(dummyFile).then(console.log)

// data/Getting started.pdf
```

##### 5. scp
Upload file to given folder to google drive
```js
const dummyFilePath = '/home/eucliwood/repos/cermati/rajamoney/data/Masterfile-Redirections.xlsx'
const data = {
  name: 'Masterfile-Redirections',
  path: dummyFilePath,
  folder: ['1bsyupFgTuUbepwA_DAN-9pypN0EEkN2q', '1UbsbRlKP0tQkhZXHT2k2E05wa3j2t3WN'] // [Optional] Folder ids, or just leave it empty
}

return sgd.scp(data).then(console.log)

// const dummyFilePath = '/home/eucliwood/repos/creepy/creepy/data/images/5a99889d027fc292448e66f9.jpg'
// {
//   "kind": "drive#file",
//   "id": "1_rIXalPiqAVopyr8HiwcU_DzvmT68EY3",
//   "name": "Masterfile-Redirections.xlsx",
//   "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//  }
```

Open for suggesstion :)

##### License
MIT