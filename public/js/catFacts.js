const factSpan = document.querySelector('#fact')
document.querySelector('.root#page3 #cat-facts-container button').addEventListener('click', e => {
    fetch('https://meowfacts.herokuapp.com/')
        .then(resp => {
            factSpan.textContent = ''
            factSpan.classList.add('loader')
            if (resp.status != 200) {
                factSpan.classList.remove('loader')
                factSpan.textContent = 'Error('
                throw new Error(`Fetch failed with code ${resp.status}`)
            }
            else {
                factSpan.classList.remove('loader')
                return resp.json()
            }
        })
        .then(json => {
            factSpan.textContent = json.data[0]
        })

})
