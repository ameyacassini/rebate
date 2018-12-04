sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device"
], function(Controller,Device) {
	"use strict";
	var oView, oController, oComponent;
	return Controller.extend("demonewcassini.controller.CollectionGroupFilteredList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf demonewcassini.view.CollectionGroupFilteredList
		 */
		onInit : function () {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			this.getOwnerComponent().getRouter().getRoute("CollectionGroupFilteredList").attachPatternMatched(this._onRouteMatched, this);
		
			var oModel = this.getOwnerComponent().getModel("CollectionGroupInformation");
			this.getView().setModel(oModel);
			
			var filterModel = this.getOwnerComponent().getModel("filterModel");
			this.getView().setModel(filterModel, "filterModel");
			
			

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
	
		},
		
			onNavigateToDetails: function(oEvent) {
			var collectionGroupId = oEvent.getSource().getBindingContext().sPath.substring(28);
			// oEvent.getSource().getSelectedItem().getBindingContext().getProperty("groupId");
			this.getOwnerComponent().getRouter()
				.navTo("CollectionGroupDetails", 
					{groupId:collectionGroupId}, 
					!Device.system.phone);
		},
		OnRemoveAllFilters:function(oEvent) {
						var filterModel = this.getOwnerComponent().getModel("filterModel");
						filterModel.setData({
							icon:"sap-icon://add",
							advanceFilterVisible: false
						});
						filterModel.refresh();
			this.getOwnerComponent().getRouter()
				.navTo("CollectionGroupList", 
					{groupId:-1}, 
					!Device.system.phone);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf demonewcassini.view.CollectionGroupFilteredList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf demonewcassini.view.CollectionGroupFilteredList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf demonewcassini.view.CollectionGroupFilteredList
		 */
		//	onExit: function() {
		//
		//	}

	});

});