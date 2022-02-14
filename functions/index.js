const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const db = admin.database()
const rep = s=> s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,'<br>')

exports.post = functions.https.onRequest((request, response)=>{
  const {name, content, key} = request.body
  const date = new Date().toLocaleDateString()
  db.ref('/simplebbs/posts').push({name:rep(name), content:rep(content), date})
    .then(e=> db.ref(`/simplebbs/keys/${e.key}`).set(key))
    .then(e=> response.status(200).end())
})

exports.delete = functions.https.onRequest((request, response)=>{
  const {id, key} = request.body
  db.ref(`/simplebbs/keys/${id}`).once('value').then(sKey=>{
    if(!sKey.exists() || sKey.val() !== key)
      return response.status(400).send('invalid id or incorrect key').end()
    db.ref(`/simplebbs/posts/${id}`).remove()
      .then(e=> sKey.ref.remove())
      .then(e=> response.status(200).end())
  })
})
