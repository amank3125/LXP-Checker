const showMenuBtn = document.querySelector('.showMenuBtn');
const hideMenuBtn = document.querySelector('.hideMenuBtn');
const walletAddress = document.querySelector('.address');
const addressContainer = document.querySelector('.addressContainer');
const searchBtn = document.querySelector('.searchBtn');
const navDiv = document.querySelector('.navDiv');
const lxpBalance = document.querySelector('.lxpBalance');
const lxpHistory = document.querySelector('.lxpHistory');
const errorContainer = document.querySelector('.errorContainer');
const errorMsg = document.querySelector('.errorMsg');
const errorClose = document.querySelector('.errorClose');
const loader = document.querySelector('.loader');
const shimmerContainer = document.querySelector('.shimmerContainer');
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
function resetValues(){
    lxpHistory.innerHTML = "";
    lxpBalance.textContent = "";
    walletAddress.value = "";
    hideLoaders();
}
function callLoaders(){
    loader.classList.remove('hidden');
    shimmerContainer.classList.remove('hidden');
}
function hideLoaders(){
    loader.classList.add('hidden');
    shimmerContainer.classList.add('hidden');
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
        invalidAddress();
        return;
      } else if (regex.test(walletAdd)) {
        console.log('calling fetchData()')
          fetchData();
      }
   else {
    invalidAddress();
    callError('Invalid wallet address!')
  }});

async function fetchData(){
    callLoaders()
    const walletAdd = walletAddress.value.trim();
    const encodedAddress = encodeURIComponent(walletAdd);

    await fetch(`/.netlify/functions/getLXP?addr=${encodedAddress}`).then(resp=>resp.json()).then(data=>{
        hideLoaders();
        lxpBalance.textContent=(data.result/10**18).toFixed();
    }).catch(err=>{callError(err);console.log(err)});

    await fetch(`/.netlify/functions/getHistory?addr=${encodedAddress}`).then(resp=>resp.json()).then(data=>{
        let dates = [];
        let value = [];
        let txnHash = [];
        lxpHistory.innerHTML = ""
        for(i=0;i<data.result.length;i++){
        // dates.push(data.result[i].timestamp);
        // value.push(data.result[i].value);
        // txnHash.push(data.result[i].hash);
        hideLoaders();
        lxpHistory.innerHTML += `<a href="https://lineascan.build/tx/${data.result[i].hash}" target="_blank"><div class="lxpCard"><p class="lxpCardDate">${new Date(data.result[i].timeStamp*1000).toLocaleDateString()}</p><div class="innerCardDiv"><img class="lxpTokenImg" src="./src/Linea Logos/Logomark Blue BG.png"></img><span class="lxpAmount">${(data.result[i].value/10**18).toFixed()}</span></div></div></a>`;
        }
    }).catch(err=>{callError(err);console.log(err)});
};
function invalidAddress(){
    errorState = 1;
    addressContainer.style.border = "2px solid var(--red)";
    walletAddress.placeholder = "Invalid Wallet address!";
}

function callError(e){  // show error message
    errorMsg.textContent=e;
    errorContainer.classList.remove('hidden');
    errorContainer.style.transform='translateY(0)';
    errorContainer.style.filter='opacity(1)';
}
walletAddress.addEventListener('input',()=>{
    if(errorState!=0){
        errorState=0;
        addressContainer.style.border="2px white solid";
        walletAddress.placeholder = "Enter wallet address";
    };
})