console.log('crazy app.js');

const app = angular.module('CrazyApp', ['ngRoute']);
var url = '';

// myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) { //.config just runs once on load
//     $locationProvider.html5Mode({ enabled: true }); // tell angular to use push state
//
//     $routeProvider.when('/url1', { //when http://localhost:3000/url1
// 	templateUrl: 'partials/home.html', // render http://localhost:3000/partials/partial1.html
// 	controller: 'MainController', // attach controller Ctrl1
// 	controllerAs: 'main' // alias for Ctrl1 (like ng-controller="Ctrl1 as ctrl")
// });
// }]);

if(window.location.origin == "http://localhost:4040") {
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
   this.showNavBar = false;

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
               password: this.regformdata.password,
               is_admin: false
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
         this.getMessages();
         this.clearScreen();
         this.showHomePage = true;
         this.showNavBar = true;
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

this.updateAdminStatus = function(thisUser){
   console.log(thisUser);
   $http({
      method: 'PUT',
      url: url + '/users/' + thisUser.id,
      data: { user: { username: thisUser.username, is_admin: thisUser.is_admin, password: thisUser.password }}
   }).then(function(response){
      console.log(response);
      this.findAllUsers();
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


// ---------------------------------
// ****** My Build Join Table ******
// ---------------------------------

   this.addThisBuildToCurrentUser = function(thisBuild){
      // console.log(person);
      var theBuild = thisBuild;
      var controller = this;
      console.log(thisBuild);
      var alreadyUsed = false;
      for (var i = 0; i < this.user.builds.length; i++) {
         if(this.user.builds[i].id != thisBuild.id){  //if person.builds includes thisBuild.id don't run the http request
            console.log('not the list');
            thisBuild.toggleBuildNotification = true;
            this.showJustAdded = true;
            this.showAlreadyAdded = false;
         } else {
            console.log('it IS in the list');
            alreadyUsed = true;
            thisBuild.toggleBuildNotification = true;
            this.showAlreadyAdded = true;
            this.showJustAdded = false;
            break;
         }
      }
      setTimeout(function(){
         console.log(theBuild);
         theBuild.toggleBuildNotification = false;
         controller.findBuilds();
      }, 5000);
      if (alreadyUsed === false) {
         console.log('You were at ' + thisBuild.build_name);
         $http({
            method: 'POST',
            url: url + '/my_builds',
            data:{
               user_id: this.user.id,
               build_id: thisBuild.id
            }
         }).then(function(response){
            console.log(response);
            this.findAllUsers();
            // this.findBuilds();
            $http({
               method: 'GET',
               url: url + '/users/' + this.user.id
            }).then(function(response){
               console.log(response);
               this.user = response.data;
            }.bind(this));
         }.bind(this));
      } console.log("IT IS ALREADY IN YOUR LIST!!!");
   };

   this.removeBuildFromMyBuilds = function(thisBuild){
      var buildToRemove = {};
      console.log(thisBuild);
      console.log(this.user);
      // GET ALL MY_BUILDS
      $http({
         method: 'GET',
         url: url + '/my_builds'
      }).then(function(response){
         console.log(response.data);
         this.myBuilds = response.data;
         for (var i = 0; i < this.myBuilds.length; i++) {
            if (thisBuild.id === this.myBuilds[i].build_id) {
               if (this.user.id === this.myBuilds[i].user_id) {
                  buildToRemove = this.myBuilds[i];
                  break;
               }
            }
         }
         console.log(buildToRemove);
         $http({
            method: "DELETE",
            url: url + '/my_builds/' + buildToRemove.id
         }).then(function(response){
            console.log(response, ' has been deleted');
            $http({
               method: 'GET',
               url: url + '/users/' + this.user.id
            }).then(function(response){
               console.log(response);
               this.user = response.data;
               this.findBuilds();
            }.bind(this));
         }.bind(this));
      }.bind(this));
   };


// ---------------------------------
// ****** END My Build Join Table ******
// ---------------------------------

// ---------------------------------
// ****** MESSAGE BOARD ******
// ---------------------------------
this.getMessages = function(){
   $http({
      method: "GET",
      url: url + '/messages'
   }).then(function(response){
      this.messages = response.data;
   }.bind(this));
};



this.sendChatMessage = function(message){
   console.log(message);
   console.log(this.user);
   $http({
      method: "POST",
      url: url + '/messages',
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
      data: {
         // comment:{
            comment: message.comment,
            user_id: this.user.id,
            username: this.user.username
         // }
      }
   }).then(function(response){
      console.log(response);

      this.getMessages();
   }.bind(this));
};

// ---------------------------------
// ****** END MESSAGE BOARD ******
// ---------------------------------

}]);
