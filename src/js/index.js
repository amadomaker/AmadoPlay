/*=== MOBILE BURGER ===*/
const burger=document.querySelector('.mobile-menu-toggle');
burger.addEventListener('click',()=>{
  document.body.classList.toggle('menu-open');
});

/*=== FECHA DROPDOWN NO TOUCH ===*/
document.querySelectorAll('.nav-item > .nav-link').forEach(link=>{
  link.addEventListener('click',e=>{
    if(window.innerWidth<=768){
      e.currentTarget.parentElement.classList.toggle('open');
    }
  });
});

/*=== KARAOKÊ BUTTON ===*/
document.querySelector('.btn-karaoke')?.addEventListener('click', () => {
  window.open('https://www.youtube.com/channel/UCfwZCL3gq8PaIg_i1VcnocQ', '_blank');
});

// Gera novas bolhas dinamicamente
document.addEventListener('DOMContentLoaded', () => {
  const shapesContainer = document.querySelector('.floating-shapes');
  
  setInterval(() => {
    const shape = document.createElement('div');
    shape.className = 'shape';
    const size = Math.random() * 100 + 40;
    shape.style.width = size + 'px';
    shape.style.height = size + 'px';
    shape.style.left = Math.random() * 100 + '%';
    shape.style.animationDuration = (Math.random() * 15 + 20) + 's';
    shapesContainer.appendChild(shape);
    
    setTimeout(() => {
      if (shapesContainer.contains(shape)) {
        shapesContainer.removeChild(shape);
      }
    }, 35000);
  }, 4000);
});
