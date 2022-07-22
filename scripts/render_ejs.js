// https://teddit.net/r/learnjavascript/comments/m1tyv5/how_to_runopen_an_ejs_file_on_browser/
const bodyHTML = document.body
  .innerHTML
  .replace(/\&lt;/g, "<")
  .replace(/\&gt;/g, ">");
document.body.innerHTML = ejs.render(bodyHTML);
