sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"demonewcassini/controller/BaseController",
	'sap/m/TablePersoController',
	'demonewcassini/service/DemoPersoService',
	"sap/m/PDFViewer",
	"sap/m/MessageToast",
	'sap/ui/model/Filter',
	"demonewcassini/model/AgreementPerSale",
	"demonewcassini/model/AgreementFixedAmount",
	"demonewcassini/model/AgreementLumpSum",
	'sap/m/MessageBox',
	"demonewcassini/model/formatter",
	"sap/ui/model/FilterOperator"
], function(
	jQuery,
	Controller,
	JSONModel,
	BaseController,
	TablePersoController,
	DemoPersoService,
	PDFViewer,
	MessageToast,
	Filter,
	AgreementPerSale,
	AgreementFixedAmount,
	AgreementLumpSum,
	MessageBox,
	formatter,
	FilterOperator
) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("demonewcassini.controller.AgreementDetails", {
		formatter: formatter,
		onInit: function() {

			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			//var oModel = new JSONModel(jQuery.sap.getModulePath("demonewcassini.data", "/IPDocument.json"));
			//this.getView().setModel(oModel, "IPModel");
			var oGroupingModel = new JSONModel({
				hasGrouping: false
			});
			var accData = new JSONModel();
			oView.setModel(accData, "AccrualDatModel");

			this.getView().setModel(oGroupingModel, 'Grouping');
			var oModelAcc = new JSONModel(jQuery.sap.getModulePath("demonewcassini.data", "/Accrualdata.json"));
			this.getView().setModel(oModelAcc, "AccModel");
			var sPathN = jQuery.sap.getModulePath("demonewcassini.data", "/NatureData.json");
			var oModelN = new JSONModel(sPathN);
			this.getView().setModel(oModelN, "NatureModel");
			var agrTabModel = new JSONModel();
			var perSaleModel = new JSONModel();
			var fixedAmtModel = new JSONModel();
			var lumpSumModel = new JSONModel();
			this.getView().setModel(agrTabModel, "AgreementTab");
			this.getView().setModel(perSaleModel, "perSaleTab");
			this.getView().setModel(fixedAmtModel, "fixedAmtTab");
			this.getView().setModel(lumpSumModel, "lumpSumTab");

			var oEditModel = new JSONModel({
				isEditable: false
			});

			this.getView().setModel(oEditModel, "EditModel");
			
			var oEditContModel = new JSONModel({
				SettleMentID: "",
				SettleMentDesc: "",
				TopazAccID:"",
				TopazAccDesc:"",
				FlexibleGrpNo:"",
				NatureID:"",
				NatureDesc:""
			});

			this.getView().setModel(oEditContModel, "AddEditModel");

			/*var oFooterModel = new JSONModel({
				Customer: "",
				Account : "",
				Assignment : "",
				Amount: ""
			});
			this.getView().setModel(oFooterModel, "FooterModel");

			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("idAccrualTab"),
				//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
				componentName: "demonewcassini",
				persoService: DemoPersoService
			}).activate();*/

			this.getRouter().getRoute("agreementdetails").attachPatternMatched(this._onObjectMatched, this);
			this._pdfViewer = new PDFViewer();
			this.getView().addDependent(this._pdfViewer);
		},

		onPostAccrual: function() {
			var oModelCreate = this.getView().getModel("contS");
			var vdocdate = oView.byId("DP2").getValue();
			var vdocdate1 = new Date(vdocdate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
			var vpostdate = oView.byId("DP3").getValue();
			var vpostdate1 = new Date(vpostdate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
			var oEntry1 = {};
			oEntry1.Contractno = oView.getModel("AgreementN").getProperty("/ContractNo");
			oEntry1.Period = oView.byId("postingPerd").getValue();
			oEntry1.Message = "";
			oEntry1.Docdate = this.changeDateFormat(vdocdate1);
			oEntry1.Postdate = this.changeDateFormat(vpostdate1);
			sap.ui.core.BusyIndicator.show(0);
			//oEntry1.Docdate = "2018-08-31T00:00:00";
			//oEntry1.Postdate = "2018-08-31T00:00:00";
			var oContext = oModelCreate.create("/AccrualsSet", oEntry1, {
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
			MessageBox.information("Accrual Document Number # " + oResponse.data.Message.substr(0,10) + " successfully posted.");
			//MessageToast.show("Successfully posted!" + oResponse.data.Message);
			oView.byId("DP2").setValue("");
			oView.byId("DP3").setValue("");
			oView.byId("postingPerd").setValue("");
			oView.getModel("AccrualDatModel").setData([]);
			oView.byId("footerAccount").setText("");
			oView.byId("footerAmount").setText("");
			oView.byId("footerAssign").setText("");
			oView.byId("footerCustomer").setText("");
			//oView.getModel("FooterModel").setData([]);
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
			var oTable = this.getView().byId("eligibleInvoiceTab");
			var oTabData = oTable.getModel("ContractModel").getData();
			//var accData = oTabData.map(oTabData => parseFloat(oTabData.Accruals));
			var accData = oTabData.map(function(a) {
				return parseFloat(a.Accruals);
			});

			var addAccruals = accData.reduce(function(acc, val) {
				return acc + val;
			}, 0);
			var fFinalAcc = this.addZeroes(addAccruals);
			var oLabel = this.getView().byId("footerTotal");
			oLabel.setText(fFinalAcc);

		},
		onUpdateFinishedAcc: function() {
			var oTable = this.getView().byId("idAccrualTab");
			var oTabData = oTable.getModel("AccrualDatModel").getData();
			// if (oTabData.length > 0) {
				//var accData = oTabData.map(oTabData => parseFloat(oTabData.Accruals));

				var accData = oTabData.map(function(a) {
					return parseFloat(a.Accruals);
				});

				var addAccruals = accData.reduce(function(acc, val) {
					return acc + val;
				}, 0);
				var fFinalAcc = this.addZeroes(addAccruals);
				var oLabel = this.getView().byId("footerAmount");
				//oView.getModel("FooterModel").setProperty("/Amount"," - " + fFinalAcc);
				oLabel.setText(" - " + fFinalAcc);

				//check account
				var bCheck1 = this.userExists("E235502C");
				var bCheck2 = this.userExists("R091103C");
				var oLabelcc = this.getView().byId("footerAccount");
				if (bCheck1) {
					oLabelcc.setText("LL12843C");
					//oView.getModel("FooterModel").setProperty("/Account","LL12843C");
				}
				if (bCheck2) {
					oLabelcc.setText("AL12981C");
					//oView.getModel("FooterModel").setProperty("/Account","AL12981C");
				}

				//footer customer

				var custData = oTabData.map(function(a) {
					return a.Customer;
				});

				var addCust = custData.reduce(function(acc, val) {
					return val;
				});

				var oLabelCust = this.getView().byId("footerCustomer");
				oLabelCust.setText(addCust);
				//oView.getModel("FooterModel").setProperty("/Customer",addCust);

				//footer Assignment

				var assignData = oTabData.map(function(a) {
					return a.Contractno;
				});

				var addAssign = assignData.reduce(function(acc, val) {
					return val;
				});

				var oLabelCust = this.getView().byId("footerAssign");
				oLabelCust.setText(addAssign);
			//}
		},
		userExists: function(sAccount) {
			var oTableS = this.getView().byId("idAccrualTab");
			var oTabDataS = oTableS.getModel("AccrualDatModel").getData();
			return oTabDataS.some(function(el) {
				return el.Glaccount === sAccount;
			});
		},
		addZeroes: function(num) {
			// Convert input string to a number and store as a variable.
			var num = Number(num);

			// Split the input string into two arrays containing integers/decimals
			//if (String(num).split(".").length < 2 || String(num).split(".")[1].length <= 2) {
				num = num.toFixed(2);
			//}
			// Return updated or original number.
			return num;
		},
		onOpenDetails: function(oEvent) {
			var oPopover = this._getPopover(),
				oOpener = oEvent.getParameter("domRef");
			oPopover.bindElement(oEvent.getSource().getBindingContext("IPModel").getPath());
			oPopover.openBy(oOpener);
		},
		_getPopover: function() {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("demonewcassini.fragment.MaterailPopOver", this);
				this.getView().addDependent(this._oPopover);
			}
			return this._oPopover;
		},

		_onObjectMatched: function(oEvent) {
			oComponent.getModel("CompSettleLineModel").setData([]);
			oComponent.getModel("CompSettleModel").setData([]);
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'agreementdetails';
			globalKeys.refresh(true);

			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');

			var sObjectPath = oEvent.getParameter("arguments").sPathdet;
	
			var oModel = this.getView().getModel("contS");
			var aFilter = [];
			aFilter.push(new Filter("Contractno", sap.ui.model.FilterOperator.EQ, sObjectPath));
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
			//this._bindView(sObjectPath);

			/*var perSale = new AgreementPerSale();
			this.getView().setModel(perSale.getModel(), 'PerSale');
			
			var fixedAmount = new AgreementFixedAmount();
			this.getView().setModel(fixedAmount.getModel(), 'FixedAmount');
			
			var lumpSum = new AgreementLumpSum();
			this.getView().setModel(lumpSum.getModel(), 'LumpSum');*/
		},
		_onUpdateEntrySuccess: function(oObject) {
			var agreementSets = [];
			var agreementMod = {};
			agreementMod.CustomerID = oObject.results[0].Custid;
			agreementMod.CustomerName = oObject.results[0].Custname;
			agreementMod.Country = oObject.results[0].Country;
			agreementMod.ValidFrom = oObject.results[0].ValidFrom.toDateString();
			agreementMod.ValidTo = oObject.results[0].ValidTo.toDateString();
			agreementMod.ContractNo = oObject.results[0].Contractno;
			var agrModel = new JSONModel();
			this.getView().setModel(agrModel, "AgreementN");
			this.getView().getModel("AgreementN").setData(agreementMod);
			this.getOwnerComponent().getModel("CompSettleModel").setData(agreementMod);
			//create view models
			var oPerSale = {};
			var oFixedAmount = {};
			var oLumpSum = {};
			var oObjData = oObject.results[0].CONT_HEADERTOCONT_ITEM;
			for (var i = 0; i < oObjData.results.length; i++) {
				var item = oObjData.results[i];
				agreementSets.push(item);
				if (oObjData.results[i].Itemtype === "Z001") {
					oPerSale.Chardesc = oObjData.results[i].Chardesc;
					oPerSale.Chardid = oObjData.results[i].Chardid;
					oPerSale.Contractno = oObjData.results[i].Contractno;
					oPerSale.EstimatedSales = oObjData.results[i].EstimatedSales;
					oPerSale.EstimatedVol = oObjData.results[i].EstimatedVol;
					oPerSale.Naturedesc = oObjData.results[i].Naturedesc;
					oPerSale.Natureid = oObjData.results[i].Natureid;
					oPerSale.Prodno = oObjData.results[i].Prodno;
					oPerSale.Rate = oObjData.results[i].Rate;
					oPerSale.Settlement = oObjData.results[i].Settlement;
					oPerSale.Uom = oObjData.results[i].Uom;

				} else if (oObjData.results[i].Itemtype === "Z002") {
					oFixedAmount.Chardesc = oObjData.results[i].Chardesc;
					oFixedAmount.Chardid = oObjData.results[i].Chardid;
					oFixedAmount.Contractno = oObjData.results[i].Contractno;
					// oFixedAmount.EstimatedSales = oObjData.results[i].EstimatedSales;
					oFixedAmount.EstimatedVol = oObjData.results[i].EstimatedVol;
					oFixedAmount.Naturedesc = oObjData.results[i].Naturedesc;
					oFixedAmount.Natureid = oObjData.results[i].Natureid;
					oFixedAmount.Prodno = oObjData.results[i].Prodno;
					oFixedAmount.Rate = oObjData.results[i].Rate;
					oFixedAmount.Settlement = oObjData.results[i].Settlement;
					oFixedAmount.Uom = oObjData.results[i].Uom;

				} else if (oObjData.results[i].Itemtype === "Z003") {
					oLumpSum.Chardesc = oObjData.results[i].Chardesc;
					oLumpSum.Chardid = oObjData.results[i].Chardid;
					oLumpSum.Contractno = oObjData.results[i].Contractno;
					oLumpSum.EstimatedSales = oObjData.results[i].EstimatedSales;
					oLumpSum.EstimatedVol = oObjData.results[i].EstimatedVol;
					oLumpSum.Naturedesc = oObjData.results[i].Naturedesc;
					oLumpSum.Natureid = oObjData.results[i].Natureid;
					oLumpSum.Prodno = oObjData.results[i].Prodno;
					oLumpSum.Rate = oObjData.results[i].Rate;
					oLumpSum.Settlement = oObjData.results[i].Settlement;
					oLumpSum.Uom = oObjData.results[i].Uom;

				}
			}

			oView.getModel("AgreementTab").setData(agreementSets);
			this.getOwnerComponent().getModel("CompSettleLineModel").setData(agreementSets);
			/*this.getView().getModel("perSaleTab").setData(oPerSale);
			this.getView().getModel("fixedAmtTab").setData(oFixedAmount);
			this.getView().getModel("lumpSumTab").setData(oLumpSum);*/

		},

		onPressImage: function(oEvent) {
			/*var sPath = this.getView().getBindingContext().sPath;
			var lastChar = sPath[sPath.length - 1];
			var sSource = oEvent.getSource().getModel().getData().HeaderCollection[lastChar].AgreementCopy;*/

			var oAgreementModel = this.getView().getModel('Agreement');
			var sSource = oAgreementModel.getData().AgreementCopy;

			this._pdfViewer.setSource(sSource);
			this._pdfViewer.setTitle("Agreement Copy");
			this._pdfViewer.open();
		},

		onSettlePress: function() {
			var setMeth = oView.getModel("AgreementTab").getData();
			if(setMeth.length > 0){
				var actMeth = setMeth[0].Settlement;
				if(actMeth === "MM"){
					this.getRouter().navTo("editRule");
				}else if(actMeth === "SD"){
					this.getRouter().navTo("editSDRule");
				}else{
					MessageBox.error("Select MM or SD");
				}
			}
			
			
		},

		/**** IP Document Fragment***/
		onPersoButtonPressed: function(oEvent) {
			this._oTPC.openDialog();
		},

		onTablePersoRefresh: function() {
			DemoPersoService.resetPersData();
			this._oTPC.refresh();
		},

		onTableGrouping: function(oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		},
		onAccrualsPress: function(oEvent) {

			//oView.getModel("AccrualDatModel").setData([]);
			//oView.getModel("FooterModel").setData([]);

			this.oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!this.oDialog) {
				// create dialog via fragment factory
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "demonewcassini.fragment.Accruals", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialog);
			}

			this.oDialog.open();
		},

		suggestionItemSelected: function(oEvent) {

			var oDataD = oView.getModel("AccrualDatModel").getData();
			if (oDataD.length > 0) {
				this.getView().getModel("AccrualDatModel").setData([]);
				//oView.getModel("FooterModel").setData([]);

			}
			oView.byId("footerAccount").setText("");
			oView.byId("footerAmount").setText("");
			oView.byId("footerAssign").setText("");
			oView.byId("footerCustomer").setText("");
			var oObjectPath = oEvent.getParameter('selectedItem').getBindingContext("AccModel").getObject();
			var oModel = oView.getModel("contS");
			//oModel.refresh();
			var aFilter = [];
			var sContractNo = oView.getModel("AgreementN").getProperty("/ContractNo");
			var sPostPeriod = oObjectPath.PostPeriod;
			aFilter.push(new Filter("Contractno", FilterOperator.Contains, sContractNo));
			aFilter.push(new Filter("Period", FilterOperator.Contains, sPostPeriod));
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();
			oModel.read("/GetInvoiceSet", {
				filters: aFilter,
				success: function(oData) {
					//oContractModel	 = new JSONModel(oData.results);
					oView.getModel("AccrualDatModel").setData(oData.results);
					console.log(oData);
					oGlobalBusyDialog.close();
				},
				error: function(oError) {
					console.log(oError);
				}
			});
			//this.byId("idProductsTable").setModel(oObjectPath,"DummyModel");
			sap.ui.getCore().setModel(new JSONModel(oObjectPath), "DummyModel");
			this.byId("idAccrualTab").setModel(oView.getModel("AccrualDatModel"), "AccrualDatModel");
			this.byId("DP2").setValue(sap.ui.getCore().getModel("DummyModel").getProperty("/DocumentDate"));
			this.byId("DP3").setValue(sap.ui.getCore().getModel("DummyModel").getProperty("/AccrualDate"));

		},

		onIPPress: function(oEvent) {
			var oModel = oView.getModel("contS");
			//oModel.refresh();
			var aFilter = [];
			var sContractNo = oView.getModel("AgreementN").getProperty("/ContractNo");
			aFilter.push(new Filter("Contractno", FilterOperator.Contains, sContractNo));
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();
			oModel.read("/GetInvoiceSet", {
				filters: aFilter,
				success: function(oData) {
					var oContractModel = new JSONModel(oData.results);
					oView.setModel(oContractModel, "ContractModel");
					console.log(oData);
					oGlobalBusyDialog.close();
				},
				error: function(oError) {
					console.log(oError);
				}
			});

			var oDialog = oView.byId("ipdialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "demonewcassini.fragment.IPdocument", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}

			oDialog.open();
		},
		onCancelRegDlg: function() {
			var oData = this.getView().getModel("ContractModel").getData();
			if (oData) {
				this.getView().getModel("ContractModel").setData([]);
			}
			this.byId("ipdialog").close();

		},
		onCancelACCHisDlg: function() {
			if (this.oDialogHist) {
				this.oDialogHist.destroy(true);
			}
			//this.byId("histroyDialog").close();

		},
		onCancelACCDlg: function() {
			if (this.oDialog) {
				this.oDialog.destroy(true);
			}
		},

		onPreviewHist: function() {

			var oModel = this.getView().getModel("contS");
			var aFilter = [];
			var sCont = oView.getModel("AgreementN").getProperty("/ContractNo");
			aFilter.push(new Filter("Contractno", sap.ui.model.FilterOperator.EQ, sCont));
			var that = this;
			oModel.read("/AccrualhistSet", {
				filters: aFilter,
				success: that._onUpdateHistSuccess.bind(that),
				error: function(oData) {
					console.log("error");
				}

			});

			this.oDialogHist = oView.byId("histroyDialog");
			// create dialog lazily
			if (!this.oDialogHist) {
				// create dialog via fragment factory
				this.oDialogHist = sap.ui.xmlfragment(oView.getId(), "demonewcassini.fragment.AccrualHistroy", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(this.oDialogHist);
			}

			this.oDialogHist.open();

		},
		_onUpdateHistSuccess: function(oObject) {

			var histSets = [];
			var hisModel = new JSONModel();
			this.getView().setModel(hisModel, "HistModel");
			var oObjData = oObject.results;
			// SAPUI5 formatters
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd-MMM-yyyy"
			});
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "KK:mm:ss"
			});
			// timezoneOffset is in hours convert to milliseconds
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;

			for (var i = 0; i < oObjData.length; i++) {
				var histMod = {};
				histMod.Contractno = oObjData[i].Contractno;
				histMod.Createdby = oObjData[i].Createdby;
				histMod.Amount = parseFloat(oObjData[i].Amount).toFixed(2);
				histMod.Doctype = oObjData[i].Doctype;
				histMod.Documentno = oObjData[i].Documentno;
				histMod.Period = oObjData[i].Period;
				var dateStr = dateFormat.format(new Date(oObjData[i].Creationdate.getTime() + TZOffsetMs));
				var timeStr = timeFormat.format(new Date(oObjData[i].Creationtime.ms + TZOffsetMs));
			/*	var tl = dateStr+ " " + timeStr;
				var bits = tl.split(/\D/);
				var date = new Date(bits[0], --bits[1], bits[2], bits[3], bits[4]);*/
				//histMod.Creationdate = "Date(" + date.getTime() + ")";
				histMod.Creationdate = dateStr;
				//histMod.Creationdate = "Date(1376290800000)";
				histMod.Creationtime = timeStr;
				histMod.Text = oObjData[i].Text;
				histSets.push(histMod);
			}

			this.getView().getModel("HistModel").setData(histSets);

		},
		/*** IP Document frag end***/

		onEditPress: function(oEvent) {
			oView.byId("idEdit").setVisible(false);
			oView.byId("idSave").setVisible(true);
			oView.getModel("EditModel").setProperty("/isEditable", true);

		},
		onSavePress: function() {
			this.getView().byId("idEdit").setVisible(true);
			this.getView().byId("idSave").setVisible(false);
			oView.getModel("EditModel").setProperty("/isEditable", false);
		},
		//edit agreement section
		
		addPerSale: function(){
			var oEditCont = this.getView().getModel("AddEditModel");
			var perSale = {};
			perSale.Prodno = oEditCont.getData().FlexibleGrpNo;
			perSale.Rate = oView.byId("psMeasure").getValue();
			perSale.EstimatedSales = oView.byId("psEstSales").getValue();
			perSale.Natureid = oEditCont.getData().NatureID;
			perSale.Naturedesc = oEditCont.getData().NatureDesc;
			perSale.Chardid = oEditCont.getData().TopazAccID;
			perSale.Chardesc = oEditCont.getData().TopazAccDesc;
			perSale.Settlement = oEditCont.getData().SettleMentID;
			perSale.Itemtype = "Z001";
			perSale.ItemDesc = "% Sales";
			var oData = oView.getModel("AgreementTab").getProperty("/");
			oData.push(perSale);
			oView.getModel("AgreementTab").setProperty("/",oData);
			oView.getModel("AgreementTab").refresh();
			
	
			oView.byId("psFlexGrp").setValue("");
			oView.byId("psnature").setValue("");
			oView.byId("pstopacc").setValue("");
			oView.byId("pssetmeth").setValue("");
			oView.byId("psMeasure").setValue("");
			oView.byId("psEstSales").setValue("");
			oEditCont.setData([]);
		
		},
		addFixedAmount: function(){
			var oEditCont = this.getView().getModel("AddEditModel");
			var perSale = {};
			perSale.Prodno = oEditCont.getData().FlexibleGrpNo;
			perSale.Rate = oView.byId("faRate").getValue();
			//perSale.EstimatedSales = oView.byId("faEstSales").getValue();
			perSale.Natureid = oEditCont.getData().NatureID;
			perSale.Naturedesc = oEditCont.getData().NatureDesc;
			perSale.Chardid = oEditCont.getData().TopazAccID;
			perSale.Chardesc = oEditCont.getData().TopazAccDesc;
			perSale.Settlement = oEditCont.getData().SettleMentID;
			perSale.Itemtype = "Z002";
			perSale.ItemDesc = "Fixed Amount";
			perSale.Uom = oView.byId("faUOM").getValue();
			perSale.EstimatedVol = oView.byId("faEstVol").getValue();
			var oData = oView.getModel("AgreementTab").getProperty("/");
			oData.push(perSale);
			oView.getModel("AgreementTab").setProperty("/",oData);
			oView.getModel("AgreementTab").refresh();
			
	
			oView.byId("faFlexGrp").setValue("");
			oView.byId("fanature").setValue("");
			oView.byId("fatopacc").setValue("");
			oView.byId("fasetmeth").setValue("");
			oView.byId("faRate").setValue("");
			//oView.byId("faEstSales").setValue("");
			oView.byId("faEstVol").setValue("");
			oView.byId("faUOM").setValue("");
			oEditCont.setData([]);
		},
	addLumpSum: function(){
		
			var oEditCont = this.getView().getModel("AddEditModel");
			var perSale = {};
			perSale.Prodno = oEditCont.getData().FlexibleGrpNo;
			perSale.Rate = oView.byId("lsRate").getValue();
			//perSale.EstimatedSales = oView.byId("lsEstSales").getValue();
			perSale.Natureid = oEditCont.getData().NatureID;
			perSale.Naturedesc = oEditCont.getData().NatureDesc;
			perSale.Chardid = oEditCont.getData().TopazAccID;
			perSale.Chardesc = oEditCont.getData().TopazAccDesc;
			perSale.Settlement = oEditCont.getData().SettleMentID;
			perSale.Itemtype = "Z003";
			perSale.ItemDesc = "Lumpsum";
			perSale.Uom = oView.byId("lsUOM").getValue();
			//perSale.EstimatedVol = oView.byId("lsEstVol").getValue();
			var oData = oView.getModel("AgreementTab").getProperty("/");
			oData.push(perSale);
			oView.getModel("AgreementTab").setProperty("/",oData);
			oView.getModel("AgreementTab").refresh();
			
	
			oView.byId("lsFlexGrp").setValue("");
			oView.byId("lsnature").setValue("");
			oView.byId("lstopacc").setValue("");
			oView.byId("lssetmeth").setValue("");
			oView.byId("lsRate").setValue("");
			//oView.byId("lsEstSales").setValue("");
			//oView.byId("lsEstVol").setValue("");
			oView.byId("lsUOM").setValue("");
			oEditCont.setData([]);
		
	},
		natureItemSelected: function(oEvent) {

			var perSale = this.getView().getModel("AddEditModel");
			var oSelectedItem = oEvent.getParameter('selectedItem');

			if (oSelectedItem) {
					perSale.getData().NatureID = oSelectedItem.getKey();
					perSale.getData().NatureDesc = oSelectedItem.getText();
			}

		},
		prodHItemSelected: function(oEvent) {
			var perSale = this.getView().getModel("AddEditModel");
			var oSelectedItem = oEvent.getParameter('selectedItem');

			if (oSelectedItem) {
				perSale.getData().FlexibleGrpNo = oSelectedItem.getText();
			}
		},
		topazItemSelected: function(oEvent) {
			var perSale = this.getView().getModel("AddEditModel");
			var oSelectedItem = oEvent.getParameter('selectedItem');

			if (oSelectedItem) {
    				perSale.getData().TopazAccID = oSelectedItem.getKey();
					perSale.getData().TopazAccDesc = oSelectedItem.getText();
			}
		},
		setItemSelected: function(oEvent) {
			var perSale = this.getView().getModel("AddEditModel");
			var oSelectedItem = oEvent.getParameter('selectedItem');
			if (oSelectedItem) {
					perSale.getData().SettleMentID = oSelectedItem.getKey();
					perSale.getData().SettleMentDesc = oSelectedItem.getText();
				
			}
		},
		
		
		/**********************************
		 * ********************************
		 * ******************************* pop up code
		 * *******************************
		 * *******************************/
		 
		 handleValueHelpFlex: function(oEvent) {
			//var oView = this.getView().getId();
			var sInputValue = oEvent.getSource().getValue();
			this.inputIdFlex = oEvent.getSource().getId();
			// create value help dialog
			if (!this._flexHelpDialog) {
				this._flexHelpDialog = sap.ui.xmlfragment(
					"demonewcassini.fragment.HelpPopUpDialog.FlexibleHelpDialog",
					this
				);
				this.getView().addDependent(this._flexHelpDialog);
			}

			// create a filter for the binding
			this._flexHelpDialog.getBinding("items").filter(
				[
					new Filter("Prodno", sap.ui.model.FilterOperator.Contains, sInputValue)

				]);

			// open value help dialog filtered by the input value
			this._flexHelpDialog.open(sInputValue);
		},
		_handleValueHelpCloseFlex: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var perSale = this.getView().getModel("AddEditModel");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdFlex),
					sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);
				perSale.getData().FlexibleGrpNo = sDescription;
			}
			evt.getSource().getBinding("items").filter([]);
		},
		
		handleValueHelpNat: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputIdNat = oEvent.getSource().getId();
			// create value help dialog
			if (!this._NatHelpDialog) {
				this._NatHelpDialog = sap.ui.xmlfragment(
					"demonewcassini.fragment.HelpPopUpDialog.NatureHelpDialog",
					this
				);
				this.getView().addDependent(this._NatHelpDialog);
			}

			// open value help dialog filtered by the input value
			this._NatHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearchNat: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterd = new Filter("Natureid", sap.ui.model.FilterOperator.EQ, sValue);
			var oFiltern = new Filter("Naturedesc", sap.ui.model.FilterOperator.EQ, sValue);
			evt.getSource().getBinding("items").filter([oFilterd, oFiltern]);
		},

		_handleValueHelpCloseNat: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var perSale = this.getView().getModel("AddEditModel");
			//var searchStr = this.inputIdNat;
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdNat);
				var sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);
				perSale.getData().NatureID = oSelectedItem.getTitle();
				perSale.getData().NatureDesc = sDescription;
			}
			evt.getSource().getBinding("items").filter([]);
		},
			handleValueHelpTop: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdTop = oEvent.getSource().getId();
			// create value help dialog
			if (!this._TopHelpDialog) {
				this._TopHelpDialog = sap.ui.xmlfragment(
					"demonewcassini.fragment.HelpPopUpDialog.TopazAccHelpDialog",
					this
				);
				this.getView().addDependent(this._TopHelpDialog);
			}

			// create a filter for the binding
			this._TopHelpDialog.getBinding("items").filter([
				new Filter("Chardid", sap.ui.model.FilterOperator.Contains, sInputValue),
				new Filter("Chardesc", sap.ui.model.FilterOperator.Contains, sInputValue)

			]);

			// open value help dialog filtered by the input value
			this._TopHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearchTop: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterd = new Filter("Chardid", sap.ui.model.FilterOperator.Contains, sValue);
			var oFiltern = new Filter("Chardesc", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilterd, oFiltern]);
		},

		_handleValueHelpCloseTop: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var perSale = this.getView().getModel("AddEditModel");
			//var searchStr = this.inputIdTop;
			if (oSelectedItem) {

				var productInput = this.byId(this.inputIdTop);
				var sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);
				perSale.getData().TopazAccID = oSelectedItem.getTitle();
				perSale.getData().TopazAccDesc = sDescription;
			
			}
			evt.getSource().getBinding("items").filter([]);
		},

		/***Topaz Acc Pop Up End***/

		/***SEL MEthod Pop Start***/

		handleValueHelpSM: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			
			this.inputIdSM = oEvent.getSource().getId();
			// create value help dialog
			if (!this._SMHelpDialog) {
				this._SMHelpDialog = sap.ui.xmlfragment(
					"demonewcassini.fragment.HelpPopUpDialog.SMHelpDialog",
					this
				);
				this.getView().addDependent(this._SMHelpDialog);
			}

			// create a filter for the binding
			this._SMHelpDialog.getBinding("items").filter([
				new Filter("SETMETHK", sap.ui.model.FilterOperator.Contains, sInputValue),
				new Filter("SETDESC", sap.ui.model.FilterOperator.Contains, sInputValue)

			]);

			// open value help dialog filtered by the input value
			this._SMHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearchSM: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterd = new Filter("SETMETHK", sap.ui.model.FilterOperator.Contains, sValue);
			var oFiltern = new Filter("SETDESC", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilterd, oFiltern]);
		},

		_handleValueHelpCloseSM: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var perSale = this.getView().getModel("AddEditModel");
			//var searchStr = this.inputIdSM;
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdSM);
				var sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);
					perSale.getData().SettleMentID = oSelectedItem.getTitle();
					perSale.getData().SettleMentDesc = sDescription;
				
			}

			evt.getSource().getBinding("items").filter([]);
		}

	});
});