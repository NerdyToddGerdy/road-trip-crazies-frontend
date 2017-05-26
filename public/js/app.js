console.log('crazy app.js');

const app = angular.module('CrazyApp', []);

const url= "https://localhost:3000";

app.controller('MainController', ['$http', function($http){
   this.showHomePage = false;
   this.showBuildsPage = false;
   this.showLoginPage = true;
   this.builds = [];
   this.clearScreen = function(){
      this.showHomePage = false;
      this.showBuildsPage = false;
      this.showLoginPage = false;
   };

   // $http({
   //    method:"GET",
   //    url: url + '/builds'
   // }).then(function(response){
   //    console.log(response.data);
   // });

}]);
