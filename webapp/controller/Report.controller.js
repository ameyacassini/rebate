sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/DimensionDefinition',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        'demonewcassini/service/InitPage',
        "demonewcassini/controller/BaseController",
        'sap/viz/ui5/data/FlattenedDataset'
    ], function(jQuery, Controller, JSONModel, FeedItem, DimensionDefinition, ChartFormatter, Format, InitPageUtil,BaseController,FlattenedDataset) {
    "use strict";
    var oView, oController, oComponent;
    return BaseController.extend("demonewcassini.controller.Report", { 
    	dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost",

        settingsModel : {
            chartType : {
                name : "Chart Type",
                defaultSelected : "0",
                values : [{
                    key : "0",
                    name : "Line Chart",
                    vizType : "timeseries_line",
                    json : "/column/timeAxis.json",
                    value : ["Accrued"],
                    dataset : {
                        dimensions: [{
                            name: 'Date',
                            value: "{Date}",
                            dataType:'date'
                        }],
                        measures: [{
                            name: 'Accrued',
                            value: '{Accrued}'
                        }],
                        data: {
                            path: "/milk"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            },
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false
                            }
                        },
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        timeAxis: {
                            title: {
                                visible: false
                            },
                            interval : {
                                unit : ''
                            }
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: false
                        }
                    }
                },
                {
                    key : "1",
                    name : "Bubble Chart",
                    vizType : "timeseries_bubble",
                    json : "/bubble/medium.json",
                    value : ["Settled"],
                    dataset : {
                        "dimensions": [{
                            "name": "Date",
                            "value": "{Date}",
                            "dataType":"date"
                        }],
                        "measures": [{
                            "name": "Accrued",
                            "value": "{Accrued}"
                        },
                        {
                            "name": "Settled",
                            "value": "{Settled}"
                        }],

                        data: {
                            path: "/milk"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false
                            },
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: true
                            }
                        },
                        sizeLegend: {
                            formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                            title: {
                                visible: true
                            }
                        },
                        title: {
                            visible: false
                        }
                    }
                }]
            }
        },

        oVizFrame : null, chartTypeSelect : null, chart : null,

        onInit : function (evt) {
        	oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
        	
            /*Format.numericFormatter(ChartFormatter.getInstance());
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties(this.settingsModel.chartType.values[0].vizProperties);
            //var dataModel = new JSONModel(this.dataPath + "/column/timeAxis.json");
            
            //var dataModel = new JSONModel(jQuery.sap.getModulePath("data/Reportdata.json"));
            //oVizFrame.setModel(dataModel,"ReportModel");
			//oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString({
                "Settled": ChartFormatter.DefaultPattern.STANDARDFLOAT,
                "Accrued": ChartFormatter.DefaultPattern.STANDARDFLOAT
            });

            InitPageUtil.initPageSettings(this.getView());*/
            
            var oBusinessData =  [{
		"StoreName": "24-Seven",
		"Accrued": 428214.13,
		"Settled": 94383.52,
		"Consumption": 76855.15368,
		"Country": "China",
		 "Date": "11/9/2016",
		 "Rebate": 1139773.57
	}, {
		"StoreName": "A&A",
		"Accrued": 1722148.36,
		"Settled": 274735.17,
		"Consumption": 310292.22,
		"Country": "China",
		 "Date": "12/10/2017",
		 "Rebate": 703518.915
	}, {
		"StoreName": "Alexei's Specialities",
		"Accrued": 1331176.706884,
		"Settled": 233160.58,
		"Consumption": 143432.18,
		"Country": "China",
		 "Date": "1/10/2017",
		 "Rebate": 366772.572
	}, {
		"StoreName": "BC Market",
		"Accrued": 1878466.82,
		"Settled": 235072.19,
		"Consumption": 487910.26,
		"Country": "China",
		 "Date": "2/11/2017",
		 "Rebate": 544959.01
	}, {
		"StoreName": "Choices Franchise 1",
		"Accrued": 3386251.94,
		"Settled": 582543.16,
		"Consumption": 267185.27,
		"Country": "France",
		 "Date": "3/12/2017",
		 "Rebate": 829985.17
	}, {
		"StoreName": "Choices Franchise 3",
		"Accrued": 2090030.97,
		"Settled": 397952.77,
		"Consumption": 304964.8856125,
		"Country": "France",
		 "Date": "4/1/2017",
		 "Rebate": 1178705
	}, {
		"StoreName": "Choices Franchise 6",
		"Accrued": 1932991.59,
		"Settled": 343427.25,
		"Consumption": 291191.83,
		"Country": "France",
		 "Date": "5/2/2017",
		 "Rebate": 245418.05
	}, {
		"StoreName": "Dairy World",
		"Accrued": 752565.16,
		"Settled": 115844.26,
		"Consumption": 98268.9597904,
		"Country": "France",
		 "Date": "6/3/2017",
		 "Rebate": 770512.86
	}, {
		"StoreName": "Delikatessen",
		"Accrued": 1394072.66,
		"Settled": 263180.86,
		"Consumption": 176502.5521223,
		"Country": "France",
		 "Date": "7/4/2017",
		 "Rebate": 446377.265
	}, {
		"StoreName": "Donald's Market",
		"Accrued": 3308333.872944,
		"Settled": 611658.59,
		"Consumption": 538515.47632832,
		"Country": "China",
		 "Date": "8/5/2017",
		 "Rebate": 663162.36
	}];
	 
	    	var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
	    		businessData : oBusinessData
	    	});
	    
	    	var dataset = new sap.viz.ui5.data.FlattenedDataset({
	
	              dimensions : [ {
	                axis : 1,
	                name : 'Country',
	                value : "{Country}"
	              } ],
	
	              measures : [ {
	                group : 1,
	                name : 'Settled',
	                value : '{Settled}'
	              }, {
	                group : 2,
	                name : 'Rebate',
	                value : '{Rebate}'
	              }, {
	                group : 3,
	                name : 'Settled',
	                value : '{Settled}'
	              } ],
	
	              data : {
	                path : "/businessData",
	                factory : function() {
	                }
	              }  
	
	            });
	
	            var bubble = new sap.viz.ui5.Bubble({
	              id : "bubble",
	              width : "80%",
	              height : "400px",
	              plotArea : {
	              },
	              title : {
	                visible : true,
	                text : 'Profit and Revenue By Country'
	              },
	              dataset : dataset
	            });
	    	bubble.setModel(oModel);
			//bubble.placeAt("uiArea");
			this.getView().byId('chartFixFlex').setFlexContent(bubble);
			
			
			this.getRouter().getRoute("report").attachPatternMatched(this._onObjectMatched, this);
			
        },
        
        _onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'report';
			globalKeys.refresh(true);
		},
        
        onAfterRendering : function(){
            this.chartTypeSelect = this.getView().byId('chartTypeSelect');
        },
        onChartTypeChanged : function(oEvent){
            if(this.oVizFrame){
                var selectedKey = this.chart = parseInt(oEvent.getSource().getSelectedKey());
                var bindValue = this.settingsModel.chartType.values[selectedKey];
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                this.oVizFrame.setVizType(bindValue.vizType);
                //var dataModel = new JSONModel(jQuery.sap.getModulePath("demonewcassini.data", "/Reportdata.json"));
                //this.oVizFrame.setModel(dataModel);
                var oDataset = new FlattenedDataset(bindValue.dataset);
                this.oVizFrame.setDataset(oDataset);
                var props = bindValue.vizProperties;
                if (selectedKey !== 8 && props.plotArea) {
                	props.plotArea.dataPointStyle = null;
                }
                this.oVizFrame.setVizProperties(props);
                var feedValueAxis, feedValueAxis2, feedActualValues, feedTargetValues;
                if (selectedKey === 7) {
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': [bindValue.value[0]]
                    });
                    feedValueAxis2 = new FeedItem({
                        'uid': "valueAxis2",
                        'type': "Measure",
                        'values': [bindValue.value[1]]
                    });
                } else if (selectedKey === 8) {
                    feedActualValues = new FeedItem({
                        'uid': "actualValues",
                        'type': "Measure",
                        'values': [bindValue.value[0]]
                    });
                    feedTargetValues = new FeedItem({
                        'uid': "targetValues",
                        'type': "Measure",
                        'values': [bindValue.value[1]]
                    });
                } else {
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': bindValue.value
                    });
                }

                var feedTimeAxis = new FeedItem({
                    'uid': "timeAxis",
                    'type': "Dimension",
                    'values': ["Date"]
                }),
                feedBubbleWidth = new FeedItem({
                    "uid": "bubbleWidth",
                    "type": "Measure",
                    "values": ["Accrued"]
                });
                switch(selectedKey){
                    case 1:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        this.oVizFrame.addFeed(feedBubbleWidth);
                        break;
                    case 7:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedValueAxis2);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                    case 8:
                        this.oVizFrame.addFeed(feedActualValues);
                        this.oVizFrame.addFeed(feedTargetValues);
                        this.oVizFrame.addFeed(feedTimeAxis);
                    default:
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                }
            }
        }}); 
 
});