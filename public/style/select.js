

function digitou(e){
  sendData(e)
}

function sendData(e){
    let dadosvalue = digitou()
    let searchDiv = document.getElementById('testando');
    let InputText = document.getElementById('InputText')
    console.log(InputText);
    let match = e.value.match(/^d[a-zA-Z]+/)
    // let match = e.value.match(/\s*/)
   
    if(match[0] === InputText.value){
        fetch('book',{
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({payload: e.value})
        }).then(res => res.json()).then(data =>{
          let payload = data.payload;
          console.log(payload)
          searchDiv.innerHTML = '';
          if(payload.lenght < 1){
            searchDiv.innerHTML = '<h1>Sorry. nothing book</h1>'
            return
          }
          payload.forEach((item, index) =>{
            if(index > 1) searchDiv.innerHTML += '<hr>';
            searchDiv.innerHTML += `
            <div class="card-one">
            <div class="card-body-one">
                <h4>${item.NOME}</h4>
                <p>${item.AUTOR}</p>
            </div>
            <div class="card-mid-one">
               <a href="/postagem/${item.AUTOR}">
                     <button>Leia mais</button>
                </a>
            </div>
    
            <div class="card-body-down">
                <h5>${item.categoria.nome}</h5>
                <small>Data de publicação: ${item.categoria.nome}</small>
            </div>
               
          </div>
            
            
            `;
          })
        })
      
    }
   
    searchDiv.innerHTML = 'nao tem'
      
  }


  window.addEventListener('loadeddata', sendData)