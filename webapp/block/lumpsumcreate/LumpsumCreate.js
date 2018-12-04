sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("demonewcassini.block.lumpsumcreate.LumpsumCreate", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "demonewcassini.block.lumpsumcreate.LumpsumCreate",
					type: "XML"
				},
				Expanded: {
					viewName: "demonewcassini.block.lumpsumcreate.LumpsumCreate",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);