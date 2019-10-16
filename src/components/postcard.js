function PostCard(props) {
    const template = `
    <li class="card">
      <p>${props.name}</p>
      <p>${props.post}</p>
    </li>
    `;
    return template;
}
export default PostCard;
