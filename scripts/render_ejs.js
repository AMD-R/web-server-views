// https://teddit.net/r/learnjavascript/comments/m1tyv5/how_to_runopen_an_ejs_file_on_browser/
// https://web.dev/read-files/
// https://stackoverflow.com/questions/371875/local-file-access-with-javascript
const bodyHTML = document.body
  .innerHTML
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');
const fn = ejs.compile(bodyHTML, { client: true });

document.body.innerHTML = fn(null, null, function(path, data) {
  console.log(path);
  console.log(data);
  if (path == '../includes/footer.html') {
    return '<footer class="footer"><p class="footer-item" style="font-size: 10vh; color: white;">Footer</p></footer>';
  } else if (path == '../includes/header.html') {
    return '<header class="footer"><div style="color: white; font-size: 10vh;">Header</div></header>';
  }
});
