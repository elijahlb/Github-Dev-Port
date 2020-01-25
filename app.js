const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");


function buildProfile() {

  inquirer
    .prompt([
      {
      message: "Enter your GitHub username",
      name: "username"
    },
    {
      message: "Enter a background color",
      name: "color"
    }
  ]).then(result => {
    const userInput = result;
    userData(userInput);
  });
  
  function userData (userInput) {
    const {username} = userInput;
          const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
          axios.get(queryUrl).then(function(data) {
            let stars = 0;
              for(let i=0; i < data.data.length; i++){
                let count = data.data[i].stargazers_count;
              //    console.log(count);
              }
              getUserProfile(userInput, stars);
          });
      }
  
  function getUserProfile(userInput, stars) {
    const userColor = userInput.color;
    const gitUser = userInput.username;
    const githubUrlRequest = `https://api.github.com/users/${gitUser}`; 
    axios.get(githubUrlRequest)
      .then(function (data) {
        let profileData = data.data
         console.log(profileData);
        let followers = data.data.followers;
        let location = data.data.location;
        let image = data.data.avatar_url;
        let html = 
          `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            <title>Generated Profile</title>
            <style>
               body {
                 background-color:${userColor};
               }
               #header {
                text-align: center;
               }
            </style>
          </head>
          <body>
          
            <div class="jumbotron" id="header">
              <div class="row">
                 <h1> Developer Profile </h1> 
              </div>
            </div>
            <div class='container'>
              <div class='row'>
                  <div class='col-md-6'>
                    <img src='${image}' />
                  </div>
                  <div class='col-md-6'>
                        <p>Username: ${gitUser}</p>
                        <p>Followers: ${followers}</p>
                        <p>Location: ${location}</p>
                  </div>
              </div>
            </div>
          </body>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
          </html>`;
        
        
        fs.writeFile('new.html', html, (err) => {
          if (err) {
            console.error(err)
          } else {
            console.log("Success!")
          }
          
        });
      })
      .catch(function (error) {
          console.log(error)
      });

      
      
    } 

   

}
  
  buildProfile();
  
  
