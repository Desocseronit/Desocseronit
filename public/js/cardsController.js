const cards = document.querySelectorAll('.card')

cards.forEach(card => {
    card.addEventListener('click' , e => {
        console.log(e.target.closest('.card'))
        e.target.closest('.card').classList.toggle('show')
        e.target.closest('.card').classList.toggle('hide')
    })
})