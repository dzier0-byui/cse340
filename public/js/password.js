const pswrdBtn =  document.querySelector('#pswrdBtn');
pswrdBtn.addEventListener('click', function() {
    const pswrdInput = document.getElementById("passwordInput");
    const type = pswrdInput.getAttribute("type");
    if (type == "password") {
        pswrdInput.setAttribute("type", "text");
        pswrdBtn.innerHTML = "Hide Password";
    } else {
        pswrdInput.setAttribute("type", "password");
        pswrdBtn.innerHTML = "Show Password";
    }
})