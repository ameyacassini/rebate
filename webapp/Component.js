sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"demonewcassini/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("demonewcassini.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			
			var globalKeys = {
				page: ''
			};
			var oGlobalKeysModel = new JSONModel();
    		oGlobalKeysModel.setData(globalKeys);
    		this.setModel(oGlobalKeysModel, "GlobalKeys");
    		
    		
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			var agreements = {
				HeaderCollection: []
			};
			var oAgreementsModel = new JSONModel();
    		oAgreementsModel.setData(agreements);
    		this.setModel(oAgreementsModel, "Agreements");
    		
    		var oProductHierarchySetsModel = new JSONModel();
    		oProductHierarchySetsModel.setData([]);
    		this.setModel(oProductHierarchySetsModel, 'productHierarchySets');
    		
    		var compSettleModel = new JSONModel();
			this.setModel(compSettleModel, "CompSettleModel");
			var compSettleLineModel = new JSONModel();
			this.setModel(compSettleLineModel, "CompSettleLineModel");
		}
	});
});