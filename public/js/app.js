console.log('crazy app.js');

const app = angular.module('CrazyApp', []);

const url= "http://localhost:3000";

app.controller('MainController', ['$http', function($http){
   this.test="hi"
   this.showHomePage = false;
   this.showBuildsPage = false;
   this.showLoginPage = true;

   this.toggleLoginForm = true;
   this.toggleRegForm = false;
   this.builds = [];
   this.user = {};

   this.clearScreen = function(){
      this.showHomePage = false;
      this.showBuildsPage = false;
      this.showLoginPage = false;
   };
   this.loadRegForm = function(){
      this.toggleLoginForm = false;
      this.toggleRegForm = true;
   };
   this.loadLoginForm = function(){
      this.toggleLoginForm = true;
      this.toggleRegForm = false;
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
      this.builds = response.data
   }.bind(this));

}]);
