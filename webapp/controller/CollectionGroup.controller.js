sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller'
	], function(jQuery, MessageToast, Fragment, Controller) {
	"use strict";
	var oController, oView, oComponent;
	return Controller.extend("demonewcassini.controller.CollectionGroup", {

		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
		}
		
		/*_onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'collectiongroup';
			globalKeys.refresh(true);
			
			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');
		},*/

	});

});