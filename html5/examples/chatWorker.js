/*** 
	This is simple Chat Worker JS file. Here we defined the properties and behaviors of this App. 
	Developer By L. Ravi Kiran
	Date: 11/23/2011
*/
var userNames = ["chat1", "chat2"];
var userAliases = ["User 1", "User 2"];

self.addEventListener("message", function(e) {
	var data = e.data;
	var userid = data.userid,
		message = data.msg;
	var useralias = "";
	for (var i = 0; i < userNames.length; i++) {
		if (userNames[i] === userid) {
			useralias = userAliases[i];
		}
	}
	postMessage({"useralias": useralias, "response": message });
}, false);