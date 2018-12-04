sap.ui.define([
		'jquery.sap.global',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'sap/ui/model/Filter',
		"sap/ui/core/routing/History"
	], function(jQuery, Fragment, Controller, JSONModel, Filter, History) {
	"use strict";
	var oView, oController, oComponent;
	return Controller.extend("demonewcassini.controller.App", {

		onInit : function (evt) {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			// set explored app's demo model on this sample
			//var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			//this.getView().setModel(oModel);
			
			$('body').on('click', '#nav-icon1', function () {
				var globalKeys = oComponent.getModel('GlobalKeys');
				if(globalKeys.getData().page === 'appHome') {
					oController.onCollapseExpandPress();
					$(this).removeClass('back');
					if($(this).hasClass('open')) {
						$(this).removeClass('open');
					} else {
						$(this).addClass('open');
					}
					//$(this).toggleClass('open');	
				} else {
					$(this).removeClass('open');
					if($(this).hasClass('back')) {
						$(this).removeClass('back');
						oController.onNavBack();
					} else {
						$(this).addClass('back');
					}
				}
			});
			
		},

		onExit : function () {
			if (this._oSettingPopover) {
				this._oSettingPopover.destroy();
			}
		},
		
		onAfterRenderMenuBtn: function() {
			/*$('#nav-icon1').click(function(){
				$(this).toggleClass('open');
			});*/	
		},
		
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} 
			/*var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			var aNav = oHistory.aHistory;
			if(aNav.includes("Clearpage")){
				oRouter.navTo("InformationPage", true);
			} else if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else if(sPreviousHash === ""){
				oRouter.navTo("appHome", true);
			}else {
				oRouter.navTo("InformationPage", true);
			}*/
		},
		
		onCollapseExpandPress: function () {
			var oSideNavigation = this.byId('sideNavigation');
			var bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},
		
		onLangChange: function(event){
			if(event.getParameter("state")){
				sap.ui.getCore().getConfiguration().setLanguage("en");
			}
			else{
				sap.ui.getCore().getConfiguration().setLanguage("fr");
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

		onOpenSettingPopover: function (oEvent) {
			if (!this._oSettingPopover) {
				this._oSettingPopover = sap.ui.xmlfragment("demonewcassini.fragment.popover.SettingPopover", this);
				//this._oPopover.bindElement("/ProductCollection/0");
				this.getView().addDependent(this._oSettingPopover);
			}

			this._oSettingPopover.openBy(oEvent.getSource());
		},

		onCloseSettingPopover: function (oEvent) {
			this._oSettingPopover.close();
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
				var sPath = oSelectedItem.oBindingContexts.Agreements.sPath;
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
			var sPath = oItem.oBindingContexts.Agreements.sPath;
				var lastChar = sPath[sPath.length - 1];
				this.getRouter().navTo("agreementdetails", {
					sPathdet: lastChar
				});
			}
		}
	});
});