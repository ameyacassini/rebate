sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"demonewcassini/controller/BaseController",
	'sap/ui/model/Filter'
], function(jQuery, Controller, JSONModel, BaseController, Filter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demonewcassini.controller.MassUpload", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var sPath = jQuery.sap.getModulePath("demonewcassini.data", "/Massupload.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel, "MassuploadModel");
			
			var model = new JSONModel({items:[]});
			this.getView().setModel(model,"UploadModel");
			
			this.getRouter().getRoute("massupload").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'massupload';
			globalKeys.refresh(true);
			
			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');
		},

		onUpload: function(e) {
			this.getView().byId("idTable").setVisible(true);
			this.getView().byId("idTable").getColumns()[0].setVisible(false);
		},
		onSavePress:function(){
		this.getView().byId("idTable").getColumns()[0].setVisible(true);
		},
		onCopyExcel:function(){
			// create value help dialog
			if (!this._flexHelpDialog) {
				this._flexHelpDialog = sap.ui.xmlfragment(
						"demonewcassini.fragment.UploadFile",
					this
				);
				this.getView().addDependent(this._flexHelpDialog);
			}
			this._flexHelpDialog.open();
		
		}
	});

});