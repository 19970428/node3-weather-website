console.log('Client side js is loaded!')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message-1') 
const message2 = document.querySelector('#message-2')


//As we dont want to refresh the page when button is clicked. instead we want the below callback to call.
weatherForm.addEventListener('submit',(event)=>{
    message1.textContent='Loading...'
    message2.textContent=''
    event.preventDefault() //this will not refresh the page
    const location = search.value
    fetch('/weather?address='+location).then((response)=>{
    response.json().then((data)=>{
        if(data.error)
        {
            console.log(data.error)
            message1.textContent = data.error
            message2.textContent =''
        }
        else
        {
            console.log(data.location)
            console.log(data.forecast)
            message1.textContent=data.location
            message2.textContent = data.forecast
        }
    })
    
})
})