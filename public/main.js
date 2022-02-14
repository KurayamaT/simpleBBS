const main = ()=>
  firebase.database().ref('/simplebbs/posts').limitToLast(10).on('value',
  snapshot=>{
    const posts = snapshot.exists() ? snapshot.val() : {}
    let html = ''
    for(const [id, {name, content, date}] of Object.entries(posts).reverse())
      html += makeReply(id, name, content, date)
    document.querySelector('#replies').innerHTML = html
  })

//
const makeReply = (id, name, content, date) => `<div class="reply">
  <div class="head">Name: ${name} <span class="date">${date}</span></div>
  <div class="content">${content}</div>
  <button class="delete" onclick="deleteReply('${id}')">削除</button> </div>`

//投稿「post」関数定義
const postReply = ()=> post('/api/post', {
    name: document.querySelector('#reply-name').value,
    content: document.querySelector('#reply-body').value,
    key: document.querySelector('#reply-key').value,
  }).then(e=>{ document.querySelector('#reply-body').value='' })


const deleteReply = id => post('/api/delete', {id, key: prompt('key?') || ''})

const post = (path, jsonData) => fetch(path, {
    method: 'POST', body: JSON.stringify(jsonData),
    headers: {'Accept': 'application/json', 'Content-Type':
    'application/json'},
  })


  

document.addEventListener('DOMContentLoaded', main)

////////////////////
