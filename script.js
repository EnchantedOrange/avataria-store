let mySum = 0, serverSum = 0;

const btn = document.getElementsByClassName('submit')[0];
const myOffer = document.getElementById('my-offer');
const serverOffer = document.getElementById('server-offer');
const modal = document.getElementsByClassName('modal-background')[0];

Array.from(document.getElementsByClassName('inv-item')).forEach(elem => {
  if (elem.parentNode.id === 'server-inv' && elem.getElementsByClassName('how-much-left')[0].innerText === '0') {
    elem.getElementsByClassName('controls')[0].getElementsByTagName('input')[0].value = 0;
    elem.classList.add('inactive');
    return;
  }

  elem.addEventListener('click', itemListener);

  const quantityCounter = elem.getElementsByTagName('input')[0];

  elem.getElementsByTagName('div')[0].getElementsByTagName('div')[1].addEventListener('click', event => {
    if (elem.parentElement.id === 'server-inv') {
      if (quantityCounter.value < elem.getElementsByClassName('how-much-left')[0].innerText) {
        quantityCounter.value = +quantityCounter.value + 1;
      }
    } else {
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

  let myOfferlist = '';
  let serverOfferlist = '';
  Array.from(myOffer.children).forEach(item => {
    myOfferlist += `${item.dataset.id}, ${item.dataset.price}, ${item.dataset.quantity};`;
  });

  Array.from(serverOffer.children).forEach(item => {
    serverOfferlist += `${item.dataset.id}, ${item.dataset.price}, ${item.dataset.quantity};`;
  });

  document.forms[1].getElementsByTagName('input')[0].value = myOfferlist;
  document.forms[1].getElementsByTagName('input')[1].value = serverOfferlist;

  document.forms[1].submit();
});

document.getElementsByClassName('balance')[0].addEventListener('click', () => {
  modal.classList.add('visible');
});

modal.addEventListener('click', event => {
  if (event.target === modal) {
    modal.classList.remove('visible');
  }
});

function itemListener() {
  const parent = event.currentTarget.parentNode;
  if (parent.id === 'my-inv') {
    if (event.target.parentNode.classList.contains('controls')) {
      return;
    }

    for (const offer of myOffer.children) {
      if (offer.dataset.id === event.currentTarget.dataset.id) {
        myOffer.removeChild(offer);
      }
    }
  
    let item = event.currentTarget.cloneNode(true);
    let quantity = item.getElementsByTagName('input')[0].value;
    item.removeChild(item.getElementsByTagName('div')[0]);
    let num = document.createElement('span');
    num.classList.add('quantity');
    num.innerText = quantity;
    item.dataset.quantity = quantity;
    item.appendChild(num);
    item.addEventListener('click', itemListener);
    myOffer.appendChild(item);
    checkOfferEmptiness('my-offer');
    calculatePriceAndQuantity('my-offer');
  } else if (parent.id === 'server-inv') {
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
  } else if (parent.id === 'my-offer' || parent.id === 'server-offer') {
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

  if (myOffer.children.length === 0 && serverOffer.children.length === 0) {
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

  switch (id) {
    case 'my-offer':
      document.getElementById('my-price').innerText = sum;
      document.getElementById('my-quantity').innerText = quantity;
      mySum = sum;
      break;

    case 'server-offer':
      document.getElementById('server-price').innerText = sum;
      document.getElementById('server-quantity').innerText = quantity;
      serverSum = sum;
      break;
  }

  let difference = mySum - serverSum;
  let differenceSign;
  if (difference < 0) {
    differenceSign = '-';
    difference = -difference;
  } else {
    differenceSign = '+';
  }
  document.getElementById('balance-sign').innerText = differenceSign;
  document.getElementById('balance-difference').innerText = difference;
}