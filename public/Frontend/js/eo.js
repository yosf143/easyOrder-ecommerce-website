function addToCart(itemJSON, buttonElement) {
    displayModal();
    event.preventDefault();

    let item = JSON.parse(itemJSON);
    const swiperContainer = document.querySelector(`#menu-item-${item._id} .swiper-container`);
    let activeImageSrc = item.imageSrc[0];

    if (swiperContainer) {
        const swiperInstance = swiperContainer.swiper;
        const activeIndex = swiperInstance.realIndex;
        activeImageSrc = item.imageSrc[activeIndex];
    } else if (item.imageSrc.length === 1) {
        activeImageSrc = item.imageSrc[0];
    }

    item.activeImage = {
        uuid: activeImageSrc.uuid,
        url: activeImageSrc.url
    };

    let selectedSize = document.querySelector(`input[name="${item._id}-size"]:checked`);
    if (selectedSize) {
        item.selectedSize = selectedSize.value;
        item.selectedSizePrice = selectedSize.dataset.price;
    } else if (item.sizes && item.sizes.length > 0) {
        item.selectedSize = item.sizes[0].name;
        item.selectedSizePrice = parseFloat(item.sizes[0].price).toFixed(2);
    }

    fetch('/addtocart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item })
    })
    .then(response => response.json())
    .then(data => {
        updateCartCount(data.cartItemCount);
        document.cookie = `cartCount=${data.cartItemCount}; path=/`;
        const plusOne = document.createElement('div');
        plusOne.classList.add('add-to-cart-animation');
        plusOne.innerText = '+1';
        buttonElement.appendChild(plusOne);

        setTimeout(() => {
            buttonElement.removeChild(plusOne);
        }, 1000); 

      
        const shoppingCartIcon = document.getElementById('shopping-cart-icon');
        const cartCount = document.getElementById('cart-count');
        shoppingCartIcon.classList.add('pulse');
        cartCount.classList.add('pulse');
        setTimeout(() => {
            shoppingCartIcon.classList.remove('pulse');
            cartCount.classList.remove('pulse');
        }, 500);
    })
    .catch(error => {
        console.error('Error:', error);
    });
} 


function updateCartCount(count) {
const cartCountElement = document.getElementById('cart-count');
if (count > 99) {
    cartCountElement.innerText = '99+';
} else {
    cartCountElement.innerText = count;
}
}

//other

document.addEventListener('DOMContentLoaded', function() {


function scrollHeader() {
    const nav = document.getElementById('header')
  
    if (nav && window.scrollY >= 200) {
        nav.classList.add('scroll-header');
    } else if (nav) {
        nav.classList.remove('scroll-header');
    }
}
window.addEventListener('scroll', scrollHeader)


function scrollTop() {
    const scrollTop = document.getElementById('scroll-top');
   
    if (scrollTop && window.scrollY >= 560) {
        scrollTop.classList.add('show-scroll');
    } else if (scrollTop) {
        scrollTop.classList.remove('show-scroll');
    }
}
window.addEventListener('scroll', scrollTop)

const sr = ScrollReveal({
    origin: 'bottom',  
    distance: '30px',
    duration: 1500,
    reset: true
});


sr.reveal(`.home__data, .home__img,
            .about__data, .about__img,
            .services__content,
            .app__data, .app__img,
            .contact__data, .contact__button,
            .footer__content`);
});

document.querySelector('.menu__container').addEventListener('click', function (event) {
    const target = event.target;
    if (target.type === 'radio') {
        const price = parseFloat(target.dataset.price);
        const priceElement = target.closest('.menu__content').querySelector('.menu__price');
        priceElement.innerText = `₪${price.toFixed(2)}`;

        Array.from(target.parentNode.children)
            .filter(sibling => sibling !== target && sibling.tagName === 'LABEL')
            .forEach(sibling => sibling.classList.remove('selected'));

        target.nextElementSibling.classList.add('selected');
    }
});

document.getElementById('menuCategories').addEventListener('click', function (event) {
if (event.target.classList.contains('menu-category-button')) {
    const category = event.target.dataset.category;
    const menuItems = document.querySelectorAll('.menu__content');
    menuItems.forEach(item => {
        if (category === 'show-all' || item.querySelector('.menu__name').innerText === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}
}); 

function setCookie(cookieName, cookieValue, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${cookieName}=${cookieValue}; ${expires}; path=/`;
  }
  
  function getCookie(cookieName) {
    const name = `${cookieName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  }
  
  function displayModal() {
    const modal = new bootstrap.Modal(document.getElementById('helperModal'));
  
    if (getCookie('modalDisplayed') !== 'true') {
      modal.show();
  
      modal._element.querySelector('.btn-close').addEventListener('click', function() {
        modal.hide();
        setCookie('modalDisplayed', 'true', 30);  
      });
  
      window.addEventListener('click', function(event) {
        if (event.target === modal._element) {
          modal.hide();
          setCookie('modalDisplayed', 'true', 30); 
        }
      });
    }
  }