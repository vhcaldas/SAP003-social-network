function PostCard(props) {
    const template = `
    <li id=${props.id} class="card">
      <p>${props.data}</p>
      <p>${props.name}</p>
      <p>${props.post}</p>
    </li>
    `;
    return template;
}
export default PostCard;
