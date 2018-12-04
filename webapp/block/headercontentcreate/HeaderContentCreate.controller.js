sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"demonewcassini/controller/BaseController",
	"sap/m/PDFViewer",
	"sap/m/MessageToast",
	'sap/ui/model/Filter'
], function(jQuery, Controller, JSONModel, BaseController, PDFViewer, MessageToast, Filter) {
	"use strict";
	var iGlobalIterator = 0;
	return BaseController.extend("demonewcassini.block.headercontentcreate.HeaderContentCreate", {
		onInit: function() {


		},
		handleValueHelpCust: function(oEvent) {
				this.oParentBlock.fireDummy(oEvent.getParameters());
		},
		onInnerDummy: function (oEvent) {
			/*
			 Delegate the eventing to the parent block.
			 The outside world will see this event as being triggered by the block itself.
			 */
			this.oParentBlock.fireDummy(oEvent.getParameters());
		},

		_handleValueHelpSearchCust: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"CustomerID",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseCust: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdCust);
				productInput.setValue(oSelectedItem.getTitle());
				this.getView().byId("hdCountry").setValue("Germany");
				this.getView().byId("hdSalesOrg").setValue("Sales Org 1000");
				this.getView().byId("hdCurrency").setValue("EUR");
				iGlobalIterator = iGlobalIterator + 1;
				this.setProgressIndicator(iGlobalIterator);
			}
			evt.getSource().getBinding("items").filter([]);
			//this._valueHelpDialog.destroy();
			for (var sPropertyName in this._valueHelpDialog) {
				if (!this._valueHelpDialog.hasOwnProperty(sPropertyName)) {
					return;
				}

				this._valueHelpDialog[sPropertyName].destroy();
				this._valueHelpDialog[sPropertyName] = null;
			}
		}

	});
});