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

], function(jQuery, MessageToast, Fragment, Controller, Filter, FilterOperator, JSONModel, Dialog, Button, History,Device) {
	"use strict";

	return Controller.extend("demonewcassini.controller.InformationPage", {
		
		onInit : function () {
		},
		
		OnAddGroup: function() {
			this.getOwnerComponent().getRouter()
				.navTo("CollectionGroupDetails", {
					groupId: -1
				}, !Device.system.phone);
				var oModel = this.getOwnerComponent().getModel("productHierarchySets");
				oModel.setData([]);

		},
		onLangChange: function(event){
			if(event.getParameter("state")){
				sap.ui.getCore().getConfiguration().setLanguage("en");
			}
			else{
				sap.ui.getCore().getConfiguration().setLanguage("fr");
			}
		}
	});
});