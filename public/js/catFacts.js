const factSpan = document.querySelector('#fact')
const button = document.querySelector('.root#page3 #cat-facts-container button')
button.addEventListener('click', e => {
    if (!button.classList.contains('disabled')) {
        console.log
        fetch('https://meowfacts.herokuapp.com/')
            .then(resp => {
                factSpan.textContent = ''
                factSpan.classList.add('loader')
                button.classList.add('disabled')
                if (resp.status != 200) {
                    factSpan.classList.remove('loader')
                    button.classList.remove('disabled')
                    factSpan.textContent = 'Error('
                    throw new Error(`Fetch failed with code ${resp.status}`)
                }
                else {
                    factSpan.classList.remove('loader')
                    button.classList.remove('disabled')
                    return resp.json()
                }
            })
            .then(json => {
                factSpan.textContent = json.data[0]
            })
    }
})
