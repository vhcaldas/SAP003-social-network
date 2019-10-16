import Input from '../components/input.js';
import Button from '../components/button.js';
import PostCard from '../components/postcard.js';

function Timeline() {
  firebase.firestore().collection('Posts').get().then(
    (snap) => {
      snap.forEach((doc) => {
        templatePosts({name: doc.data().name, post: doc.data().post})
      });
    });
}

function Post() {
  location.hash = 'post'
  const template = `
  <div class="box">
  <header class="header-post"><img src="./Imagens/header-logo.png" height="100"><h1 class="name-network">Heroínas</h1></header>
  <div class="description">
  <img class="avatar" src="../Imagens/perfil.jpg">
  ${firebase.auth().currentUser.displayName}</div>
  <form class="primary-box">
    ${Input({
    class: 'js-post',
    placeholder: 'O que quer compartilhar?',
    type: 'text',
  })}
    ${Button({
    type: 'submit',
    id: 'share',
    title: 'Compartilhar',
    onClick: SharePost,
  })}
  </form>
  <ul id="history">
  </ul>
  </div>`;
  Timeline();
  return template;
}

function SharePost() {
  const postText = document.querySelector('.js-post').value;
  const email = firebase.auth().currentUser.emailVerified
  const codUid = firebase.auth().getUid(email);
  const time = firebase.firestore.FieldValue.serverTimestamp();
  const name = firebase.auth().currentUser.displayName;
  firebase.firestore().collection('Posts').add({
    name: name,
    user: codUid,
    data: time,
    likes: 0,
    post: postText,
    comments: []
  }).then(function () {
    location.reload()
    Timeline();
    // document.querySelector('#history').innerHTML += `<li><p>${name}</p><p>${postText}</p></li>`;
  }) 
  document.querySelector('.js-post').value = '';
}

function templatePosts(props){
 const xuxu = document.getElementById("history")
 xuxu.innerHTML += PostCard(props)
}

export default Post;
