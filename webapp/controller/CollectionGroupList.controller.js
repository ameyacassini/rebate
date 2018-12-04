sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	"sap/ui/model/FilterOperator",
	'sap/ui/model/json/JSONModel',
	"sap/m/Dialog", "sap/m/Button",
	"sap/ui/core/routing/History",
	"sap/ui/Device"

], function(jQuery, MessageToast, Fragment, Controller, Filter, FilterOperator, JSONModel, Dialog, Button, History, Device) {
	"use strict";
	var oView, oController, oComponent;
	return Controller.extend("demonewcassini.controller.CollectionGroupList", {

		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var lang = jQuery.sap.getUriParameters().get("lang");
			if (!lang)
				sap.ui.getCore().getConfiguration().setLanguage("en");
			else
				sap.ui.getCore().getConfiguration().setLanguage(lang);

			this.getOwnerComponent().getRouter().getRoute("CollectionGroupList").attachPatternMatched(this._onRouteMatched, this);

			var oModel = this.getOwnerComponent().getModel("CollectionGroupInformation");
			this.getView().setModel(oModel);

			var filterModel = this.getOwnerComponent().getModel("filterModel");
			this.getView().setModel(filterModel, "filterModel");
			filterModel.setProperty("/icon", "sap-icon://add");
			filterModel.setProperty("/advanceFilterVisible", false);

		},
		onNavBack : function(){
			//sap.ui.getCore().byId("__xmlview2--grpDesc").setValue("");
			this.getOwnerComponent().getRouter().navTo("");
			
		},
		_onRouteMatched: function(oEvent) {
			/*
			 * Navigate to the first item by default only on desktop and tablet (but not phone). 
			 * Note that item selection is not handled as it is
			 * out of scope of this sample
			 */

			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'collectiongroup';
			globalKeys.refresh(true);

			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');

			this.getView().getModel().refresh();
			if (!Device.system.phone) {
				this.getOwnerComponent().getRouter()
					.navTo("InformationPage", {
						groupId: 0
					}, true);
			}
		},
		onSelectionChange: function(oEvent) {
			var sPath = oEvent.getParameter('listItem').getBindingContextPath();
			var oModel = this.getView().getModel("prodH");
			var oCollectionGroupId = oModel.getProperty(sPath);
			var  sCollectionGroupId = oCollectionGroupId.Prodno;
			// oEvent.getSource().getSelectedItem().getBindingContext().getProperty("groupId");
			this.getOwnerComponent().getRouter()
				.navTo("CollectionGroupDetails", {
					groupId: sCollectionGroupId
				}, !Device.system.phone);
				
			//clear model
			oComponent.getModel('productHierarchySets').setData([]);
		},
		filterGlobally: function(oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();

			if (sQuery) {
				aFilters = new Filter([
					// new Filter("groupId", FilterOperator.Contains, sQuery),
					new Filter("Prodno", FilterOperator.Contains, sQuery)
				], false);

			}

			var list = this.getView().byId("collectionGroupList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		showAdvanceSearch: function(oEvent) {

			var filterModel = this.getView().getModel("filterModel");
			if (!filterModel.getProperty("/advanceFilterVisible")) {
				filterModel.setProperty("/icon", "sap-icon://decline");
				filterModel.setProperty("/advanceFilterVisible", true);

			} else {
				filterModel.setProperty("/icon", "sap-icon://add");
				filterModel.setProperty("/advanceFilterVisible", false);
			}

			filterModel.refresh();

		},
		handleValueHelpCat: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCat) {
				this._valueHelpDialogCat = sap.ui.xmlfragment("demonewcassini.fragment.SearchHelp.SearchHelpCat", this);
				this.getView().addDependent(this._valueHelpDialogCat);
			}

			//	create a filter for the binding
			this._valueHelpDialogCat.getBinding("items").filter([new Filter(
				"Vtext1",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogCat.open(sInputValue);
		},
		handleValueHelpType: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
		
			// create value help dialog
			if (!this._valueHelpDialogType) {
				this._valueHelpDialogType = sap.ui.xmlfragment("demonewcassini.fragment.SearchHelp.SearchHelpType", this);
				this.getView().addDependent(this._valueHelpDialogType);
			}

			//	create a filter for the binding
			this._valueHelpDialogType.getBinding("items").filter([new Filter(
				"Vtext2",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogType.open(sInputValue);
		},
		handleValueHelpBrand: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			this.updateSearchHelpValue(this.inputId);
			// create value help dialog
			if (!this._valueHelpDialogBrand) {
				this._valueHelpDialogBrand = sap.ui.xmlfragment("demonewcassini.fragment.SearchHelp.SearchHelpBrand", this);
				this.getView().addDependent(this._valueHelpDialogBrand);
			}

			//	create a filter for the binding
			this._valueHelpDialogBrand.getBinding("items").filter([new Filter(
				"Vtext3",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogBrand.open(sInputValue);
		},
		handleValueHelpModel: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			//this.updateSearchHelpValue(this.inputId);
			// create value help dialog
			if (!this._valueHelpDialogModel) {
				this._valueHelpDialogModel = sap.ui.xmlfragment("demonewcassini.fragment.SearchHelp.SearchHelpModel", this);
				this.getView().addDependent(this._valueHelpDialogModel);
			}

			//	create a filter for the binding
			this._valueHelpDialogModel.getBinding("items").filter([new Filter(
				"Vtext4",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogModel.open(sInputValue);
		},
		
		_onGetHierarchyItems: function(level, allfilters) {
			try {
				//collectionItemMode.setProperty("/Hierarchy1", checkBoxSelected);
				var oModel2 = this.getOwnerComponent().getModel("prodH");
    			oModel2.read("/PROD_HIERARCHYSet", {
					filters: allfilters,
					success: function(oData) {
						var oHierarchyModel = new sap.ui.model.json.JSONModel(oData);
						oView.setModel(oHierarchyModel, "hierarchy" + level);
						console.log(oData);
					},
					error: function(oError) {
						console.log(oError);
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		},

		updateSearchHelpValue: function(inputField) {
			var CollectionSearchHelp;
			var oModel;
			var parent;
			var result;
			var aFilterFill = [];
			if (inputField.includes("inp_cat")) {
				parent = this.getView().getModel("filterModel").getProperty("/catkey");
				aFilterFill.push(new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.EQ, parent));
				aFilterFill.push(new sap.ui.model.Filter("Stufe", sap.ui.model.FilterOperator.EQ, "2"));
				aFilterFill.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, "EN"));
				oController._onGetHierarchyItems("2", aFilterFill);
			
			} else if (inputField.includes("inp_type")) {
			    parent = this.getView().getModel("filterModel").getProperty("/typekey");
				aFilterFill.push(new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.EQ, parent));
				aFilterFill.push(new sap.ui.model.Filter("Stufe", sap.ui.model.FilterOperator.EQ, "3"));
				aFilterFill.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, "EN"));
				oController._onGetHierarchyItems("3", aFilterFill);
			} else if (inputField.includes("inp_brand")) {
				parent = this.getView().getModel("filterModel").getProperty("/brandGroupkey");
				aFilterFill.push(new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.EQ, parent));
				aFilterFill.push(new sap.ui.model.Filter("Stufe", sap.ui.model.FilterOperator.EQ, "4"));
				aFilterFill.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, "EN"));
				oController._onGetHierarchyItems("4", aFilterFill);
			} else if (inputField.includes("inp_Material")) {
				// parent = this.getView().getModel("filterModel").getProperty("/namingkey");
				oModel = this.getOwnerComponent().getModel("Materials");
				// if (parent === undefined) {
				result = oModel.getData().ListItems;
				// } else {
				// 	result = jQuery.grep(oModel.getData().ListItems, function(e) {
				// 		return e.parent === parent;
				// 	});
				// }
				CollectionSearchHelp = new sap.ui.model.json.JSONModel(result);
				this.getView().setModel(CollectionSearchHelp, "CollectionSearchHelp");

			}

		},
		_handleValueHelpSearchCat: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Vtext1",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearchType: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Vtext2",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearchBrand: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Vtext3",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearchModel: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Vtext4",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var oFilterModel = this.getView().getModel("filterModel");
			if (oSelectedItem) {
				var productInput = this.inputId;
				if (productInput.includes("inp_cat")) {
					oFilterModel.setProperty("/catDescription", oSelectedItem.getDescription());
					oFilterModel.setProperty("/catkey", oSelectedItem.getTitle());
					this.updateSearchHelpValue(productInput);
				} else if (productInput.includes("inp_type")) {
					oFilterModel.setProperty("/typeDescription", oSelectedItem.getDescription());
					oFilterModel.setProperty("/typekey", oSelectedItem.getTitle());
					this.updateSearchHelpValue(productInput);
				} else if (productInput.includes("inp_brand")) {
					oFilterModel.setProperty("/brandGroupDescription", oSelectedItem.getDescription());
					oFilterModel.setProperty("/brandGroupkey", oSelectedItem.getTitle());
					this.updateSearchHelpValue(productInput);
				} else if (productInput.includes("inp_model")) {
					oFilterModel.setProperty("/modelDescription", oSelectedItem.getDescription());
					oFilterModel.setProperty("/modelkey", oSelectedItem.getTitle());
			
				} 

			}
			evt.getSource().getBinding("items").filter([]);
		},

		onNavigateToFilteredList: function(oEvent) {
			var filterModel = this.getOwnerComponent().getModel("filterModel");
			// var oMasterModel = this.getView().getModel();
			// oMasterModel.setData({"CollectionGroupInformation":[]});
			// var result;
			// 	var parent = filterModel.getProperty("/namingkey");
			// 	var oModel = this.getOwnerComponent().getModel("CollectionGroupInformation");
			// 	var data = oModel.getData();
			// 	if (parent === undefined) {
			// 		result = oModel.getData().ListItems;
			// 	} else {
			// 		result = jQuery.grep(oModel.getData().ListItems, function(e) {
			// 			return e.parent === parent;
			// 		});
			// 	}
			// 	var CollectionGroupInformation = new sap.ui.model.json.JSONModel(result);
			// 	this.getView().setModel(CollectionGroupInformation);

			// // data.push.apply(data, collectionRecord);
			// oMasterModel.refresh();

			filterModel.setProperty("/namingDescriptionApplied", filterModel.getProperty("/catDescription"));
			filterModel.setProperty("/brandDescriptionApplied", filterModel.getProperty("/typeDescription"));
			filterModel.setProperty("/qualityGroupDescriptionApplied", filterModel.getProperty("/brandGroupDescription"));
			filterModel.setProperty("/qualityDescriptionApplied", filterModel.getProperty("/modelDescription"));
	

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("CollectionGroupFilteredList", {
				groupId: 0
			});
		},
		
		onClearFilteredList: function(){
			oView.byId("inp_cat").setValue("");
			oView.byId("inp_type").setValue("");
			oView.byId("inp_brand").setValue("");
			oView.byId("inp_model").setValue("");
		}

	});
});