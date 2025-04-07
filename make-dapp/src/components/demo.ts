export const htmlFile = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Color Surprise Box</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    #box {
      width: 200px;
      height: 200px;
      background: salmon;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2em;
      cursor: pointer;
      border-radius: 12px;
      transition: background 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>

<div id="box" onclick="changeBox()">Click me!</div>

<script>
  const colors = ['tomato', 'royalblue', 'mediumseagreen', 'purple', 'goldenrod', 'crimson'];
  const messages = [
    'Nice!',
    'Whoa!',
    '✨ Magic ✨',
    'Again!',
    'Feeling lucky?',
    'Boom!',
    'Colorful!'
  ];

  function changeBox() {
    const box = document.getElementById('box');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    box.style.background = color;
    box.textContent = msg;
  }
</script>
</body>
</html>
`.trim();
