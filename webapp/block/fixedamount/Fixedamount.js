sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("demonewcassini.block.fixedamount.Fixedamount", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "demonewcassini.block.fixedamount.Fixedamount",
					type: "XML"
				},
				Expanded: {
					viewName: "demonewcassini.block.fixedamount.Fixedamount",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);