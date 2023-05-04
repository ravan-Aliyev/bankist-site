'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(el => el.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////////////////////////////////////
// button Scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log("current (X/y)", window.pageXOffset, pageYOffset);

  // console.log('height/width', document.documentElement.clientHeight,
  // document.documentElement.clientWidth);

  // window.scrollTo(s1coords.left, s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // })

  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// Navigation

// document.querySelectorAll('.nav__links').forEach(el => {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');

//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth'
//     })
//   })
// })

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// TABBED

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active Tab
  clicked.classList.add('operations__tab--active');

  // Active content area

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(sib => {
      if (sib !== link) sib.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handHover.bind(0.5));
nav.addEventListener('mouseout', handHover.bind(1));

// Sticky nav
// const cords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function() {

//   if(this.scrollY > cords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky')
// })

// Sticky nav: Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const obsCallBack = function (entries) {
  const [entry] = entries;
  nav.classList.toggle('sticky', !entry.isIntersecting);
};
const ops = {
  root: null,
  threshold: 0 /*Number.parseFloat(getComputedStyle(nav).height) /
  Number.parseFloat(getComputedStyle(header).height),*/,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(obsCallBack, ops);
observer.observe(header);

// Reveal section
const allSection = document.querySelectorAll('.section');

const revealSection = function (en, ob) {
  const [entry] = en;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

// Lazy loading imiges
const imiges = document.querySelectorAll('img[data-src]');
const loadingImg = function (en, ob) {
  const [entry] = en;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadingImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imiges.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const preSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    createDots();
    activateDot(curSlide);
    goToSlide(0);
  };
  init();

  // Event Handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', preSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') preSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    const slide = e.target.closest('.dots__dot');
    if (!slide) return;
    curSlide = slide?.dataset.slide;

    goToSlide(curSlide);
    activateDot(curSlide);
  });
};
slider();
//////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/*
// Selecting elements
document.documentElement;
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

const allButtons = document.getElementsByTagName('button');
console.log( document.getElementsByClassName('btn'));

// Creating and inserting elements
// allButtons.insertAdjacenmentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
message.style.position = 'fixed'
message.innerHTML = `We use cookied for improved functianolity and analytics. <button class='btn btn--close-cookie'>Got it!</button>`;
header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true))
// header.before(message);
// header.after(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    // header.removeChild(message);
  });

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 15 +'px'


console.log(getComputedStyle(message).height)

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo')
logo.alt = 'OMG logo'
console.log(logo.alt);
console.log(logo.className);
console.log(logo.getAttribute('class'));
console.log(logo.getAttribute('src'));

// Data
console.log(logo.dataset.versionNumber);
*/

/*
const h1 = document.querySelector('h1');
const alertH1 = function(e) {
  alert('addEvenlistenehfuefdjebde');

  // h1.removeEventListener('mouseenter', alertH1);
}

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000)

// Bubling
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`
console.log(randomColor());

document.querySelectorAll('.nav__link').forEach(link => {
  return link.addEventListener('click', function(e) {
    this.style.backgroundColor = randomColor()
    console.log(e.target, e.currentTarget);

    //
    // e.stopPropagation()
  })
})

document.querySelector('.nav__links').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor()
})

document.querySelector('.nav').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor()
})



const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.firstElementChild);

// Going upwards: parents

// console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways: sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(el => {
  if (el !== h1) {}
})
*/

// document.addEventListener('DOMContentLoaded', function(e) {
//   console.log('nwknkdwndk', e);
// });

// window.addEventListener('load', function(e) {
//   console.log('ndndndw', e);
// })

// window.addEventListener('beforeunload', function(e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
