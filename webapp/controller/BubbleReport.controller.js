sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        'demonewcassini/service/InitPage',
        "demonewcassini/controller/BaseController"
    ], function(jQuery, Controller, JSONModel, FlattenedDataset, FeedItem, ChartFormatter, Format, InitPageUtil, BaseController) {
    "use strict";
	var oView, oController, oComponent;
  return BaseController.extend("demonewcassini.controller.BubbleReport", {


        onInit : function (evt) {
        	oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
        	this.oViewModel = new JSONModel({
					"quantityThreshold": 25,
					"ratingThreshold": 500000,
					"bQuantityBoxVisible" : true,
					"bRatingBoxVisible" : false
				});
			this.getView().setModel(this.oViewModel, "viewModel");
			
				//Configure bar chart product rating
			this.oVizFrameBarRating = this.getView().byId("idVizFrameBarRating");
			var oPopOverBarRating = this.getView().byId("idPopOverBarRating");
			oPopOverBarRating.connect(this.oVizFrameBarRating.getVizUid());
			this.oVizFrameBarRating.getDataset().setContext("Brand");
			this._setVizFrameBarRatingProperties();
			
			this.getRouter().getRoute("report").attachPatternMatched(this._onObjectMatched, this);
           
        },
        
        _onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'report';
			globalKeys.refresh(true);
			
			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');
		},
        _setVizFrameBarRatingProperties: function(){
        	
			this.oVizFrameBarRating.setVizProperties({
				"title":{
					"visible": false
				},
				"plotArea":{
					"dataLabel":{
						"visible": true
					},
					"dataPointStyle":{
						"rules":[{
							//Mark the "good" products green, the "bad" products red
							"dataContext":{
								"Rebate":{
										"max": this.oViewModel.getProperty("/ratingThreshold")
									}
								},
								"properties":{
									"color":"sapUiChartPaletteSemanticBad"
								},
								"displayName":this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("barChartRatingReferenceBad",this.oViewModel.getProperty("/ratingThreshold"))
						}],
						"others":{
							"properties":{
								"color": "sapUiChartPaletteSemanticGood"
							},
							"displayName": this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("barChartRatingReferenceGood",this.oViewModel.getProperty("/ratingThreshold"))
						}
					},
					//Show a reference line for the set threshold with a label
					"referenceLine":{
						"line":{
							"valueAxis":[
								{
									"value": this.oViewModel.getProperty("/ratingThreshold"),
									"visible": true,
									"size":500000,
									"type":"dotted",
									"label":{
										"text": this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("barChartRatingReferenceBad",this.oViewModel.getProperty("/ratingThreshold")),
										"visible":true
									}
								}
							]
						}
					}
				},
				"categoryAxis":{
					"title":{
						"text": this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("barChartRatingCategory")
					}
				},
				"valueAxis":{
					"title":{
						"text": this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("barChartRatingValue")
					}
				}
			});
		
        },
        //Update the charts if the rating slider has changed by setting new properties
		onRatingSliderChange: function(oEvent){
			this.ratingThreshold = oEvent.getParameter("value");
			this._setVizFrameBarRatingProperties();
			
		}
    });

});