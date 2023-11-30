export function createInfoItem(label, value) {
    const item = document.createElement('p');
    item.classList.add('info-item');
    item.innerHTML = `<b>${label}:</b> ${value}`;
    return item;
  }
  