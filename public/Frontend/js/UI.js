document.addEventListener('DOMContentLoaded', function() {
 
    const showMenu = (toggleId, navId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId)
 
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                
                nav.classList.toggle('show-menu')
            })
        }
    }
    showMenu('nav-toggle', 'nav-menu')
 
    const navLink = document.querySelectorAll('.nav__link')

    function linkAction() {
        const navMenu = document.getElementById('nav-menu')
         
        navMenu.classList.remove('show-menu')
    }
    navLink.forEach(n => n.addEventListener('click', linkAction))

  
    const sections = document.querySelectorAll('section[id]')

    function scrollActive() {
        const scrollY = window.pageYOffset

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight
            const sectionTop = current.offsetTop - 50;
            sectionId = current.getAttribute('id')

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
            } else {
                document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
            }
        })
    }
    window.addEventListener('scroll', scrollActive)

  
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
                .footer__content, .footer__payments`);
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


    
