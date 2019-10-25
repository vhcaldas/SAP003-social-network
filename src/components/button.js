function Button(props) {
  const template = `
    <button
      class="button"
      type="submit"
      id=${props.id}
      onclick="button.handleClick(event, ${props.onClick})" >
      ${props.title}
    </button>
  `;
  return template;
}
window.button = {
  handleClick: (event, callback) => {
    event.preventDefault();
    callback(event);
  },
};
export default Button;
