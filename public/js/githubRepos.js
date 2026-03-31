const tBody = document.querySelector('#repo-table tbody')
const GITHUB_TOKEN = __GIT_TOKEN__;
fetch('https://api.github.com/users/Desocseronit/repos?sort=updated', {
    headers: {
        'Authorization': `token ${GITHUB_TOKEN}`
    }
})
.then(resp => {
    if(resp.status != 200){
        tBody.querySelector('td').textContent = 'Error('
        throw new Error(`Fetch failed with code ${resp.status}`)
    }
    else return resp.json()
    
})
.then(arr => {tBody.innerHTML = '';
    for(let i = 0; i < arr.length; i++){
        drawNewRow(arr[i])
    }
})


function drawNewRow(json){
    console.log(json)
    let tr = document.createElement('tr')
    for(let i = 0; i < 2; i++){
        let cell = tr.insertCell()
        if(i == 0) cell.textContent = json.name
        else {
            let a = document.createElement('a')
            console.log(json.html_url)
            a.href = json.html_url
            a.textContent = 'Link'
            cell.appendChild(a)
        }
    }
    console.log(tr.innerHTML)
    tBody.appendChild(tr)
}