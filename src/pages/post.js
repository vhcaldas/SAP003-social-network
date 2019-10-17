import Input from '../components/input.js';
import Button from '../components/button.js';
import PostCard from '../components/postcard.js';

function Post() {
  location.hash = 'post'
  const template = `
  <div class="box">
  <header class="header-post"><img src="./Imagens/header-logo.png" height="80px"><h1 class="name-network">Heroínas</h1></header>
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
    onClick: sharePost,
  })}
  </form>
  <ul id="history">
  </ul>
  </div>`;
  Timeline();
  return template;
}

function sharePost() {
  const postText = document.querySelector('.js-post').value;
  const name = firebase.auth().currentUser.displayName;
  const time = firebase.firestore.FieldValue.serverTimestamp();
  const email = firebase.auth().currentUser.emailVerified
  const codUid = firebase.auth().getUid(email);
  firebase.firestore().collection('Posts').add({
    name: name,
    user: codUid,
    data: time,
    likes: 0,
    post: postText,
    comments: [],
  }).then(function () {
    location.reload()
    Timeline();
  }) 
  document.querySelector('.js-post').value = '';
}

function Timeline() {
  const email = firebase.auth().currentUser.emailVerified
  const codUid = firebase.auth().getUid(email);
  firebase.firestore().collection('Posts').where('user', '==', codUid).get().then(
    (snap) => {
      snap.forEach((doc) => {
        templatePosts({
          id: doc.id,
          name: doc.data().name, 
          post: doc.data().post, 
          data: doc.data().data.toDate().toLocaleString('pt-BR')
        })
      });
    }
  );
}

function templatePosts(props){
 const xuxu = document.getElementById("history")
 xuxu.innerHTML += PostCard(props) + Button({id:props.id ,title:'️❤️', onClick:numberLike}) + Button({
  id: props.id,  title: '❌',  onClick: deletePost})
}

function numberLike() {
  const x = event.target.id
  firebase.firestore().collection('Posts').doc(x).update({
    likes: 1,
  })
  console.log('Oie')
}

function deletePost(event) {
  const x = event.target.id
  console.log(x)
  firebase.firestore().collection('Posts').doc(x).delete()
  document.querySelector('li')
}

export default Post;
