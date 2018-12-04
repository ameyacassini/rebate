sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var myBlock = BlockBase.extend("demonewcassini.block.persalescreate.PercentSaleCreate", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "demonewcassini.block.persalescreate.PercentSaleCreate",
					type: "XML"
				},
				Expanded: {
					viewName: "demonewcassini.block.persalescreate.PercentSaleCreate",
					type: "XML"
				}
			}
		}
	});
	return myBlock;
}, true);