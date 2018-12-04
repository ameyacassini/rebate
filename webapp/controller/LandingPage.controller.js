sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"demonewcassini/controller/BaseController",
	'sap/ui/model/Filter',
	"sap/ui/model/FilterOperator"
], function(jQuery, Controller, JSONModel, BaseController, Filter,FilterOperator) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demonewcassini.controller.LandingPage", {

		onInit: function(evt) {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			this.oSF = oView.byId("searchField");
			var sRootPath = jQuery.sap.getModulePath("demonewcassini");
			//var sPath = jQuery.sap.getModulePath("demonewcassini", "data/LandingPageData.json").join("/"));;
			var oModel = new JSONModel([sRootPath, "data/LandingPageData.json"].join("/"));
			this.getView().setModel(oModel, "LandingPageModel");
			
			this.getRouter().getRoute("appHome").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'appHome';
			globalKeys.refresh(true);
			$('#nav-icon1').removeClass('back');
			$('#nav-icon1').removeClass('open');
		},
		handleLiveChange: function(oEvent){
			var aFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Contractno", FilterOperator.EQ, sQuery));
			}
 
			// filter the list via binding
			var oList = this.getView().byId("productInput");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onLangChange: function(event){
			if(event.getParameter("state")){
				sap.ui.getCore().getConfiguration().setLanguage("en");
			}
			else{
				sap.ui.getCore().getConfiguration().setLanguage("fr");
			}
		},
		pressGenericTile: function(evt) {
			if(evt.getSource().getProperty("subheader")==="Create Contract"){
				this.getRouter().navTo("createagreement");
			}else if(evt.getSource().getProperty("subheader")==="Mass Upload"){
				this.getRouter().navTo("massupload");
			}else if(evt.getSource().getProperty("subheader")==="Report"){
				this.getRouter().navTo("report");
			}else if(evt.getSource().getProperty("subheader")==="Product Hierarchy Set"){
				this.getRouter().navTo("CollectionGroupList");
			}
		
		},
		onSearch: function(event) {
			var item = event.getParameter("suggestionItem");
			if (item) {
				var sPath = event.getParameter("suggestionItem").getBindingContext().sPath;
				var lastChar = sPath[sPath.length - 1];
				this.getRouter().navTo("agreementdetails", {
					sPathdet: lastChar
				});

			}
		},
		onSuggest: function(event) {
			var value = event.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("CustomerID", function(sText) {
							return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("AgreementNumber", function(sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
			}

			this.oSF.getBinding("suggestionItems").filter(filters);
			this.oSF.suggest();
		},
		handleValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"demonewcassini.fragment.HelpPopUpDialog.AgreementHelpDialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"AgreementNumber",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},
		_handleValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"AgreementNumber",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var sPath = oSelectedItem.getBindingContext("contS").sPath;
				//var sPath = evt.getParameter("selectedItem").getBindingContext().sPath;
				var lastChar = sPath[sPath.length - 1];
				this.getRouter().navTo("agreementdetails", {
					sPathdet: lastChar
				});
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		suggestionItemSelected: function (evt) {

			var oItem = evt.getParameter('selectedItem');
				if (oItem) {
			//	var sPath = evt.getParameter("selectedItem").getBindingContext().sPath;
			var sPath = oItem.getBindingContext("contS").sPath;
				var lastChar = sPath.substring(17, 27);
				this.getRouter().navTo("agreementdetails", {
					sPathdet: lastChar
				});
			}
		}
	});
});