const pageButtons = document.querySelectorAll('header #tabs div')
if(localStorage.getItem('currentPage')){
    document.querySelector('.root.show').classList.remove('show')
    document.querySelector(`#${localStorage.getItem('currentPage')}`).classList.add('show')
}

pageButtons.forEach(button => {
    button.addEventListener('click' , e=>{
        document.querySelector('.root.show').classList.remove('show')
        document.querySelector(`#${e.target.dataset.target}`).classList.add('show')
        localStorage.setItem('currentPage' , e.target.dataset.target)
    })
})