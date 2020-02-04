import TextArea from '../components/textarea.js';
import Button from '../components/button.js';
import PostCard from '../components/postcard.js';
import Icons from '../components/icons.js';
import Menu from '../components/menu.js';

/* eslint-disable no-use-before-define, no-alert, no-plusplus, no-restricted-globals, */

function loadPost() {
  const email = firebase.auth().currentUser.email;
  const codUid = firebase.auth().getUid(email);
  firebase.firestore()
    .collection('Posts')
    .where('user', '==', codUid)
    .orderBy('data', 'desc')
    .onSnapshot(
      (querySnapshot) => {
        const timeline = document.getElementById('list-post');
        timeline.innerHTML = '';
        querySnapshot.forEach((doc) => {
          templatePosts({
            dataId: doc.id,
            like: doc.data().likes,
            name: doc.data().name,
            post: doc.data().post,
            time: doc.data().data.toDate().toLocaleString('pt-BR'),
          });
        });
      },
    );
}

function SharePost() {
  const postText = document.querySelector('.post-textarea').value;
  const email = firebase.auth().currentUser.email;
  const codUid = firebase.auth().getUid(email);
  const time = firebase.firestore.FieldValue.serverTimestamp();
  const name = firebase.auth().currentUser.displayName;
  if (postText === '') {
    alert('Digite uma mensagem!');
  } else {
    firebase
      .firestore()
      .collection('Posts')
      .add({
        name,
        user: codUid,
        data: time,
        likes: 0,
        post: postText,
        comments: [],
      });
    document.querySelector('.post-textarea').value = '';
  }
}

function deletePost(event) {
  const idPost = event.target.dataset.id;
  firebase.firestore().collection('Posts').doc(idPost).delete();
  event.target.parentElement.remove();
}

function likePost(event) {
  const idPost = event.target.dataset.id;
  const time = firebase.firestore.FieldValue.serverTimestamp();
  firebase.firestore().collection('Posts').doc(idPost).get()
    .then((doc) => {
      let numLikes = doc.data().likes;
      numLikes++;
      firebase.firestore().collection('Posts').doc(idPost).update({
        likes: numLikes,
        time,
      });
    });
}

function editPost(event) {
  const idPost = event.target.dataset.id;
  const select = document.querySelector(`li[data-id= '${idPost}']`).getElementsByClassName('card-post')[0];
  select.setAttribute('contentEditable', 'true');
  document.getElementById(idPost).querySelector('.primary-icon-save').style.display = 'inline';
}

function savePost(event) {
  const idPost = event.target.dataset.id;
  const time = firebase.firestore.FieldValue.serverTimestamp();
  const newtext = document.querySelector(`li[data-id= '${idPost}']`).getElementsByClassName('card-post')[0].innerHTML;
  firebase.firestore().collection('Posts').doc(idPost).update(
    {
      post: newtext,
      time,
    },
  );
  document.getElementById(idPost).querySelector('.primary-icon-save').style.display = 'none';
}

function Post(name) {
  const template = `
  <header class="header-post"><img class="img-post" src="./Imagens/header-logo.png" class="img-post"></header>
  <input type="checkbox" id="btn-menu"/>
  <label for="btn-menu">&#9776;</label>
  <nav class="menu">
    <ul>
    ${Menu({
    name: 'Perfil',
    link: pageProfile,
  })}
    ${Menu({
    name: 'Sair',
    link: logOut,
  })}
    </ul> 
  </nav>
  <section class="template-post">
    <div class="user">
      <img class = "avatar" src="./Imagens/avatar.png">
      <div class="user-info">
        <p class = "name-user">${name}</p>
        <p class='job-user'>${firebase.firestore()
    .collection('users')
    .doc(firebase.auth().getUid(firebase.auth().currentUser.email))
    .get()
    .then((doc) => {
      document.querySelector('.job-user').textContent = doc.data().job;
    })}</p>
      </div>
    </div>
    <div class="box-post">
      <form class="forms-post">
        ${TextArea({
    class: 'post',
    placeholder: 'O que quer compartilhar?',
  })}
        ${Button({
    id: 'btnshare',
    title: 'Compartilhar',
    onClick: SharePost,
  })}
      </form>
      <ul id="list-post"></ul>
    </div>
  </section>
  `;
  loadPost();
  location.hash = 'post';
  return template;
}


function templatePosts(props) {
  const timeline = document.getElementById('list-post');
  timeline.innerHTML += `<div id=${props.dataId} class='post-box'> 
    ${Icons({
    dataId: props.dataId, class: 'delete', title: 'X', onClick: deletePost,
  })}
    ${PostCard(props)} 
    ${Icons({
    dataId: props.dataId, class: 'like', title: `👍 ${props.like}`, onClick: likePost,
  })}
    ${Icons({
    dataId: props.dataId, class: 'edit', title: '📝', onClick: editPost,
  })}
    ${Icons({
    dataId: props.dataId, class: 'save', title: '💾', onClick: savePost,
  })}
    </div> `;
  document.getElementById(props.dataId).querySelector('.primary-icon-save').style.display = 'none';
}

function pageProfile() {
  window.location.hash = 'profile';
}

function logOut() {
  firebase.auth().signOut();
}

window.post = {
  deletePost,
  editPost,
  savePost,
};

export default Post;
