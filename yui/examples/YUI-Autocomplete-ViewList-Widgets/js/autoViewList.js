YAHOO.namespace("AutocomplateViewList");

YAHOO.AutocompleteViewList = function() {
	var cellData;
	showViewList = function(){
		myPanel = new YAHOO.widget.Panel("my-panel", {
			width: "400px",
			height: "440px",
			fixedcenter: true, 
			constraintoviewport: true, 
			underlay: "shadow", 
			close: true,
			draggable: true
		});
		myPanel.setHeader("View List");
		myPanel.setBody('<div style="float:left;margin:10px;"><table border="0" cellpadding="0" cellspacing="0">'
			+'<tr><td><label for="state_input" style="font-weight:bold;">Find State:&nbsp;</label></td>'
			+'<td><span id="filter-container" style="width:220px;"><input type="text" id="state-input"  style="color:#333333;height:16px;width:200px;"/><span class="clear-filter"></span></span></td>'
			+'<td ><div class="button" id="filter_btn" >Filter</div></td>'
			+'</tr></table></div>'
			+'<div style="clear:both;"></div><div style="margin-left:10px;" id="yui-datatable-1"></div>');    
		myPanel.setFooter('<div style="margin-left:10px;margin-bottom:10px;"><a href="javascript:void(0);"" class="button"  id="select-value" >Select</a>&nbsp;&nbsp;<a href="javascript:void(0);""  id="cancel" >Cancel</a></div>');
		myPanel.render(document.body);
		myPanel.show();
		var sBtn = new YAHOO.widget.Button("select-value");

		var myColumnDefs = [
		{
			key:"id",
			label:"ID",					
			sortable:true, 
			resizeable:true
		},
		{
			key:"state", 
			label:"State",
			formatter:YAHOO.widget.DataTable.formatDate, sortable:true, sortOptions:{defaultDir:YAHOO.widget.DataTable.CLASS_DESC},resizeable:true
		}
		];

		var myDataSource = new YAHOO.util.DataSource(arrayAreaCodesStates);
		myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		myDataSource.responseSchema = {
			fields: ["id","state"]
		};

		myDataSource.doBeforeCallback = function (req,raw,res,cb) {
			// This is the filter function
			var data     = res.results || [],
				filtered = [],
				i,l;

			if(req){

				req = req.toLowerCase();
				for (i = 0, l = data.length; i < l; ++i) {

					data[i].state = data[i].state.replace(/<\/?[^>]+(>|$)/g, "");						
					if(data[i].state){
						if ((indexPos1=data[i].state.toLowerCase().indexOf(req)) > -1){
							data[i].state = highlightMatch(data[i].state,req);
							filtered.push(data[i]);
						}
					}
				}

				res.results = filtered;

			}

			return res;
		}

		var myDataTable = new YAHOO.widget.ScrollingDataTable("yui-datatable-1", myColumnDefs, myDataSource,
			{width:'332px',height: "300px"});

		myDataTable.subscribe("rowMouseoverEvent", myDataTable.onEventHighlightRow);
		myDataTable.subscribe("rowMouseoutEvent", myDataTable.onEventUnhighlightRow);
		myDataTable.set("selectionMode", "single");
		myDataTable.subscribe("rowClickEvent",myDataTable.onEventSelectRow);
		myDataTable.subscribe("cellClickEvent", function (oArgs) {
			var target = oArgs.target;
			var record = myDataTable.getRecord(target);
			var stateName = record.getData('state');
			cellData = stateName;

		});
		YAHOO.util.Event.addListener("filter_btn", "click", function () {
			stateInputValue = YAHOO.util.Dom.get("state-input").value;
			updateFilter(stateInputValue);
		});	

		updateFilter  = function (req) {
			var dataTableState = myDataTable.getState();	
			myDataSource.sendRequest(req,{
				success : myDataTable.onDataReturnInitializeTable,
				failure : myDataTable.onDataReturnInitializeTable,
				scope   : myDataTable,
				argument: dataTableState
			});
		};
		myInputVal = YAHOO.util.Dom.get("myInput").value;
		if(myInputVal){
			YAHOO.util.Dom.get("state-input").value=myInputVal;
			updateFilter(myInputVal);

		}
		YAHOO.util.Event.addListener("cancel", "click", function () {
				myPanel.hide();
				});				
		YAHOO.util.Event.addListener("select-value", "click", function () {
				if(cellData){
				YAHOO.util.Dom.get("myInput").value = cellData.replace(/<\/?[^>]+(>|$)/g, "");
				myPanel.hide();
				}
				});	

		return {
			oDS: myDataSource,
			oDT: myDataTable
		};
	}//end function
	YAHOO.util.Event.addListener("view-list", "click", function () {
		showViewList();
	});	
	var matchesCount;
	var customSearch = function(sQuery) {
		sQuery = unescape(sQuery);
		var allMatches = [],allMatches2 = [],
			item, i, l,itemPos, noOfFields,	matchesCount = 0;
		var j=0; itemPrePos= 0;maxPos=0;
		var allMatches1 = Array();
		// 0 for customer code, 1 for Customer Name
		var nSearchField = (YAHOO.lang.isNumber(sQuery*1)) ? 0 : 1;

		for(i=0, l=arrayAreaCodesStates.length; i<l; i++) {
			item = arrayAreaCodesStates[i];

			// State must be made case-insensitve and make the state return as index 0
			if(nSearchField) {
				if((itemPos=item[nSearchField].toLowerCase().indexOf(sQuery.toLowerCase())) > -1) {
					if(itemPos!=0){
						allMatches2.push([item[1], item[0]]);
					}else{
						allMatches[allMatches.length] = [item[1], item[0]]; 
					}
				}//end item Pos

			}//end nSearhfield
			// Area codes are simpler
			else {
				if(item[nSearchField].indexOf(sQuery) > -1) {
					allMatches[allMatches.length] = item;
				}
			}
		}//end for loop

		allMatches = allMatches.concat(allMatches2);

		// States should be sorted alphabetically
		// Define schema on the fly (since the return order changes)
		if(nSearchField) {
			this.responseSchema = {fields: ["state","pincode"]};
		}
		else {
			this.responseSchema = {fields: ["pincode","state"]};
		}

		matchesCount = allMatches.length;
		return allMatches;
	};


	// Use a LocalDataSource
	var oDS = new YAHOO.util.LocalDataSource(arrayAreaCodesStates);
	var oDS = new YAHOO.util.FunctionDataSource(customSearch);
	// Instantiate the AutoComplete
	var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);
	oAC.prehighlightClassName = "yui-ac-prehighlight";
	oAC.useShadow = true;
	//oAC.animVert = true;
	//oAC.animHoriz = true;
	//oAC.minQueryLength = 3;
	var matchId =0;	
	oAC.formatResult = function(oResultData, sQuery, sResultMatch) {
		var query = sQuery.toLowerCase();
		var isId = (YAHOO.lang.isNumber(sQuery*1)) ? 0 : 1;
		var maxDotsLen = 15;
		var tt;
		matchId++;

		if(isId){
			var stateIndex = oResultData[0].toLowerCase().indexOf(query);
			stateName = oResultData[0];
			if(stateName.length>=maxDotsLen){
				id = 'A' + matchId;
				addToolTip(id,stateName);
				stateName = stateName.substring(0, maxDotsLen) + "...";
			}
			if(stateIndex > -1) {
				stateName = highlightMatch(stateName, query);
			}else{
				stateName= stateName;
			}
			return "<div class='format-results' id=A"+matchId+" >"+stateName+"</div> "+ oResultData[1];
		}
		else{
			var stateCode = oResultData[0].toLowerCase().indexOf(query);
			stateNameID = oResultData[1];
			if(stateCode > -1) {
				if(stateNameID.length>=maxDotsLen){
					stateNameID = stateNameID.substring(0, maxDotsLen) + "...";
				}
				stateCode = highlightMatch(oResultData[0], query); 
			}else{
				stateNameID = stateNameID;
			}
			return "<div class='format-results'>"+stateNameID+"</div> "+ stateCode;
		}

	};
	var addDots = function(full, matchindex) {
		return full.substring(0, matchindex) + "...";
	};
	var addToolTip = function(id,customerName) {
		var tt = new YAHOO.widget.Tooltip("tt1", { context:id, text:customerName });
		return tt;
	};
	var highlightMatch = function(bodyText, searchTerm, highlightStartTag, highlightEndTag) { 
		// the highlightStartTag and highlightEndTag parameters are optional
		if ((!highlightStartTag) || (!highlightEndTag)) {
			highlightStartTag = "<span class='match'>";
			highlightEndTag = "</span>";
		}

		var newText = "";
		var i = -1;
		var lcSearchTerm = searchTerm.toLowerCase();
		var lcBodyText = bodyText.toLowerCase();

		while (bodyText.length > 0) {
			i = lcBodyText.indexOf(lcSearchTerm, i+1);
			if (i < 0) {
				newText += bodyText;
				bodyText = "";
			} else {
				// skip anything inside an HTML tag
				if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
					// skip anything inside a <script> block
					if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
						newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
						bodyText = bodyText.substr(i + searchTerm.length);
						lcBodyText = bodyText.toLowerCase();
						i = -1;
					}
				}
			}
		}
		return newText;
	};

	oAC.containerPopulateEvent.subscribe(function(){
		var footHTML = '<div style="padding:5px;border-top:1px solid #CCCCCC;"><a href="JavaScript:void(0);" id="total-results"  >Total Results ('+ matchesCount +')</a></div>';
		oAC.setFooter(footHTML);
		YAHOO.util.Event.addListener("total-results", "click", function () {
			showViewList();
		});		
	});

	return {
		fnSearch: customSearch,
		oDS: oDS,
		oAC: oAC
	};
}();
