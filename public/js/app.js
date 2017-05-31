console.log('crazy app.js');

const app = angular.module('CrazyApp', []);
var url = '';

if(window.location.origin == "http://localhost:8000") {
  url = "http://localhost:3000";
}
else {
  url = "https://crazies-backend.herokuapp.com";
}
app.controller('MainController', ['$http', function($http){
   this.test="hi";
   this.showHomePage = false;
   this.showBuildsPage = false;
   this.showLoginPage = true;
   this.showChatPage = false;
   this.showProfilePage = false;
   this.showUserUpdate = false;

   this.toggleLoginForm = true;
   this.toggleRegForm = false;
   this.toggleUpcomingBuilds = true;
   this.togglePreviousBuilds = false;
   this.toggleAddBuildForm = false;

   this.regFormData = {};
   this.builds = [];
   this.user = {};
   this.users = [];
   this.posts = [];

// ---------------------------------
// ******* START PAGE NAVIGATION ******
// ---------------------------------
   this.clearScreen = function(){
      this.showHomePage = false;
      this.showBuildsPage = false;
      this.showLoginPage = false;
      this.showChatPage = false;
      this.showProfilePage = false;
      this.showTo5mPage = false;
   };
   this.loadRegForm = function(){
      this.toggleLoginForm = false;
      this.toggleRegForm = true;
   };
   this.loadLoginForm = function(){
      this.toggleLoginForm = true;
      this.toggleRegForm = false;
   };
// ---------------------------------
// ****** END PAGE NAVIGATION ******
// ---------------------------------



// ---------------------------------
// ****** USERS ******
// ---------------------------------
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
         this.login(response.data);
      }.bind(this));
   };

   // THIS USER INFORMATION
   this.login = function(userPass) {
      console.log(userPass);
      $http({
         method: 'POST',
         url: url + '/users/login',
         data: { user: { username: userPass.username, password: userPass.password }},
      }).then(function(response) {
         console.log(response);
         this.user = response.data.user;
         this.clearScreen();
         this.showHomePage = true;
      }.bind(this));
   };

// UPDATE USER INFO
this.userUpdate = function(data){
   console.log(data);
   $http({
      method: 'PUT',
      url: url + '/users/' + this.user.id,
      data: { user: { username: data.username, password: data.password }}
   }).then(function(response){
      console.log(response);
      this.findAllUsers();
      this.showUserUpdate = false;
   }.bind(this));
};

// DELETE SELECTED USER
   this.deleteThisUser = function(person){
      console.log(person);
      $http({
         method: 'DELETE',
         url: url + '/users/' + person.id
      }).then(function(response){
         console.log(response);
         this.findAllUsers();
      }.bind(this));
   };
   // FIND ALL USERS
   this.findAllUsers = function(){
      $http({
         method: "GET",
         url: url + '/users'
      }).then(function(response){
         this.users = response.data;
         console.log(this.users);
      }.bind(this));
   };
   this.findAllUsers();
// ---------------------------------
// ****** END USERS ******
// ---------------------------------


// ---------------------------------
// ****** BUILDS ******
// ---------------------------------
   this.findBuilds = function(){
      $http({
         method:"GET",
         url: url + '/builds',
      }).then(function(response){
         console.log(response);
         this.builds = response.data;
      }.bind(this));
   };
   this.findBuilds();

   this.addNewBuild = function(newBuildFormData){
      console.log(newBuildFormData);
      $http({
         method: "POST",
         url: url + '/builds',
         data: newBuildFormData
      }).then(function(response){
         console.log(response);
         this.findBuilds();
         this.toggleAddBuildForm = false;
      }.bind(this));
   };

   this.updateBuild = function(data, build){
      console.log(data);
      console.log(build);
      $http({
         method: "PUT",
         url: url + '/builds/' + build.id,
         data: data
      }).then(function(response){
         console.log(response);
         this.toggleUpdateBuildForm = false;
         this.findBuilds();
      }.bind(this));
   };

   this.deleteThisBuild = function(thisBuild){
      $http({
         method: 'DELETE',
         url: url + '/builds/' + thisBuild.id
      }).then(function(response){
         console.log(response);
         this.findBuilds();
      }.bind(this));
   };

// ---------------------------------
// ****** END BUILDS ******
// ---------------------------------

// ---------------------------------
// ****** POSTS ******
// ---------------------------------
   this.findPosts = function(){
      $http({
         method: 'GET',
         url: url + '/posts'
      }).then(function(response){
         console.log(response);
         this.posts = response.data;
      }.bind(this));
   };
   this.findPosts();

   this.createPost = function(newPostFormData, currentUser){
      console.log(newPostFormData);
      console.log(currentUser.id);
      $http({
         method: 'POST',
         url: url + '/posts',
         headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
         },
         data: {
            post:{
               title: newPostFormData.title,
               comment: newPostFormData.comment,
               user_id: currentUser.id
            }
         }
      }).then(function(response){
         console.log(response);
         this.findPosts();
      }.bind(this));
   };

   this.deleteThisPost = function(thisPost){
      $http({
         method: 'DELETE',
         url: url + '/posts/' + thisPost.id
      }).then(function(response){
         this.findPosts();
      }.bind(this));
   };

   this.updateThisPost = function(thisPost, post){
      console.log(thisPost);
      $http({
         method: 'PUT',
         url: url + '/posts/' + post.id,
         data: thisPost
      }).then(function(response){
         console.log(response);
         this.togglePostUpdate = false;
         this.findPosts();
      }.bind(this));
   };

// ---------------------------------
// ****** END POSTS ******
// ---------------------------------

}]);
