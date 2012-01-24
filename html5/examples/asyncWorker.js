/*** 
	This is simple Async API Worker JS file. Here we defined the properties and behaviors of this App. 
	Developer By L. Ravi Kiran
	Date: 01/22/2012
*/
self.addEventListener("message", function(e) {
	var loop = 0;
	var repost = function () {
		if (loop < 10) {
			postMessage("Response Text");
			setTimeout(repost, 10000);
			loop++;
		}
	}
	setTimeout(repost, 1000);
}, false);