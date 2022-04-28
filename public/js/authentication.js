import makeRequest from './request';

const loginForm = document.getElementById('login-form');
const username = document.getElementById('username');
const password = document.getElementById('password');

loginForm.addEventListener('submit', event => {
    event.preventDefault(); 

    // TODO check form validity
    

    // TODO check user
    var checkUser = new XMLHttpRequest();
    checkUser.open('GET', `${process.env.SERVER_HOST}/user_exists`); 


    // TODO authenticate user
    

});



