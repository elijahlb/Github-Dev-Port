const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const convertFactory = require("electron-html-to");
const electron = require("electron");


function pdfGen(data) {

var conversion = convertFactory({
  converterPath: convertFactory.converters.PDF,
});
conversion({html: data}, function(err, result){
  if (err) {
      return console.error(err);
    }

    console.log(result.numberOfPages);
    console.log(result.logs);
  result.stream.pipe(fs.createWriteStream('Documents/Bootcamp2019/homework/github-dev-port/profile.pdf'));
  conversion.kill();
})

}


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
      //   console.log(profileData);
        let followers = data.data.followers;
        let location = data.data.location;
        let image = data.data.avatar_url;
        let repos = data.data.public_repos;
        let bio = data.data.bio;
        let blog = data.data.blog;
        let html = 
          `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link href="https://fonts.googleapis.com/css?family=Courier+Prime&display=swap" rel="stylesheet"> 
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            <title>Generated Profile</title>
            <style>
               body {
                 background-color:${userColor};
               }
               #header {
                text-align: center;
               }
               p {
                font-family: 'Courier Prime', monospace;
                font-weight:bold;
               }
               img {
                 margin-top:50px;
                 margin-bottom:50px;
                 border: 2px solid black;
               }
               a {
                 font-weight:bold;
                 text-decoration:none;
                 color:black;
               }
            </style>
          </head>
          <body>
          
           
            <div class='container'>
              <div class='row'>
                  <div class='col-md-12 text-center'>
                    <img src='${image}' />
                  </div>
              </div>
              <div class='row'>
                  <div class='col-md-12 text-center'>
                        <a href="https://github.com/${gitUser}"><p>Username: ${gitUser}</p></a>
                        <p>Bio: ${bio}</p>
                        <a href="https://www.google.com/maps/search/?api=1${location}"><p>Location: ${location}</p></a>
                        <p>Followers: ${followers}</p>
                        <p>Repositories: ${repos}</p>
                        <p>Blog: ${blog}</p>
                  </div>
              </div>
            </div>
          </body>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
          </html>`;

        pdfGen(html);
        
        
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
  
  
