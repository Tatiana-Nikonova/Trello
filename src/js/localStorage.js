export function save() {
  const container = document.body.querySelector('.container');
  const html = container.innerHTML;
  localStorage.setItem('state', JSON.stringify(html));
}

export function load() {
  try {
    return JSON.parse(localStorage.getItem('state'));
  } catch (e) {
    console.log(e);
    throw new Error('Ошибка загрузки');
  }
}
