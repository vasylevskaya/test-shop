/* mock data */
const data = {
  movies: [
    {
      id: "46491083440459",
      availableDays: [
        {
          day: "10/04",
          seances: [
            {
              id: "id1",
              time: "10",
              reserved: [0, 1, 5, 8, 15, 19]
            },
            {
              id: "id2",
              time: "16",
              reserved: [1, 6, 8, 10, 18, 19]
            },
            {
              id: "id3",
              time: "18",
              reserved: [0, 1, 4, 8, 12, 18, 19]
            }
          ]
        },
        {
          day: "11/04",
          seances: [
            {
              id: "id4",
              time: "12",
              reserved: [10, 18, 19]
            }
          ]
        },
        {
          day: "13/04",
          seances: [
            {
              id: "id5",
              time: "14",
              reserved: [1, 2, 5, 10, 18, 17, 20]
            }
          ]
        },
        {
          day: "15/04",
          time: "18",
          seances: [
            {
              id: "id6",
              time: "14",
              reserved: [1, 2, 5, 6, 8, 9, 10]
            }
          ]
        }
      ]
    },
    {
      id: "46491088093515",
      availableDays: [
        {
          day: "10/04",
          seances: [
            {
              id: "id7",
              time: "10",
              reserved: [1, 5, 8, 15, 19]
            },
            {
              id: "id8",
              time: "16",
              reserved: [1, 6, 8, 10, 18, 19]
            }
          ]
        },
        {
          day: "12/04",
          seances: [
            {
              id: "id9",
              time: "12",
              reserved: [10, 18, 19]
            }
          ]
        },
        {
          day: "14/04",
          seances: [
            {
              id: "id10",
              time: "14",
              reserved: [1, 2, 5, 10, 18, 17, 20]
            }
          ]
        },
        {
          day: "15/04",
          time: "18",
          seances: [
            {
              id: "id11",
              time: "14",
              reserved: [1, 2, 5, 6, 8, 9, 10]
            }
          ]
        }
      ]
    },
    {
      id: "46491085046091",
      availableDays: [
        {
          day: "10/04",
          seances: [
            {
              id: "id12",
              time: "10",
              reserved: [1, 5, 8, 15, 19]
            },
            {
              id: "id13",
              time: "16",
              reserved: [1, 6, 8, 10, 18, 19]
            }
          ]
        },
        {
          day: "11/04",
          seances: [
            {
              id: "id14",
              time: "12",
              reserved: [10, 18, 19]
            }
          ]
        },
        {
          day: "16/04",
          seances: [
            {
              id: "id15",
              time: "14",
              reserved: [1, 2, 5, 10, 18, 17, 20]
            }
          ]
        },
        {
          day: "17/04",
          time: "18",
          seances: [
            {
              id: "id16",
              time: "14",
              reserved: [1, 2, 5, 6, 8, 9, 10]
            }
          ]
        }
      ]
    }
  ]
}

const getMovieById = (productId) => {
  return data.movies.find((movie) => movie.id == productId)
}

const checkAvailableDays = (productId) => {
  console.log(productId)
  const { availableDays } = getMovieById(productId)
  const selectDay = document.querySelector("#tickets-pop-up_select-day")
  const ticketsPopUp = document.querySelector("#tickets-pop-up")

  ticketsPopUp.classList.remove("hidden")
  selectDay.setAttribute("product-id", productId)
  selectDay.innerHTML = '<option> - </option>'

  if (availableDays) {
    availableDays.forEach((availableDay) => {
      selectDay.innerHTML += `<option>${availableDay.day}</option>`
    })
  }
}

const handleDayChange = (event) => {
  const productId = event.target.getAttribute("product-id")
  const selectTime = document.querySelector("#tickets-pop-up_select-time")
  const chosenDay = event.target.value
  const { seances } = getMovieById(productId).availableDays.find((availableDay) => availableDay.day == chosenDay)

  selectTime.innerHTML = ""

  if (seances) {
    seances.forEach((seance) => {
      selectTime.innerHTML += `<option value="${seance.id}">${seance.time}</option>`
    })
  }
}

const checkSeats = (event) => {
  event.preventDefault()
  const seanceId = event.target.elements["time"].value
  const chosenDay = event.target.elements["day"].value
  const productId = event.target.elements["day"].getAttribute("product-id")
  
  if (seanceId && productId && chosenDay) {
    const chosenSeance = getMovieById(productId).availableDays
      .find((availableDay) => availableDay.day == chosenDay).seances
      .find((seance) => seance.id == seanceId)
    const allSeats = Array.from(document.getElementsByClassName("tickets-pop-up_seats_input"))
    const reservedSeats = chosenSeance.reserved

    allSeats.forEach((seat, index) => {
      const seatIsReservedAlready = reservedSeats.filter((seat) => seat == index).length
      seat.disabled = seatIsReservedAlready
    })
  }
}

function addToCart(productId, quantity) {
  let formData = {
    'items': [
      {
        /* replace with el.dataset.variant_id to choose the first available variant */
        'id': productId,
        'quantity': quantity
      }
    ]
  };
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then((resp) => {
    return resp.json();
  })
  .then((data) => {
    document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
    bubbles: true
  }));
  })
  .catch((err) => {
    console.error('Error: ' + err);
  })
}

const closeTicketsPopup = () => {
  const ticketsPopUp = document.querySelector("#tickets-pop-up")
  ticketsPopUp.classList.add("hidden")
}

const buyTickets = () => {
  const reservedSeats = document.querySelectorAll(".tickets-pop-up_seats_input:checked")
  const ticketsQuantity = reservedSeats.length
  const errorMessage = document.querySelector(".tickets-pop-up_error")

  /* if no error add to cart, otherwise show error message */
  if (ticketsQuantity && ticketsQuantity < 5) {
    const productId = document.querySelector("#tickets-pop-up_select-day").getAttribute("product-id")
    errorMessage.classList.add("hidden")
    addToCart(productId, ticketsQuantity)
    closeTicketsPopup()
  } else {
    errorMessage.classList.remove("hidden")
  }
}