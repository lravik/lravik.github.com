/**
 * Copyrights @ 2012 Saburi Informatics, All Rights Reserved
 * Author: L. Ravi Kiran
 * Date: 08/24/2012
 * 
 */

(function($){
	/**
	 * This plugin meant to compare 2 simple arrays, assuming these arrays are having simple data elements rather than nested ones
	 * 1. fromArray -- array to be compare against toArray
	 * 2. toArray -- array to be tested with fromArray
	 * 
	 * returns the flag, true for same false for different
	 */
	$.arrayCompare = function (fromArray, toArray) {
		/**
		* If any of two paramaters are not type of Array, we need to return false. 
		* For to be array type, parameter need to be typeof object and should have length of child elements greater than 1
		*/
		if (typeof fromArray !== "object" || typeof toArray !== "object") {
			return false;
		}
		if (fromArray.length != toArray.length) {
			return false;
		}
		var fSortArray = fromArray.sort(),
			tSortArray = toArray.sort();
		for (var i = 0; fromArray[i]; i++) {
			if (fSortArray[i] !== tSortArray[i]) {
				return false;
			}
		}
		return true;
	};
})(jQuery);