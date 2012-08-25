/**
 * Copyrights @ 2012 Saburi Informatics, All Rights Reserved
 * Author: L. Ravi Kiran
 * Date: 08/24/2012
 * 
 */

(function($){
	/**
	 * This plugin meant to compare 2 object,
	 * 
	 * 1. fromObj -- this is object which need to be tested agaist toObj
	 * 2. toObj -- compare the fromObj against this one
	 * 3. compKeys -- provide the keys array to restrict the comparison for limited keys instead of whole object
	 * 
	 * returns the flag, true for same and false for different
	 */
	$.objCompare = function (fromObj, toObj, compKeys) {
		var fromKeys = Object.keys(fromObj),
			toKeys = Object.keys(toObj),
			compFlag = true;
		if (compKeys != undefined) {
			fromKeys = compKeys;
		}
		$.each(fromKeys, function(i, keyItem){
			if ($.inArray(keyItem, toKeys) != -1) {
				var fromType = typeof fromObj[keyItem],
					toType = typeof toObj[keyItem];
				if (fromType != toType) {
					compFlag = false;
					return false;
				}
				switch(fromType) {
					case 'number':
					case 'string':
					case 'boolean':
						compFlag = (fromObj[keyItem] == toObj[keyItem]);
						break;
					case 'function':
						compFlag = true;
						break;
				}
				if (fromType == 'object') {
					if (fromObj[keyItem] != null && toObj[keyItem] != null) {
						if (fromObj[keyItem].length > 0 && toObj[keyItem].length > 0) {
							//Use case where element is Array Type, assuming this is simple array instead of nested one.
							compFlag = $.arrayCompare(fromObj[keyItem], toObj[keyItem]);
						} else {
							compFlag = false;
							return false;
						}
					} else if (fromObj[keyItem] != null || toObj[keyItem] != null) {
						compFlag = false;
						return false;
					}
				}
				if (!compFlag) {
					return false;
				}
			} else {
				compFlag = false;
				return false;
			}
		});
		return compFlag;
	};		
	
})(jQuery);