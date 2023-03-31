document.getElementById("checkbox").addEventListener('change', (e) => {
  document.getElementById('switch').setAttribute('class', e.target.checked ? 'on' : 'off')
})
