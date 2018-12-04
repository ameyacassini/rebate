sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("demonewcassini.block.persales.PercentSale", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "demonewcassini.block.persales.PercentSaleCol",
					type: "XML"
				},
				Expanded: {
					viewName: "demonewcassini.block.persales.PercentSale",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);