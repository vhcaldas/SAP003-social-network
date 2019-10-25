import Button from '../components/button.js';
import Input from '../components/input.js';
import Menu from '../components/menu.js';

function Perfil() {
  const template = `
  <div class="box">
    <header class="header"><img src="./Imagens/header-logo.png">
    <input type="checkbox" id="btn-menu"/>
    <label for="btn-menu">&#9776;</label>
    <nav class="menu">
    <ul>
    ${Menu({
        name: 'Feed',
        link: pageFeed,
      })}
    ${Menu({
        name: 'Sair',
        link: logOut,
      })}
    </ul> 
    </nav>
    </header>
    <section class = "primary-box">
      <h1 class="name-network">Heroínas</h1>
      <form class="primary-box">
        <p>${firebase.auth().currentUser.displayName}</p>
        <p>${firebase.auth().currentUser.email}</p>
        ${Button({
          id: 'deleteCount',
          title: 'deletar conta',
          onClick: deleteCount,
          })}
    </form>
  </section>
</div>
  `;
  location.hash = 'perfil'
  return template;
}

function pageFeed() {
    window.location.hash = 'post';
  }

  function logOut(){
    firebase.auth().signOut();
  }

  function deleteCount(){
    firebase.auth().currentUser.delete();
  }

export default Perfil;
