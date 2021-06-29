const eventIdInput = document.getElementById('event-id-input');
const eventDateInput = document.getElementById('event-date-input');
const formDiv = document.getElementById('form-div');
const formErrorMsg = document.getElementById('form-error-msg');
const eventIdHeader = document.getElementById('event-id-header');
const timeslotTable = document.getElementById('timeslot-table');
const updateBtn = document.getElementById('update-btn');

const BACKEND_API_URI = 'http://127.0.0.1:4000/api';
//const BACKEND_API_URI = 'https://bkm-ticketure-timeslots.herokuapp.com/api';

updateBtn.addEventListener('click', event => {
  timeslotTable.innerHTML = '';
  formDiv.classList.remove('warning');

  try {
    if (!eventIdInput.value) {
      throw new Error('Enter an event ID.');
    }

    if (!eventDateInput.value) {
      throw new Error('Choose an event date.');
    }
  } catch (err) {
    eventIdHeader.innerText = null;
    formErrorMsg.innerText = err;
    formDiv.classList.add('warning');
    return;
  }

  fetch(`${BACKEND_API_URI}/timeslots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventId: eventIdInput.value,
      eventDate: eventDateInput.value
    })
  })
    .then(response => response.json())
    .then(event => {
      eventIdHeader.innerText = `${event.name}`;

      if (event.timeslots.length === 0) {
        timeslotTable.innerHTML = `
          <tr><td colspan="8" style="text-align:center">No Timeslot Data Found</td></tr>
        `;
      }

      event.timeslots.forEach(timeslot => {
        timeslotTable.innerHTML += `
          <tr>
            <td>
              ${new Date(timeslot.start_datetime).toLocaleDateString('en-us')}
              -
              ${Intl.DateTimeFormat('en', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              }).format(new Date(timeslot.start_datetime))}
            </td>
            <td>
              ${timeslot.sold_quantity}
            </td>
            <td>
              ${timeslot.used_capacity}
            </td>
            <td>
              ${timeslot.capacity}
            </td>
            <td class="${timeslot.sold_out ? 'negative' : 'positive'}">
              ${timeslot.sold_out ? 'Yes' : 'No'}
            </td>
            <td>
              ${timeslot.oversell_capacity}
            </td>
            <td class="${timeslot.oversold_out ? 'negative' : 'positive'}">
              ${timeslot.oversold_out ? 'Yes' : 'No'}
            </td>
            <td>
              ${timeslot.redeemed_count}
            </td>
          </tr>
      `;
      });
    })
    .catch(err => {
      formErrorMsg.innerText =
        'There was an error with the request.  Check Chrome DevTools for more info.';
      formDiv.classList.add('warning');
      console.log(err);
    });
});
