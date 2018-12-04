sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("demonewcassini.block.lumpsum.Lumpsum", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "demonewcassini.block.lumpsum.Lumpsum",
					type: "XML"
				},
				Expanded: {
					viewName: "demonewcassini.block.lumpsum.Lumpsum",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);