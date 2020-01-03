const btn = document.getElementsByClassName('submit')[0];
const serverOffer = document.getElementById('server-offer');
const modals = document.getElementsByClassName('modal-background');
const billingModal = document.getElementById('billing-modal');
const infoModal = document.getElementById('info-modal');

Array.from(document.getElementsByClassName('inv-item')).forEach(elem => {
  if (elem.getElementsByClassName('how-much-left')[0].innerText === '0') {
    elem.getElementsByClassName('controls')[0].getElementsByTagName('input')[0].value = 0;
    elem.classList.add('inactive');
    return;
  }

  elem.addEventListener('click', itemListener);

  const quantityCounter = elem.getElementsByTagName('input')[0];

  elem.getElementsByTagName('div')[0].getElementsByTagName('div')[1].addEventListener('click', event => {
    if (+quantityCounter.value < +elem.getElementsByClassName('how-much-left')[0].innerText) {
      quantityCounter.value = +quantityCounter.value + 1;
    }
  });
  elem.getElementsByTagName('div')[0].getElementsByTagName('div')[0].addEventListener('click', event => {
    if (quantityCounter.value > 1) {
      quantityCounter.value -= 1;
    }
  });
});

checkOfferEmptiness();

btn.addEventListener('click', function() {
  event.preventDefault();

  let serverOfferlist = '';

  Array.from(serverOffer.children).forEach(item => {
    serverOfferlist += `${item.dataset.id}, ${item.dataset.price}, ${item.dataset.quantity};`;
  });

  document.forms[1].getElementsByTagName('input')[0].value = serverOfferlist;

  document.forms[1].submit();
});



document.getElementsByClassName('balance')[0].addEventListener('click', () => {
  billingModal.classList.add('visible');
});

document.getElementsByClassName('user')[0].addEventListener('click', () => {
  infoModal.classList.add('visible');
});



Array.from(modals).forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      modal.classList.remove('visible');
    }
  });
});



function itemListener() {
  const parent = event.currentTarget.parentNode;

  if (parent.id === 'server-inv') {
    if (event.target.parentNode.classList.contains('controls')) {
      return;
    }

    for (const offer of serverOffer.children) {
      if (offer.dataset.id === event.currentTarget.dataset.id) {
        serverOffer.removeChild(offer);
      }
    }

    let item = event.currentTarget.cloneNode(true);
    let quantity = item.getElementsByTagName('input')[0].value;

    item.removeChild(item.getElementsByClassName('how-much-left')[0]);
    item.removeChild(item.getElementsByTagName('div')[0]);
    let num = document.createElement('span');
    num.classList.add('quantity');
    num.innerText = quantity;
    item.dataset.quantity = quantity;
    item.appendChild(num);
    item.addEventListener('click', itemListener);
    serverOffer.appendChild(item);
    checkOfferEmptiness('server-offer');
    calculatePriceAndQuantity('server-offer');
  }
   else if (parent.id === 'server-offer') {
    parent.removeChild(event.currentTarget);
    checkOfferEmptiness(parent.id);
    calculatePriceAndQuantity(parent.id);
  }
}

function checkOfferEmptiness(id) {
  if (id) {
    const elem = document.getElementById(id);

    if (elem.children.length > 0) {
      elem.parentNode.classList.remove('empty');
    } else {
      elem.parentNode.classList.add('empty');
    }
  }

  if (serverOffer.children.length === 0) {
    btn.classList.add('inactive');
    btn.disabled = true;
  } else {
    btn.classList.remove('inactive');
    btn.disabled = false;
  }
}

function calculatePriceAndQuantity(id) {
  const items = document.getElementById(id).children;
  let sum = 0;
  let quantity = 0;
  
  for (item of items) {
    sum += item.dataset.price * item.dataset.quantity;
    quantity += +item.dataset.quantity;
  }

  document.getElementById('server-price').innerText = sum;
  document.getElementById('server-quantity').innerText = quantity;

  document.getElementById('balance-difference').innerText = sum;
}