const showMenuBtn = document.querySelector('.showMenuBtn');
const hideMenuBtn = document.querySelector('.hideMenuBtn');
const walletAddress = document.querySelector('.address');
const addressContainer = document.querySelector('.addressContainer');
const searchBtn = document.querySelector('.searchBtn');
const navDiv = document.querySelector('.navDiv');
const lxpBalance = document.querySelector('.lxpBalance');
const errorContainer = document.querySelector('.errorContainer');
const errorMsg = document.querySelector('.errorMsg');
const errorClose = document.querySelector('.errorClose');
const lxpHistory = document.querySelector('.lxpHistory');
let errorState = 0;
const regex = /^(0x)?[0-9a-fA-F]{40}$/;
let lxp = 0;
let userHistory = '';
const dataAPI = './netlify/functions/getLXP.js';
const historyAPI = './netlify/functions/getHistory.js';

function showMenu(){
    showMenuBtn.classList.add('hidden');
    hideMenuBtn.classList.remove('hidden');
    navDiv.classList.remove('hidden');
}
function hideMenu(){
    showMenuBtn.classList.remove('hidden');
    hideMenuBtn.classList.add('hidden');
    navDiv.classList.add('hidden');
}

errorClose.addEventListener('click', () => { // close error message
    errorContainer.style.transform='translateY(-250%)';
    errorContainer.style.filter='opacity(0)';
  })
  walletAddress.addEventListener('keypress',(e)=>{ // call main fetch func. when enter is pressed
    if(e.key === 'Enter'){
        searchBtn.click();
    }
  })

searchBtn.addEventListener('click',()=>{
    const walletAdd = walletAddress.value.trim();
      if (!walletAdd) {
        callError('Invalid wallet address!');
        console.log('err')
        return;
      } else if (regex.test(walletAdd)) {
        console.log('calling fetchData()')
          fetchData();
      }
   else {
    callError('Invalid wallet address!')
  }});

async function fetchData(){
    const walletAdd = walletAddress.value.trim();
    const encodedAddress = encodeURIComponent(walletAdd);

    await fetch(`/.netlify/functions/getLXP?addr=${encodedAddress}`).then(resp=>resp.json()).then(data=>{
        console.log(data)
        lxpBalance.textContent=(data.result/10**18).toFixed();
    }).catch(err=>console.log(err));

    await fetch(`/.netlify/functions/getHistory?addr=${encodedAddress}`).then(resp=>resp.json()).then(data=>console.log("Historical Data: ",data)).catch(err=>console.log(err));
};

function callError(e){  // show error message
    errorState = 1;
    // errorMsg.textContent=e;
    // errorContainer.classList.remove('hidden');
    // errorContainer.style.transform='translateY(0)';
    // errorContainer.style.filter='opacity(1)';
    addressContainer.style.border = "2px solid var(--red)";
    walletAddress.placeholder = "Invalid Wallet address!";
}
walletAddress.addEventListener('input',()=>{
    if(errorState!=0){
        errorState=0;
        addressContainer.style.border="2px white solid";
        walletAddress.placeholder = "Enter wallet address";
    };
})