sap.ui.define([
	"demonewcassini/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"demonewcassini/js/jqueryJcrop",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Label',
	'sap/m/Text',
	"demonewcassini/js/tesseract",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageToast, Filter, FilterOperator, jqueryJcrop, Button, Dialog, Label, Text, tesseract,MessageBox) {
	"use strict";
	var Zid;
	var Zidentifier1;
	var Zidentifier2;
	var dg;
	var reultData;
	var oView;
	var selectedField = null;
	var arrCheck = false;
	return BaseController.extend("demonewcassini.controller.SDSettlement", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("editRule").attachPatternMatched(this._onObjectMatched, this);
			var nModel = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(nModel, "oModelCust1");
			var sPath = jQuery.sap.getModulePath("demonewcassini.data", "/SettlementTab.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel, "SettleModel");
			oView = this.getView();
			var oModelAcc = new JSONModel(jQuery.sap.getModulePath("demonewcassini.data", "/Accrualdata.json"));
			this.getView().setModel(oModelAcc, "AccModel");
			var setData = new JSONModel();
			oView.setModel(setData, "SettlementTabModel");
			var oDateModel = new sap.ui.model.json.JSONModel({
				currentDate: new Date().toLocaleDateString(),
				currentTime: new Date().toLocaleTimeString()
			});
			this.getView().setModel(oDateModel, "DateModel");
			
		},
		onPostSettlement: function(){
				MessageBox.information("Settlement document 50000001 has been booked in SAP");
		},
		
		_onObjectMatched: function(oEvent) {
			
			oView.byId("postingPerd").setValue("");
			//oView.byId("DP2").setValue("");
			//oView.byId("DP3").setValue("");

			var oDataD = oView.getModel("SettlementTabModel").getData();
			if (oDataD.length > 0) {
				this.getView().getModel("SettlementTabModel").setData([]);
				//oView.getModel("FooterModel").setData([]);

			}
			
			setTimeout(function() {
				var jcrop_api;
				$('.cropbox1').Jcrop({
					multi: true,
					canDelete: true,
					onDblClick: fnGetImg
				});
				//$('html').scrollTop(0);
                $('.ocrTextBox').click(function() {
					selectedField = $(this).attr('data-elementid');
				});

				function fnGetImg(coords) {
					sap.ui.core.BusyIndicator.show(0);
					var canvas = document.createElement("canvas");
					var imageObj = $(".cropbox1")[0];
					canvas.width = coords.w;
					canvas.height = coords.h;
					var context = canvas.getContext("2d");
					context.drawImage(imageObj, coords.x, coords.y, coords.w, coords.h, 0, 0, canvas.width, canvas.height);
					var png = canvas.toDataURL('image/png');
					var job1 = Tesseract.recognize(png);
					$('.process_img').css("display", "block");
					//job1.progress(message => console.log(message["progress"] * 100));
					job1.then(function(result) {
						sap.ui.core.BusyIndicator.hide();
						//	console.log('result is: ', result.text)
						var resultVal1 = result.text;
						var resultVal = $.trim(resultVal1);
						if (resultVal === "") {
							MessageToast.show("Please do proper selection");
						} else {
							$(".ocrTextBox[data-elementid=" + selectedField + "] input").val(resultVal);
						}
					});
				}
			}, 1000);
		},
			suggestionItemSelected: function(oEvent) {

			var oDataD = oView.getModel("CompSettleLineModel").getData();
			if (oDataD.length > 0) {
				this.getView().getModel("CompSettleLineModel").setData([]);
				//oView.getModel("FooterModel").setData([]);

			}
			var oObjectPath = oEvent.getParameter('selectedItem').getBindingContext("AccModel").getObject();
			var oModel = oView.getModel("contS");
			//oModel.refresh();
			var aFilter = [];
			var sContractNo = oView.getModel("CompSettleModel").getProperty("/ContractNo");
			var sPostPeriod = oObjectPath.PostPeriod;
			aFilter.push(new Filter("Contractno", FilterOperator.EQ, sContractNo));
			aFilter.push(new Filter("Period", FilterOperator.EQ, sPostPeriod));
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();
			oModel.read("/GetSettlementSet", {
				filters: aFilter,
				success: function(oData) {
					//oContractModel	 = new JSONModel(oData.results);
					oView.getModel("SettlementTabModel").setData(oData.results);
					console.log(oData);
					oGlobalBusyDialog.close();
				},
				error: function(oError) {
					console.log(oError);
				}
			});
			//this.byId("editTable").setModel(oObjectPath,"DummyModel");
			sap.ui.getCore().setModel(new JSONModel(oObjectPath), "DummyModel");
			this.byId("editTable").setModel(oView.getModel("SettlementTabModel"), "SettlementTabModel");
			//this.byId("DP2").setValue(sap.ui.getCore().getModel("DummyModel").getProperty("/DocumentDate"));
			//this.byId("DP3").setValue(sap.ui.getCore().getModel("DummyModel").getProperty("/AccrualDate"));

		},
		onEnterCustVal: function(oEvent) {
			var oTable = this.getView().byId("editTable");
			var oTabData = oTable.getModel("SettlementTabModel").getData();
			var accData = oTabData.map(function(a) {
				return parseFloat(a.Accamount);
			});
			if(!arrCheck){
			finalArr = accData;
			}
			var v = oEvent.getSource().getParent().getBindingContextPath();
			v = v.slice(v.indexOf("/") + 1);

			var sInputVal = oEvent.getSource().getValue();
			finalArr.splice(v, 1);

			if (sInputVal) {
				finalArr.splice(v, 0, parseInt(sInputVal));
			}
			var addAccruals = finalArr.reduce(function(acc, val) {
				return acc + val;
			}, 0);
			var oLabelNA = this.getView().byId("netAmount");
			oLabelNA.setValue(addAccruals.toFixed(2));

			var result = this.percentCalculation(addAccruals, 20);
			var oLabel = this.getView().byId("taxAmount");
			oLabel.setValue(result.toFixed(2));
			var gAmt = addAccruals + result;
			var oLabelGA = this.getView().byId("grossAmount");
			oLabelGA.setValue(gAmt.toFixed(2));
			arrCheck = true;
		},
		onUpdateFinished: function() {
			var oTable = this.getView().byId("editTable");
			var oTabData = oTable.getModel("SettlementTabModel").getData();
			//var accData = oTabData.map(oTabData => parseFloat(oTabData.Accruals));
			var accData = oTabData.map(function(a) {
				return parseFloat(a.Accamount);
			});

			var addAccruals = accData.reduce(function(acc, val) {
				return acc + val;
			}, 0);

			var oLabelNA = this.getView().byId("netAmount");
			oLabelNA.setValue(addAccruals.toFixed(2));

			var result = this.percentCalculation(addAccruals, 20);
			var oLabel = this.getView().byId("taxAmount");
			oLabel.setValue(result.toFixed(2));
			var gAmt = addAccruals + result;
			var oLabelGA = this.getView().byId("grossAmount");
			oLabelGA.setValue(gAmt.toFixed(2));
		},
		percentCalculation: function(a, b) {
			var c = (parseFloat(a) * parseFloat(b)) / 100;
			return parseFloat(c);
		}
	});
});