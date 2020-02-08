function Input(props) {
  const template = `
    <input
        class="${props.class} input"
        id=${props.id}
        class="input"
        placeholder="${props.placeholder}"
        value="${props.value}"
        type="${props.type}">
    `;
  return template;
}
export default Input;
