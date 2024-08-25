// creating the express server
const express = require('express'); 
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// initializ submitted Data Array
let submittedData = [];

// html form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// submit button
app.post('/submit', (req, res) => {
  const username = req.body.username;
  const chosenanimal = req.body.chosenanimal;

  // adding data ti array
  submittedData.push({ id: submittedData.length + 1, username, chosenanimal });

  res.redirect('/submissions');
});

// display data submitted
app.get('/submissions', (req, res) => {
  let submissionsHTML = submittedData.map((submission) => `
    <p><strong>Submission ${submission.id}:</strong> ${submission.username} - ${submission.chosenanimal}</p>
    <form action="/edit/${submission.id}" method="get" style="display:inline;">
      <button type="submit">Edit</button>
    </form>
    <form action="/delete/${submission.id}" method="post" style="display:inline;">
      <button type="submit">Delete</button>
    </form>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>All Submissions</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f4f4f4;
                color: #333;
                padding: 20px;
            }
            h1 {
                color: #444;
                font-size: 2em;
            }
            p {
                font-size: 1.5em;
            }
            button {
                background-color: #5cb85c;
                color: white;
                padding: 10px;
                border: none;
                cursor: pointer;
                border-radius: 4px;
                margin-top: 10px;
            }
            button:hover {
                background-color: #4cae4c;
            }
        </style>
    </head>
    <body>
        </i>All Submissions</h1>
        ${submissionsHTML}
        <button onclick="window.location.href='/'"></i>Go Back</button>
    </body>
    </html>
  `);
});

// delete button
app.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);

    for (let i = 0; i < submittedData.length; i++) {
      if (submittedData[i].id === id) {
        submittedData.splice(i, 1);
        break;
      }
    }

    res.redirect('/submissions');
  });

// edit button
app.get('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const submission = submittedData.find(submission => submission.id === id);

  if (!submission) {
    return res.status(404).send('Submission not found');
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Edit Submission</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f4f4f4;
                color: #333;
                padding: 20px;
            }
            h1 {
                color: #444;
            }
            form {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            input, select {
                display: block;
                margin: 10px 0;
                padding: 10px;
                width: 100%;
                font-size: 1em;
                border-radius: 4px;
                border: 1px solid #ccc;
            }
            button {
                background-color: #5cb85c;
                color: white;
                padding: 10px;
                border: none;
                cursor: pointer;
                border-radius: 4px;
                margin-top: 10px;
            }
            button:hover {
                background-color: #4cae4c;
            }
        </style>
    </head>
    <body>
        <h1>Edit Submission ${id}</h1>
        <form action="/edit/${id}" method="post">
            <input type="text" name="username" value="${submission.username}" required>
            <select name="chosenanimal">
                <option value="lion" ${submission.chosenanimal === 'lion' ? 'selected' : ''}>Lion</option>
                <option value="elephant" ${submission.chosenanimal === 'elephant' ? 'selected' : ''}>Elephant</option>
                <option value="tiger" ${submission.chosenanimal === 'tiger' ? 'selected' : ''}>Tiger</option>
                <option value="giraffe" ${submission.chosenanimal === 'giraffe' ? 'selected' : ''}>Giraffe</option>
                <option value="monkey" ${submission.chosenanimal === 'monkey' ? 'selected' : ''}>Monkey</option>
            </select>
            <button type="submit"></i>Save</button>
        </form>
        <button onclick="window.location.href='/submissions'">Cancel</button>
    </body>
    </html>
  `);
});

// saving post edit data
app.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const submissionIndex = submittedData.findIndex(submission => submission.id === id);

  if (submissionIndex === -1) {
    return res.status(404).send('Submission not found');
  }

  submittedData[submissionIndex].username = req.body.username;
  submittedData[submissionIndex].chosenanimal = req.body.chosenanimal;

  res.redirect('/submissions');
});

// listening port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});