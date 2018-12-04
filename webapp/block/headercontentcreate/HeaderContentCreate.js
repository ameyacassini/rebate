sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("demonewcassini.block.headercontentcreate.HeaderContentCreate", {
		metadata: {
			events: {
				"dummy": {}
			},
			views: {
				Collapsed: {
					viewName: "demonewcassini.block.headercontentcreate.HeaderContentCreate",
					type: "XML"
				},
				Expanded: {
					viewName: "demonewcassini.block.headercontentcreate.HeaderContentCreate",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);