const pageButtons = document.querySelectorAll('header #tabs div')

pageButtons.forEach(button => {
    button.addEventListener('click' , e=>{
        document.querySelector('.root.show').classList.remove('show')
        document.querySelector(`#${e.target.dataset.target}`).classList.add('show')
    })
})