document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form')
  const table = document.querySelector('table')
  let allDogs
  let currentDog

  function fetchDogs () {
    fetch('http://localhost:3000/dogs')
      .then(resp => resp.json())
      .then(data => {
        allDogs = data
        showDoginTable(allDogs)
      })
  }
  fetchDogs()

  function showDoginTable (dogs) {
    dogs.forEach((dog) => {
      const tableRow = document.createElement('tr')
      tableRow.innerHTML =
      `
      <tr id="dog-${dog.id}">
      <td id="dog-${dog.id}-name">${dog.name}</td>
      <td id="dog-${dog.id}-breed">${dog.breed}</td>
      <td id="dog-${dog.id}-sex">${dog.sex}</td>
      <td id="dog-${dog.id}-edit-button"><button>Edit</button></td>
      </tr>
      `
      table.append(tableRow)
    })
  }

  table.addEventListener('click', event => {
    if (event.target.innerText === 'Edit') {
      dogRow = event.target.parentNode.parentNode
      currentDog = allDogs[
        [...dogRow.parentNode.children].indexOf(dogRow) - 2
      ]
      editDog(dogRow)
    }
  })

  function editDog (dogRow) {
    form.name.value = dogRow.querySelectorAll('td')[0].innerText
    form.breed.value = dogRow.querySelectorAll('td')[1].innerText
    form.sex.value = dogRow.querySelectorAll('td')[2].innerText
  }

  form.addEventListener('submit', event => {
    event.preventDefault()
    document.querySelector(`#dog-${currentDog.id}-name`).innerText = form.name.value
    document.querySelector(`#dog-${currentDog.id}-breed`).innerText = form.breed.value
    document.querySelector(`#dog-${currentDog.id}-sex`).innerText = form.sex.value

    fetch(`http://localhost:3000/dogs/${currentDog.id}`,
      {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: form.name.value,
          breed: form.breed.value,
          sex: form.sex.value
        })
      }
    )
  })
})
