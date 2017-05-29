console.log('crazy app.js');

const app = angular.module('CrazyApp', []);

const url= "http://localhost:3000";

app.controller('MainController', ['$http', function($http){
   this.test="hi";
   this.showHomePage = false;
   this.showBuildsPage = false;
   this.showLoginPage = true;
   this.showChatPage = false;

   this.toggleLoginForm = true;
   this.toggleRegForm = false;
   this.toggleUpcomingBuilds = true;
   this.togglePreviousBuilds = false;

   this.regFormData = {};
   this.builds = [];
   this.user = {};

   this.clearScreen = function(){
      this.showHomePage = false;
      this.showBuildsPage = false;
      this.showLoginPage = false;
      this.showChatPage = false;
   };
   this.loadRegForm = function(){
      this.toggleLoginForm = false;
      this.toggleRegForm = true;
   };
   this.loadLoginForm = function(){
      this.toggleLoginForm = true;
      this.toggleRegForm = false;
   };

   // Registration form -- needs to sign in after creation
   this.register = function(){
      console.log("regFormData ",this.regformdata);
      $http({
         method: 'POST',
         url: url + '/users',
         data: {
            user:{
               username: this.regformdata.username,
               password: this.regformdata.password
            }
         }
      }).then(function(response){
         console.log(response);
      }.bind(this));
   };

   // USER INFORMATION
   this.login = function(userPass) {
      console.log(userPass);

      $http({
         method: 'POST',
         url: url + '/users/login',
         data: { user: { username: userPass.username, password: userPass.password }},
      }).then(function(response) {
         console.log(response);
         this.user = response.data.user;
      }.bind(this));
   };


   $http({
      method:"GET",
      url: url + '/builds',
   }).then(function(response){
      console.log(response);
      this.builds = response.data;
   }.bind(this));

}]);
