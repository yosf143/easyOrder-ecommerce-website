document.addEventListener("DOMContentLoaded", function() {
    const sendOrderForm = document.getElementById('sendOrderForm');
    const sendOrderButton = sendOrderForm.querySelector('.send-order__button');
    const revealCouponBtn = document.getElementById('revealCouponBtn');
    const couponField = document.getElementById('couponCode');


    revealCouponBtn.addEventListener('click', function() {
        couponField.classList.toggle('revealed');
    });

    sendOrderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        sendOrderButton.disabled = true;

        this.submit();
    });
});
  
        
function updateQuantity(itemId, itemName, size, imageUuid, increase = true) {
    const cartItems = document.querySelectorAll('.cart__item');
    const itemToUpdate = Array.from(cartItems).find(item =>
        item.querySelector('.cart__item-name').innerText === itemName &&
        item.querySelector('.cart__item-size').innerText.includes(size) &&
        item.id === `menu-item-${itemId}-${imageUuid}`
    );

    if (itemToUpdate) {
        const quantityElement = itemToUpdate.querySelector('.cart__item-quantity p');
        let quantity = parseInt(quantityElement.innerText.match(/\d+/)[0]);
        quantity = increase ? quantity + 1 : Math.max(0, quantity - 1);
        quantityElement.innerText = `${quantity}`;

        if (quantity === 0) {
            itemToUpdate.remove();
        }
        updateTotalDue();
        fetch('/updatequantity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId, itemName, size, imageUuid, quantity })
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
 

function updateTotalDue() {
const cartItems = document.querySelectorAll('.cart__item');
let totalDue = 0;
cartItems.forEach(item => {
    const quantity = parseInt(item.querySelector('.cart__item-quantity p').innerText);
    const price = parseFloat(item.querySelector('.cart__item-size').innerText.split(' | ')[1]);
    totalDue += quantity * price;
});

document.getElementById('totalDue').innerText = totalDue.toFixed(2);
}

window.onload = function() {
updateTotalDue();
};

document.getElementById('sendOrderForm').addEventListener('submit', function(event) {
event.preventDefault();

const clientAddress = document.getElementById('clientAddress').value;
const cartItems = Array.from(document.querySelectorAll('.cart__item')).map(item => {
const itemDetails = item.querySelector('.cart__item-details');
return {
    detail: itemDetails.querySelector('.cart__item-name').innerText,
    price: parseFloat(itemDetails.querySelector('.cart__item-size').innerText.split(' | ')[1]),
    quantity: parseInt(itemDetails.querySelector('.cart__item-quantity p').innerText),
    imageSrc: item.querySelector('.cart__item-image').src,
    size: itemDetails.querySelector('.cart__item-size').innerText.split(' | ')[0]
};
});

const totalDue = parseFloat(document.getElementById('totalDue').innerText);
document.getElementById('cartItems').value = JSON.stringify(cartItems);
document.getElementById('totalDueInput').value = totalDue;

this.submit();

setTimeout(function() {
window.location.href = '/';
}, 2000);
});


//other

function toggleAddressField() {
var addressField = document.getElementById('clientAddress');
var pickupCheckbox = document.getElementById('pickupCheckbox');

if (pickupCheckbox.checked) {
addressField.value = "استلام من المحل";
addressField.style.display = "none";
} else {
addressField.value = "";
addressField.style.display = "block";
}
}