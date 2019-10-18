import Input from '../components/input.js';
import Button from '../components/button.js';
import PostCard from '../components/postcard.js';
import Icons from '../components/icons.js'

function loadPost() {
  const email = firebase.auth().currentUser.emailVerified;
  const codUid = firebase.auth().getUid(email);
  firebase.firestore().collection('Posts').where("user", "==", codUid).orderBy("data", "desc").get().then(
    (snap) => {
      snap.forEach((doc) => {
        templatePosts({
          dataId: doc.id, 
          name: doc.data().name, 
          post: doc.data().post, 
          time: doc.data().data.toDate().toLocaleString("pt-BR") });
      });
    });
}

function templatePosts(props) {
  const timeline = document.getElementById("history")
  timeline.innerHTML += `<div data-id=${props.dataId} class='post-box'> 
    ${Icons({dataId:props.dataId, title:'<i class="fas fa-trash-alt"></i>',onClick: deletePost,})}
    ${PostCard(props)} 
    ${Icons({dataId:props.dataId, id:'like', title:'<i class="far fa-heart"></i>️',onClick: likePost,})}
    ${Icons({dataId:props.dataId, id:'edit',title:'<i class="fas fa-edit"></i>',onClick: editPost,})}
    ${Icons({dataId:props.dataId, id:'save',title:'<i class="far fa-save"></i>',onClick: SavePost,})}</div>`
}

function Post() {
  location.hash = 'post'
  const template = `
  <div class="box">
  <header class="header"><img src="./Imagens/header-logo.png"></header>
  <nav>
  <ul class="menu">
    <li><a href="#">Feed</a></li>
    <li><a href="#">Perfil</a></li>
    <li><a href="#">Sair</a></li>
    </ul>
  </nav>
  <div class="description">
    <img class = "avatar" src="./Imagens/avatar.png">
    <p class = "name-display">${firebase.auth().currentUser.displayName}</p>
  </div>
  <form class="primary-box">
    ${Input({
    class: 'js-post',
    placeholder: 'O que quer compartilhar?',
    type: 'text',
  })}
    ${Button({
    id: 'share',
    title: 'Compartilhar',
    onClick: SharePost,
  })}
  </form>
  <ul id="history">
  </ul>
  </div>`;
  loadPost();
  return template;
}

function SharePost() {
  const postText = document.querySelector('.js-post');
  const email = firebase.auth().currentUser.emailVerified
  const codUid = firebase.auth().getUid(email);
  const time = firebase.firestore.FieldValue.serverTimestamp();
  const name = firebase.auth().currentUser.displayName;
  firebase.firestore().collection('Posts').add({
    name: name,
    user: codUid,
    data: time,
    likes: 0,
    post: postText.value,
    comments: []
  }).then(function () {
    location.reload()
    loadPost();
  })
  document.querySelector('.js-post').value = '';
}

function deletePost(event) {
  const idPost = event.target.dataset.id
  firebase.firestore().collection('Posts').doc(idPost).delete()
  event.target.parentElement.remove()
}

function likePost(event) {
  const idPost = event.target.dataset.id
  const x = firebase.firestore().collection('Posts').doc(idPost).get().then((doc) => doc.data().likes)
  console.log(x)
  firebase.firestore().collection('Posts').doc(idPost).update({
    likes: 5
  })
}

function editPost(event) {
  const idPost = event.target.dataset.id
  const valor = document.getElementById(idPost).getElementsByClassName('card-post')[0];
  valor.setAttribute('contentEditable', 'true')
  console.log(valor)
  //event.target.parentElement.update()
}

function SavePost(event) {
  const idPost = event.target.dataset.id
  const valor = document.getElementById(idPost).getElementsByClassName('card-post')[0];
  valor.setAttribute('contentEditable', 'true')
  console.log(valor)
  //event.target.parentElement.update()
}

export default Post;
