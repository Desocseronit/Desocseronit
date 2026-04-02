const factSpan = document.querySelector('#fact')
const button = document.querySelector('.root#page3 #cat-facts-container button')
button.addEventListener('click', e => {
    if (button.classList.contains('disabled')) return;

    button.classList.add('disabled');
    factSpan.textContent = '';
    factSpan.classList.add('loader');

    fetch('https://meowfacts.herokuapp.com/')
        .then(resp => {
            if (!resp.ok) throw new Error(`Error: ${resp.status}`);
            return resp.json();
        })
        .then(json => {
            factSpan.textContent = json.data[0];
        })
        .catch(err => {
            console.error(err);
            factSpan.textContent = 'Error(';
        })
        .finally(() => {
            factSpan.classList.remove('loader');
            button.classList.remove('disabled');
        });
});

