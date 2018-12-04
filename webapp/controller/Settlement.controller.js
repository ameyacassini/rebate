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
], function(BaseController, JSONModel, MessageToast, Filter, FilterOperator, jqueryJcrop, Button, Dialog, Label, Text, tesseract,
	MessageBox) {
	"use strict";
	var oView;
	var Zid;
	var Zidentifier1;
	var Zidentifier2;
	var dg;
	var reultData;
	var finalArr =[];
	var arrCheck = false;
	var selectedField = null;
	return BaseController.extend("demonewcassini.controller.Settlement", {
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
	

		_onObjectMatched: function(oEvent) {

			/*	var oModel = this.getView().getModel("contS");
				var aFilter = [];
				var contModel = this.getOwnerComponent().getModel("CompSettleModel");
				var sContID = contModel.ContractNo;                         
				aFilter.push(new Filter("Contractno", sap.ui.model.FilterOperator.EQ, sContID));
				var that = this;
				oModel.read("/CONT_HEADERSet", {
					filters: aFilter,
					urlParameters: {
						"$expand": "CONT_HEADERTOCONT_ITEM"
					},
					success: that._onUpdateEntrySuccess.bind(that),
					error: function(oData) {
						console.log("error");
					}

				});
				*/
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
			oModel.read("/SETTLE_HEADERSet", {
				filters: aFilter,
				urlParameters: {
					"$expand": "SETTLE_HEADERTOSETTLE_ITEM"
				},
				success: function(oData) {
					//oContractModel	 = new JSONModel(oData.results);
					for(var i=0;i<oData.results.length;i++){
						oView.getModel("SettlementTabModel").setData(oData.results[i]);
						
					};
					//oView.getModel("SettlementTabModel").setData(oData.results.SETTLE_HEADERTOSETTLE_ITEM.results);
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
			var oTabData = oTable.getModel("SettlementTabModel").getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results");
			var accData = oTabData.map(function(a) {
				return parseFloat(a.Accamount);
			});
			if(!arrCheck){
			finalArr = accData;
			}
			var v = oEvent.getSource().getParent().getBindingContextPath();
			v = v.slice(v.indexOf("/") + 36);
			
			var sInputVal = oEvent.getSource().getValue();
			finalArr.splice(v, 1);

			if (sInputVal) {
				finalArr.splice(v, 0, parseInt(sInputVal));
				oTabData[v].Custamount = sInputVal;
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
		onPostSettlement: function() {
			var oTable = this.getView().byId("editTable");
			var aItems = oTable.getItems();
			var itemData = [];
			var settleModel = this.getView().getModel("SettlementTabModel");
			var contNo = "";
			for(var i = 0; i < aItems.length ; i++){
				var l_Prodno = settleModel.getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results/" + i + "/Prodno");
				var l_Contractno = settleModel.getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results/" + i + "/Contractno");
				contNo = l_Contractno;
				var l_Description = settleModel.getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results/" + i + "/Description");
				var l_Natureid = settleModel.getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results/" + i + "/Natureid");
				var l_Accamount = settleModel.getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results/" + i + "/Accamount");
				var l_Custamount = settleModel.getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results/" + i + "/Custamount");
					itemData.push({
					Prodno: l_Prodno,
					Description: l_Description,
					Natureid: l_Natureid,
					Accamount: l_Accamount,
					Custamount: l_Custamount,
					Contractno: l_Contractno
				});
			
			}
			var oEntry1 = {};
			oEntry1.Bukrs = settleModel.getProperty("/Bukrs");
			oEntry1.Contractno = contNo;
			oEntry1.Period = this.getView().byId("postingPerd").getValue();
			oEntry1.Vendor = settleModel.getProperty("/Vendor");
			oEntry1.Postingdate = this.changeDateFormat(this.getView().byId("DP3").getValue());
			oEntry1.Invoicedate = "2018-08-31T00:00:00";
			oEntry1.Reference = this.getView().byId("refNumber").getValue();
			oEntry1.Itemtext = this.getView().byId("text").getValue();
			oEntry1.Taxcode = this.getView().byId("taxCode").getValue();
			oEntry1.Taxamount = this.getView().byId("taxAmount").getValue();
			oEntry1.SETTLE_HEADERTOSETTLE_ITEM = itemData;
			var oModelCreate = this.getView().getModel("contS");
			sap.ui.core.BusyIndicator.show(0); 
			var oContext = oModelCreate.create("/SETTLE_HEADERSet", oEntry1, {
				success: this._onCreateEntrySuccess.bind(this),
				error: this._onCreateEntryError.bind(this)
			});
		},
		changeDateFormat: function(valDate) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var date = new Date(valDate);
			var dateStr = dateFormat.format(date);
			return (dateStr + "T00:00:00");
		},
		_onCreateEntrySuccess: function(oObject, oResponse) {
			sap.ui.core.BusyIndicator.hide();
			MessageBox.success("Document Number #" + oResponse.data.Message.substr(0,10)+ " Successfully Posted");
			oView.byId("postingPerd").setValue("");
			//oView.byId("DP2").setValue("");
			//oView.byId("DP3").setValue("");
			oView.byId("customer").setValue("");
			oView.byId("refNumber").setValue("");
			oView.byId("text").setValue("");
			oView.byId("taxCode").setValue("");
			oView.byId("taxAmount").setValue("");
			this.getView().getModel("SettlementTabModel").setData([]);
			
		},
		_onCreateEntryError: function(oError) {
			sap.ui.core.BusyIndicator.hide();
			MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);
		},
		onUpdateFinished: function() {
			var oTable = this.getView().byId("editTable");
			var oTabData = oTable.getModel("SettlementTabModel").getProperty("/SETTLE_HEADERTOSETTLE_ITEM/results");
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