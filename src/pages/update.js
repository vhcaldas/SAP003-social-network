import Button from '../components/button.js';
import Input from '../components/input.js';

function Update() {
  const template = `
  <div class="box">
    <header class="header"><img src="./Imagens/header-logo.png"></header>
    <section class = "login-box">
      <h1 class="name-network">Heroínas</h1>
      <h3 class="text-simple">Redefinição de Senha!</h3>
      <form class="primary-box">
        ${Input({
        class: 'js-email-input',
        placeholder: 'Email',
        type: 'email',
        })}
        ${Button({
        type: 'submit',
        id: 'up',
        title: 'Enviar email para redefinir senha',
        onClick: sendEmail,
        })}
      </form>
    <p class="alertMessage"></p>
  </section>
  </div>
  `;
  location.hash = 'update'
  return template;
}

function sendEmail() {
    const emailAddress = document.querySelector('.js-email-input').value;
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
        document.querySelector('.alertMessage').innerHTML = 'Email enviado <br> Verifique sua caixa de email';
    })
}

export default Update;
