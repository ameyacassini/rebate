sap.ui.define([], function() {
	"use strict";
	return {
		rateConvert: function(sRate) {

			var sItemType = this.getView().getModel("Agreement").getData().MergeList.slice(-1)[0].ItemType;
			if (sItemType.includes("Z001")) {
				return sRate + "%";
			} else if (sItemType.includes("Z002") || sItemType.includes("Z003")) {

				var patterNum = /^[0-9,]+$/;
				var patterStr = /^[A-Za-z\s.@,_/&()-]+$/;
				var patternFloat = /^\$?(?!0.00)(([0-9]{1,3},([0-9]{1,5},)*)[0-9]{3,5}|[0-9]{1,3})(\.[0-9]{2})+$/;
				var pFloat = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;
				var pattStr = new RegExp(patterStr);
				var pattNum = new RegExp(patterNum);
				var pattFloat = new RegExp(patternFloat);
				var paFloat = new RegExp(pFloat);
				if (pattStr.test(sRate)) {
					return sRate;
				} else if (pattNum.test(sRate)) {
					var numDouble = parseFloat(sRate).toFixed(2);
					return numDouble;
				} else if (pattFloat.test(sRate) || paFloat.test(sRate)) {
					return sRate;
				}

			}
		},
		itemConvert: function (sItem) {
			
			switch (sItem) {
				case "Z001":
					return "% Of Sales";
				case "Z002":
					return "Fixed Amount / UoM";
				case "Z003":
					return "LumpSum";
				default:
					return "";
			}
		}
	};
	

});