sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("demonewcassini.block.fixedamountcreate.FixedamountCreate", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "demonewcassini.block.fixedamountcreate.FixedamountCreate",
					type: "XML"
				},
				Expanded: {
					viewName: "demonewcassini.block.fixedamountcreate.FixedamountCreate",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);