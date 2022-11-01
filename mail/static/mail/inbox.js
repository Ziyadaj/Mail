document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = function() {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        if (result.error) {
          alert(result.error);
        }
        else {
        alert(result.message);
        console.log(result);
        load_mailbox('sent');
        }
    });
    return false;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      // ... do something else with emails ...
      emails.forEach(email => {
      const element = document.createElement('div');
      if (mailbox === 'inbox' || mailbox === 'archive') {
          if (email.read) {
            element.innerHTML = 
            `<div class="card bg-light"  id="${email.id}">
              <div class="card-body">
                <b class=card-title>${email.sender}</b> 
                ${email.subject} 
                <p class="card-subtitle text-muted float-right">${email.timestamp}</p>
                <input class="card-img float-right" style="width:35px" type="image" src="static/mail/archive.png" id="archive-input" name="archive-input" value="archive-input">
              </div>
            </div>`;
          }
          else {
            element.innerHTML =
            `<div class="card bg-white" id="${email.id}">
              <div class="card-body">
                <b class=card-title>${email.sender}</b>
                ${email.subject}
                <p class="card-subtitle text-muted float-right">${email.timestamp}</p>
                <input class="card-img float-right" style="width:35px" type="image" src="static/mail/archive.png" id="archive-input" name="archive-input" value="archive-input">
              </div>
            </div>`;
        }
      }
      else if (mailbox === 'sent') {
        element.innerHTML =
        `<div class="card bg-white" id="${email.id}">
          <div class="card-body">
            <b class=card-title>${email.recipients}</b>
            ${email.subject}
            <p class="card-subtitle text-muted float-right">${email.timestamp}</p>
          </div>
        </div>`;
      }
      document.querySelector('#emails-view').append(element);
      var el = element.querySelector('#archive-input');
      console.log(el);
      if (el) {
        el.addEventListener('click', () => {
          if (mailbox === "inbox") {
            archive(email.id);
            load_mailbox('archive');
          }
          else if (mailbox === "archive") {
            unarchive(email.id);
            load_mailbox('inbox');
          }
        });

      }
      element.addEventListener('click', () => {
        read(email.id);
        detail_email(email.id);
      });
    });
  });
  return false;
}

function detail_email(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
      // ... do something else with email ...
      document.querySelector('#email-view').innerHTML = 
      `
          <div class="col">
            <div class="row">
            <b>From:&nbsp </b> ${email.sender}
            </div>

            <div class="row">
            <b>To:&nbsp </b> ${email.recipients} 
            </div>

            <div class="row">
            <b>Subject:&nbsp </b> ${email.subject}
            </div>

            <div class="row">
            <b>Timestamp:&nbsp </b> ${email.timestamp}
            </div>
          </div>
          <hr>
          <pre>${email.body}</pre>
          
      `;
      const element = document.createElement('div');
      element.innerHTML = `<button class="btn btn-sm btn-outline-primary" type="submit">Reply</button>`;
      document.querySelector('#email-view').append(element);

      element.addEventListener('click', () => { 
        compose_email()
        if (email.subject.slice(0, 3) === "Re:") {
          document.querySelector('#compose-subject').value = email.subject;
        }
        document.querySelector('#compose-recipients').value = "Re: " + email.sender;
        document.querySelector('#compose-subject').value = email.subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
      });
  });
}
//regex for validating email from github copilot
function vaildateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
function read(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}
function archive(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  load_mailbox('inbox');
}
function unarchive(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  load_mailbox('inbox');
}