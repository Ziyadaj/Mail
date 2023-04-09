# Mail

This is a single-page email client implemented using JavaScript, HTML, and CSS. The main file is inbox.js which contains the implementation of the email client.

The following requirements were fulfilled:

## Send Mail

When a user submits the email composition form, the email is sent using a POST request to /emails with values for recipients, subject, and body. After the email has been sent, the user's sent mailbox is loaded.

## Mailbox

When a user visits their Inbox, Sent mailbox, or Archive, the appropriate mailbox is loaded using a GET request to /emails/<mailbox> to request the emails for a particular mailbox. The name of the mailbox appears at the top of the page. Each email is rendered in its own box (<div> with a border) displaying who the email is from, what the subject line is, and the timestamp of the email. If the email is unread, it appears with a white background, otherwise, it appears with a gray background.

## View Email

When a user clicks on an email, the user is taken to a view where they see the content of that email. The email's sender, recipients, subject, timestamp, and body are shown. The email is marked as read after it has been clicked on.

## Archive and Unarchive

Users can archive and unarchive emails that they have received. When viewing an Inbox email, the user is presented with a button that lets them archive the email. When viewing an Archive email, the user is presented with a button that lets them unarchive the email. Once an email has been archived or unarchived, the user's inbox is loaded.

## Reply

Users can reply to an email. When viewing an email, the user is presented with a “Reply” button that lets them reply to the email. Clicking the “Reply” button takes the user to the email composition form. The recipient field is pre-filled with whoever sent the original email. The subject line is pre-filled with "Re: " plus the original subject line (if it doesn't already start with "Re: "). The body of the email is pre-filled with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:" followed by the original text of the email.
