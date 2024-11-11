const showMenuBtn = document.querySelector('.showMenuBtn');
const hideMenuBtn = document.querySelector('.hideMenuBtn');
const navDiv = document.querySelector('.navDiv');

function showMenu(){
    console.log('called show menu');
    showMenuBtn.classList.add('hidden');
    hideMenuBtn.classList.remove('hidden');
    navDiv.classList.remove('hidden');
}
function hideMenu(){
    console.log('called hide menu');
    showMenuBtn.classList.remove('hidden');
    hideMenuBtn.classList.add('hidden');
    navDiv.classList.add('hidden');
}
