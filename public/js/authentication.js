require(['js/request.js'], () => {

    const loginForm = document.getElementById('login-form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    loginForm.addEventListener('submit', event => {
        event.preventDefault(); 
    
        // TODO check form validity
        
    
        // TODO check user
        makeRequest('GET', `/user_exists`, username.value).then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err);
        });
    
    
        // TODO authenticate user
        
    
    });

})





