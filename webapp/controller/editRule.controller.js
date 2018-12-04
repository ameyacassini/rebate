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
	"demonewcassini/js/tesseract"
], function(BaseController, JSONModel, MessageToast, Filter, FilterOperator, jqueryJcrop, Button, Dialog, Label, Text, tesseract) {
	"use strict";
	var Zid;
	var Zidentifier1;
	var Zidentifier2;
	var dg;
	var reultData;
	var oView, oController, oComponent;
	return BaseController.extend("demonewcassini.controller.editRule", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
				setTimeout(function() {
				//var jcrop_api;
				var validation = {
					isNumber: function(str) {
						var patterNum = /^[0-9.,]+$/;
						var patterStr = /^[A-Za-z\s.@,/&()]+$/;
						var patterAlNum = /^[0-9A-Za-z\s.@/]+$/;
						if (patterStr.test(str)) {
							return "String";
						} else if (patterNum.test(str)) {
							return "Integer";
						} else if (patterAlNum.test(str)) {
							return "Alphanumeric";
						} else {
							return "error";
						}
						// returns a boolean
					}
				};
				//jcrop_api = this;
				$('.cropbox1').Jcrop({
					multi: true,
					canDelete: true,
					onDblClick: fnGetImg
				});
				
				function fnGetImg(coords) {
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
						//	console.log('result is: ', result.text)
						var resultVal1 = result.text;
						var resultVal = $.trim(resultVal1);
						if (resultVal === "") {
							MessageToast.show("Please do proper selection");
						} else {
							$(".writableLength input").each(function() {
								if (!$(this).hasClass("disabled")) {
									if ($(this).val() == '' && resultVal != '') {
										var $tdPrevs = $(this).closest('td').prev('td').attr('id');

										var Stype = validation.isNumber(resultVal);
										if (Stype == "error") {
											MessageToast.show("Please do proper selection");

										} else {
											$(this).val(Stype + '(' + resultVal.length + ')');
											$(this).addClass("disabled");
											var $tds = $(this).closest('td').next('td').attr('id'); //$row.find("td:nth-child(4)"); 
											$("#" + $tds + ' .writableVal input').val(resultVal);
											var trId = $(this).closest('tr').attr('id');
											$("#" + trId).addClass("filledRow");
										}

									}
									$('.process_img').css("display", "none");
								}
							});

							$(".editablelength input").each(function() {
								//	if (!$(this).hasClass("disabled")) {
								if (resultVal != '') {
									var $tdPrevs = $(this).closest('td').prev('td').attr('id');

									var Stype = validation.isNumber(resultVal);
									if (Stype == "error") {
										MessageToast.show("Please do proper selection");

									} else {
										$(this).val(Stype + '(' + resultVal.length + ')');
										//$(this).addClass("disabled");
										var $tds = $(this).closest('td').next('td').attr('id'); //$row.find("td:nth-child(4)"); 
										$("#" + $tds + ' .writableVal input').val(resultVal);
										var trId = $(this).closest('tr').attr('id');
										$("#" + trId).addClass("filledRow");
									}

								}
								$('.process_img').css("display", "none");
								//	}
							});
						}
					});

				}

			}, 1000);
			setTimeout(function() {
				$('html').scrollTop(0);
			}, 3000);
			$(document).ready(function() {
				$(document).ajaxStart(function() {
					$('.process_img').css("display", "block");
				});
				$(document).ajaxComplete(function() {
					$('.process_img').css("display", "none");
				});
			});
			
			this.getRouter().getRoute("editRule").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'editRule';
			globalKeys.refresh(true);
			
			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');
		},
		
		fnEditRow: function(oEvent) {
			var editTable = this.getView().byId("editTable").getItems().length;
			var editStatus;
			for (var j = 0; j < editTable; j++) {
				var editStatus = this.getView().byId("editTable").getItems()[j].getCells()[0].mProperties.enabled;
				if (editStatus == true) {
					editStatus = "true";
					break;
				}
			}
			if (editStatus === false) {
				var editIcon = oEvent.getSource().getParent().mAggregations.content[0].getId();
				sap.ui.getCore().byId(editIcon).setVisible(false);
				var deleteIcon = oEvent.getSource().getParent().mAggregations.content[1].getId();
				sap.ui.getCore().byId(deleteIcon).setVisible(false);
				var closeIcon = oEvent.getSource().getParent().mAggregations.content[2].getId();
				sap.ui.getCore().byId(closeIcon).setVisible(true);
				var cellLength = oEvent.getSource().getParent().getParent().getCells().length;
				for (var i = 1; i < cellLength - 1; i++) {
					oEvent.getSource().getParent().getParent().getCells()[0].addStyleClass("nonEditableDD");
					var ValCol0 = oEvent.getSource().getParent().getParent().getCells()[0].getId();
					//this.getView().byId(ValCol0).setEnabled(true);
					var ValCol1 = oEvent.getSource().getParent().getParent().getCells()[1].getId();
					this.getView().byId(ValCol1).setEditable(true);
					this.getView().byId(ValCol1).addStyleClass("editablelength");
					var ValCol2 = oEvent.getSource().getParent().getParent().getCells()[2].getId();
					this.getView().byId(ValCol2).setEditable(true);
				}
			} else {
				MessageToast.show("You Can Edit Only One Row At a Time");
			}
		},
		fnonAddRow: function() {

			var oTable = this.getView().byId("editTable");
			var length = this.getView().byId("editTable").getItems().length;
			var item = this.getView().byId("editTable").getItems()[length - 1];
			var lastIndex = oTable.indexOfItem(item);
			var ValCol = this.getView().byId("editTable").getItems()[lastIndex].getCells()[1].getId();
			var textVal = sap.ui.getCore().byId(ValCol).getValue();
			/*for (var i = 0; i <= length - 1; i++) {
				var ValCol1 = this.getView().byId("editTable").getItems()[i].getCells()[1].getId();
				var textVal1 = sap.ui.getCore().byId(ValCol1).getValue();
				if (textVal1 !== "") {
					var itemForCss = this.getView().byId("editTable").getItems()[i];
					itemForCss.addStyleClass("sapMLIB sapMLIB-CTX sapMLIBFocusable sapMLIBShowSeparator sapMLIBTypeInactive sapMListTblRow filledRow");
				}
			}*/
			if (textVal !== "") {
				var newRecord = {
					"Zattribute": "",
					"lengthType": "",
					"Zidentifier": ""
				};
				var oTableData = this.getView().byId("editTable").getModel("Data").getProperty("/Table");
				oTableData.push(newRecord);
				this.getView().byId("editTable").getModel("Data").setProperty("/Table", oTableData);
				this.getView().byId("editTable").getModel("Data").refresh();
				var length1 = this.getView().byId("editTable").getItems().length;
				var item1 = this.getView().byId("editTable").getItems()[length1 - 1];
				var lastIndex1 = oTable.indexOfItem(item1);
				this.getView().byId("editTable").getItems()[lastIndex1].getCells()[0].addStyleClass("nonEditableDD");
				var cell0 = this.getView().byId("editTable").getItems()[lastIndex1].getCells()[0].getId();
				this.getView().byId(cell0).setEnabled(true);
				var cell1 = this.getView().byId("editTable").getItems()[lastIndex1].getCells()[1].getId();
				this.getView().byId(cell1).setEditable(true);
				this.getView().byId(cell1).setValue("");
				this.getView().byId(cell1).addStyleClass("writableLength");
				var cell2 = this.getView().byId("editTable").getItems()[lastIndex1].getCells()[2].getId();
				this.getView().byId(cell2).setEditable(true);
				var cell3 = this.getView().byId("editTable").getItems()[lastIndex1].getCells()[3].mAggregations.content[0].getId();
				sap.ui.getCore().byId(cell3).setVisible(false);
			} else {
				MessageToast.show("Select data for current row First!");
			}
			var editTable = this.getView().byId("editTable").getItems().length;
			for (var j = 0; j < editTable; j++) {
				var editIcon = this.getView().byId("editTable").getItems()[j].getCells()[3].mAggregations.content[0].getId();
				sap.ui.getCore().byId(editIcon).setVisible(true);
				var deleteIcon = this.getView().byId("editTable").getItems()[j].getCells()[3].mAggregations.content[1].getId();
				sap.ui.getCore().byId(deleteIcon).setVisible(true);
				var claseIcon = this.getView().byId("editTable").getItems()[j].getCells()[3].mAggregations.content[2].getId();
				sap.ui.getCore().byId(claseIcon).setVisible(false);
				var disableData0 = this.getView().byId("editTable").getItems()[j].getCells()[0].getId();
				this.getView().byId(disableData0).setEnabled(false);
				var disableData1 = this.getView().byId("editTable").getItems()[j].getCells()[1].getId();
				this.getView().byId(disableData1).setEditable(false);
				var disableData2 = this.getView().byId("editTable").getItems()[j].getCells()[2].getId();
				this.getView().byId(disableData2).setEditable(false);
				var cSS = this.getView().byId("editTable").getItems()[j].getCells()[0].mCustomStyleClassMap.nonEditableDD;
				if (cSS == true) {
					this.getView().byId("editTable").getItems()[j].getCells()[0].removeStyleClass("nonEditableDD");
				}
			}
		},
		fncloseRow: function(oEvent) {
			var editIcon = oEvent.getSource().getParent().mAggregations.content[0].getId();
			sap.ui.getCore().byId(editIcon).setVisible(true);
			var editIcon = oEvent.getSource().getParent().mAggregations.content[1].getId();
			sap.ui.getCore().byId(editIcon).setVisible(true);
			var closeIcon = oEvent.getSource().getParent().mAggregations.content[2].getId();
			sap.ui.getCore().byId(closeIcon).setVisible(false);
			oEvent.getSource().getParent().getParent().getCells()[0].removeStyleClass("nonEditableDD");
			var ValCol0 = oEvent.getSource().getParent().getParent().getCells()[0].getId();
			this.getView().byId(ValCol0).setEnabled(false);
			var ValCol1 = oEvent.getSource().getParent().getParent().getCells()[1].getId();
			this.getView().byId(ValCol1).setEditable(false);
			this.getView().byId(ValCol1).removeStyleClass("editablelength");
			var ValCol2 = oEvent.getSource().getParent().getParent().getCells()[2].getId();
			this.getView().byId(ValCol2).setEditable(false);
		},
		fonct: function() {
			var promise = jQuery.Deferred();
			var aFilter = [];
			var oModel = this.getView().getModel("rulelist");
			if (this.Zid) {
				aFilter.push(new Filter("Zid", FilterOperator.EQ, this.Zid));
				aFilter.push(new Filter("Zidentifier1", FilterOperator.EQ, this.Zidentifier1));
				aFilter.push(new Filter("Zidentifier2", FilterOperator.EQ, this.Zidentifier2));
			}

			oModel.read("/ZrulepageSet", {
				filters: aFilter,
				success: function(data) {
					var boo1 = data.results;
					return boo1;
				}
			});

		},
		fnUpdate: function(oEvent) {
		var d=this.fonct();
		console.log(d);
			var i;
			var length = this.getView().byId("editTable").getItems().length;
			var oModelT = this.getView().byId("editTable").getModel("Data").getProperty("/Table");

			var oModel = this.getView().getModel("rulelist");
			oModel.setUseBatch(false);
			var Zidentifier1 = $(".vender_name input").val();
			var Zidentifier2 = $(".pin_code input").val();

			/*	var aFilter = [];
				if (this.Zid) {
					aFilter.push(new Filter("Zid", FilterOperator.EQ, this.Zid));
					aFilter.push(new Filter("Zidentifier1", FilterOperator.EQ, this.Zidentifier1));
					aFilter.push(new Filter("Zidentifier2", FilterOperator.EQ, this.Zidentifier2));
				}
				var that = this;
				oModel.read("/ZrulepageSet", {
					filters: aFilter,
					success: function(data) {

						$.sap.myVar = data.results;
					
					}
				});
				console.log($.sap.myVar);*/
			//	console.log("-----");
			//	console.log(this.newArr);
			for (i = 0; i < length; i++) {
				var key1 = this.getView().byId("editTable").getItems()[i].getCells()[0].getSelectedItem().getText();
				var type1 = this.getView().byId("editTable").getItems()[i].getCells()[1].getValue();
				var myArray1 = type1.match(/[^()]+/g);
				var oData = {
					Zid: this.Zid,
					Zidentifier1: Zidentifier1,
					Zidentifier2: Zidentifier2,
					Zattribute: key1,
					Zlength: myArray1[0],
					Zvalue: myArray1[1]
				};
				console.log("after update-" + oData.Zattribute);
				/*oModel.createEntry("/ZrulepageSet", {
					properties: oData
				});*/

				oModel.update("/ZrulepageSet(Zid='" + this.Zid + "',Zidentifier1='" + Zidentifier1 + "',Zidentifier2='" + Zidentifier2 + "')",
					oData, {
						method: "PUT"
					});

			}
			sap.ui.core.BusyIndicator.show(0);

			oModel.attachRequestCompleted(function() {
				MessageToast.show("Updated Successfully !!");
					sap.ui.core.BusyIndicator.hide();
			});
	
			oModel.attachRequestFailed(function() {
				MessageToast.show("Error !!");
			});
			/*	oModel.submitChanges({
				success: function(response) {
					MessageToast.show("Updated Successfully !!");
					sap.ui.core.BusyIndicator.hide();

				},
				error: function(oError) {
					MessageToast.show("Error!");
					sap.ui.core.BusyIndicator.hide();

				}
			});
*/
		},
		fnDeleteRule: function(event) {

			var Zidentifier1 = $(".vender_name input").val();
			var Zidentifier2 = $(".pin_code input").val();
			var trId = event.getSource().getParent().getParent().getId();
			var ValCol0 = event.getSource().getParent().getParent().getCells()[0].getId();
			var Zattribute = sap.ui.getCore().byId(ValCol0).getSelectedKey();
			var sPath = "/ZrulepageSet_del(Zid='" + this.Zid + "',Zidentifier1='" + Zidentifier1 + "',Zidentifier2='" + Zidentifier2 +
				"',Zattribute='" + Zattribute + "')";
			console.log(sPath);
			var oModel = this.getView().getModel("rulelist");
			oModel.setUseBatch(false);
			var ZuserName = "Arti H";
			var Ztimestamp = "20180606070809";
			var Action = "Delete";
			var LogOdata = {
				Zid: this.Zid,
				Zidentifier1: Zidentifier1,
				Zidentifier2: Zidentifier2,
				Zattribute: Zattribute,
				ZuserName: ZuserName,
				Ztimestamp: Ztimestamp,
				Action: Action
			}

			var vb = this.getView();
			if (Zattribute === "Vendor Name" || Zattribute === "Pin Code") {
				MessageToast.show('You cant delete Vendor Name and Pin Code!');
			} else {
				var delData = this.getView().byId("editTable").getModel("Data").getProperty("/Table");
				var tModel = this.getView().byId("editTable").getModel("Data");
				var _helpArray = [];
				var deleteRecord = event.getSource().getBindingContext("Data").getObject();
				var dialog = new Dialog({
					title: 'Confirm',
					type: 'Message',
					content: new Text({
						text: 'Are you sure you want to delete your this row?'
					}),
					beginButton: new Button({
						text: 'Submit',
						press: function() {
							oModel.remove(sPath, {
								method: "DELETE",
								success: function(data) {
									console.log(data);
									MessageToast.show('Ruleset Deleted!');

									oModel.create("/ZUser_LogSet", LogOdata, {
										method: "POST",
										success: function(data) {
											console.log("success");
										},
										error: function(e) {
											console.log("error");
										}
									});

									for (var i = 0; i < delData.length; i++) {
										if (JSON.stringify(delData[i]) !== JSON.stringify(deleteRecord)) {
											_helpArray.push(delData[i]);
										}
									}
									tModel.setProperty("/Table", _helpArray);
								},
								error: function(e) {
									MessageToast.show('Error!');
								}
							});
							dialog.close();
						}
					}).addStyleClass("btnSuccess"),
					endButton: new Button({
						text: 'Cancel',
						press: function() {
							dialog.close();
						}
					}).addStyleClass("btnCancel"),
					afterClose: function() {
						dialog.destroy();
					}
				});

				dialog.open();
			}
		},
		fnChangeField: function(oEvent) {
			var vselectedItem = oEvent.getSource().getSelectedKey();
			var vselectedItemSID = oEvent.getSource().getSelectedItem().getId();
			var rowN3 = oEvent.getSource().getParent();
			var ValCol = rowN3.getCells()[2];
			if (vselectedItem === "Pin Code" || vselectedItem === "Vendor Name") {
				ValCol.setVisible(true);
			} else {
				ValCol.setVisible(false);
			}
			if (vselectedItem === "Pin Code") {
				ValCol.addStyleClass("pin_code");
			}
			if (vselectedItem === "Vendor Name") {
				ValCol.addStyleClass("vender_name");
			}
			var i;
			var length = this.getView().byId("editTable").getItems().length;
			for (i = 0; i < length; i++) {
				var repeatedItem = this.getView().byId("editTable").getItems()[i].getCells()[0].getSelectedItem().getText();
				var repeatedItemSID = this.getView().byId("editTable").getItems()[i].getCells()[0].getSelectedItem().getId();
				if (vselectedItem === repeatedItem && vselectedItemSID !== repeatedItemSID) {
					MessageToast.show("Sorry you can't select it more then one time");
					var path = oEvent.getSource().getParent().getBindingContext("Data").sPath;
					var a = path.split("/Table/");
					var vIndex = a[1];
					var viewMdl = this.getView().byId("editTable").getModel("Data").getProperty("/Table");
					viewMdl.splice(vIndex, 1);
					this.getView().byId("editTable").getModel("Data").refresh();
				}
			}
		}
	});
});