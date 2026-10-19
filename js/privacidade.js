document.getElementById('reset-consent').addEventListener('click',function(){try{localStorage.removeItem('nd-consent')}catch(e){}location.reload()});
