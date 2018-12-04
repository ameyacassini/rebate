sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"demonewcassini/controller/BaseController",
	"sap/m/PDFViewer",
	"sap/m/MessageToast",
	'sap/ui/model/Filter',
	"demonewcassini/model/Agreement",
	"demonewcassini/model/AgreementPerSale",
	"demonewcassini/model/AgreementFixedAmount",
	"demonewcassini/model/AgreementLumpSum",
	"demonewcassini/model/formatter",
	'sap/m/MessageBox'
], function(
	jQuery,
	Controller,
	JSONModel,
	BaseController,
	PDFViewer,
	MessageToast,
	Filter,
	Agreement,
	AgreementPerSale,
	AgreementFixedAmount,
	AgreementLumpSum,
	formatter,
	MessageBox
) {
	"use strict";
	var oView, oController, oComponent;

	return BaseController.extend("demonewcassini.controller.CreateAgreement", {
		formatter: formatter,
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var sPathC = jQuery.sap.getModulePath("demonewcassini.data", "/CustomerCollection.json");
			var oModelC = new JSONModel(sPathC);
			this.getView().setModel(oModelC, "CustomerModel");
			var sPathN = jQuery.sap.getModulePath("demonewcassini.data", "/NatureData.json");
			var oModelN = new JSONModel(sPathN);
			this.getView().setModel(oModelN, "NatureModel");

			var MaterialModel = new JSONModel({
				"ListItems": []

			});
			this.getView().setModel(MaterialModel, "OverTabModel");

			this.getRouter().getRoute("createagreement").attachPatternMatched(this._onObjectMatched, this);

		},
		OnAfterRendering: function() {

		},
		_onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'createagreement';
			globalKeys.refresh(true);

			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');

			var agreement = new Agreement();
			this.getView().setModel(agreement.getModel(), "Agreement");

			var perSale = new AgreementPerSale();
			this.getView().setModel(perSale.getModel(), 'PerSale');

			var fixedAmount = new AgreementFixedAmount();
			this.getView().setModel(fixedAmount.getModel(), 'FixedAmount');

			var lumpSum = new AgreementLumpSum();
			this.getView().setModel(lumpSum.getModel(), 'LumpSum');

			this.getView().byId("DP2").setDateValue(new Date(2018, 0, 1));
			this.getView().byId("DP3").setDateValue(new Date(2018, 11, 31));
			this.getView().byId("hdCountry").setValue("");
			this.getView().byId("customerInput").setValue("");
			this.getView().byId("hdCurrency").setValue("");
			this.getView().byId("hdSalesOrg").setValue("");
			this.getView().byId("hdDchannel").setValue("");
			this.getView().byId("hdDivision").setValue("");

		},
		addPerSale: function(oEvent) {
			var perSale = oView.getModel('PerSale');
			var agreement = oView.getModel('Agreement');

			var sBtnID = oEvent.getSource().getId();
			perSale.getData().FlexibleGrpNo = oView.byId("psFlexGrp").getValue();
			//perSale.getData().NatureID = oView.byId("psnature").getValue();
			//perSale.getData().TopazAccID = oView.byId("pstopacc").getValue();
			//perSale.getData().SettleMentID = oView.byId("pssetmeth").getValue();
			perSale.getData().Rate = oView.byId("psMeasure").getValue();
			perSale.getData().EstimatedSales = oView.byId("psEstSales").getValue();
			perSale.getData().Country = oView.byId("hdCountry").getValue();
			perSale.getData().Currency = oView.byId("hdCurrency").getValue();
			perSale.getData().Salesorg = oView.byId("hdSalesOrg").getValue();
			perSale.getData().ValidFrom = oView.byId("DP2").getValue();
			perSale.getData().ValidTo = oView.byId("DP3").getValue();
			perSale.getData().Custid = agreement.getData().CustomerID;
			perSale.getData().Custname = agreement.getData().CustomerName;
			perSale.getData().ItemType = "Z001";
			perSale.getData().ItemDesc = "% Sales";
			agreement.getData().BtnID = sBtnID;

			if (!perSale.getData().isBlank()) {
				agreement.getData().addListItem(perSale.getData());
				agreement.getData().PerSale.push(perSale.getData());
				agreement.refresh(true);
			}
			perSale.getData().setObjectData();
			perSale.refresh(true);

			oView.byId("psFlexGrp").setValue("");
			oView.byId("psnature").setValue("");
			oView.byId("pstopacc").setValue("");
			oView.byId("pssetmeth").setValue("");
			oView.byId("psMeasure").setValue("");
			oView.byId("psEstSales").setValue("");
		},

		addFixedAmount: function(oEvent) {
			var fixedAmount = oView.getModel('FixedAmount');
			var agreement = oView.getModel('Agreement');
			var sBtnID = oEvent.getSource().getId();
			fixedAmount.getData().FlexibleGrpNo = oView.byId("faFlexGrp").getValue();
			//perSale.getData().NatureID = oView.byId("psnature").getValue();
			//perSale.getData().TopazAccID = oView.byId("pstopacc").getValue();
			//fixedAmount.getData().SettleMentID = oView.byId("fasetmeth").getValue();
			fixedAmount.getData().Rate = oView.byId("faRate").getValue();
			fixedAmount.getData().EstimatedVol = oView.byId("faEstVol").getValue();
			fixedAmount.getData().Country = oView.byId("hdCountry").getValue();
			fixedAmount.getData().Currency = oView.byId("hdCurrency").getValue();
			fixedAmount.getData().Salesorg = oView.byId("hdSalesOrg").getValue();
			fixedAmount.getData().ValidFrom = oView.byId("DP2").getValue();
			fixedAmount.getData().ValidTo = oView.byId("DP3").getValue();
			fixedAmount.getData().UnitoFMesaure = oView.byId("DP3").getValue();
			fixedAmount.getData().Custid = agreement.getData().CustomerID;
			fixedAmount.getData().Custname = agreement.getData().CustomerName;
			fixedAmount.getData().UnitoFMesaure = oView.byId("faUOM").getValue();
			fixedAmount.getData().ItemType = "Z002";
			fixedAmount.getData().ItemDesc = "Fixed Amount";
			agreement.getData().BtnID = sBtnID;

			if (!fixedAmount.getData().isBlank()) {
				agreement.getData().addListItem(fixedAmount.getData());
				agreement.getData().FixedAmount.push(fixedAmount.getData());
				agreement.refresh(true);
			}

			fixedAmount.getData().setObjectData();
			fixedAmount.refresh(true);

			oView.byId("faFlexGrp").setValue("");
			oView.byId("fanature").setValue("");
			oView.byId("fatopacc").setValue("");
			oView.byId("fasetmeth").setValue("");
			oView.byId("faRate").setValue("");
			oView.byId("faEstVol").setValue("");
			oView.byId("faUOM").setValue("");
		},

		addLumpSum: function(oEvent) {
			var lumpSum = oView.getModel('LumpSum');
			var agreement = oView.getModel('Agreement');
			var sBtnID = oEvent.getSource().getId();
			lumpSum.getData().FlexibleGrpNo = oView.byId("lsFlexGrp").getValue();
			//perSale.getData().NatureID = oView.byId("psnature").getValue();
			//perSale.getData().TopazAccID = oView.byId("pstopacc").getValue();
			//lumpSum.getData().SettleMentID = oView.byId("lssetmeth").getValue();
			lumpSum.getData().Rate = oView.byId("lsRate").getValue();
			lumpSum.getData().UnitoFMesaure = oView.byId("lsUOM").getValue();
			lumpSum.getData().Country = oView.byId("hdCountry").getValue();
			lumpSum.getData().Currency = oView.byId("hdCurrency").getValue();
			lumpSum.getData().Salesorg = oView.byId("hdSalesOrg").getValue();
			lumpSum.getData().ValidFrom = oView.byId("DP2").getValue();
			lumpSum.getData().ValidTo = oView.byId("DP3").getValue();
			lumpSum.getData().Custid = agreement.getData().CustomerID;
			lumpSum.getData().Custname = agreement.getData().CustomerName;
			lumpSum.getData().ItemType = "Z003";
			lumpSum.getData().ItemDesc = "LumpSum";
			agreement.getData().BtnID = sBtnID;
			if (!lumpSum.getData().isBlank()) {
				agreement.getData().addListItem(lumpSum.getData());
				agreement.getData().LumpSum.push(lumpSum.getData());
				agreement.refresh(true);
			}

			lumpSum.getData().setObjectData();
			lumpSum.refresh(true);

			oView.byId("lsFlexGrp").setValue("");
			oView.byId("lsnature").setValue("");
			oView.byId("lstopacc").setValue("");
			oView.byId("lssetmeth").setValue("");
			oView.byId("lsRate").setValue("");
			oView.byId("lsUOM").setValue("");
		},

		checkDate: function() {
			var sValidFrom = oView.byId("DP2").getValue();
			var sValidTo = oView.byId("DP3").getValue();
			var dValidFrom = new Date(sValidFrom);
			var dValidTo = new Date(sValidTo);
			if (dValidFrom > dValidTo) {
				oView.byId("DP3").setValueState(sap.ui.core.ValueState.Error);
				return true;
			}else{
				oView.byId("DP3").setValueState(sap.ui.core.ValueState.None);
				return false;
			}
		},

		onSaveAgreement: function() {
			//Create all the records added to table via Json model
			var bDateCheck = this.checkDate();
			if(!bDateCheck){
			var oTable = this.getView().byId("idOverviewTab");
			var aItems = oTable.getItems();
			var agreement = oView.getModel('Agreement');
			var vFrom = oView.byId("DP2").getValue() + "T00:00:00";
			var vTo = oView.byId("DP3").getValue() + "T00:00:00";
			agreement.getData().ValidFrom = vFrom;
			agreement.getData().ValidTo = vTo;
			var itemData = [];
			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {

				var l_Prodno = agreement.getProperty("/MergeList/" + iRowIndex + "/FlexibleGrpNo");
				var l_Naturedesc = agreement.getProperty("/MergeList/" + iRowIndex + "/NatureDesc");
				var l_NatureID = agreement.getProperty("/MergeList/" + iRowIndex + "/NatureID");
				var l_Chardesc = agreement.getProperty("/MergeList/" + iRowIndex + "/TopazAccDesc");
				var l_ChardID = agreement.getProperty("/MergeList/" + iRowIndex + "/TopazAccID");
				var l_Settlement = agreement.getProperty("/MergeList/" + iRowIndex + "/SettleMentID");
				var l_Rate = agreement.getProperty("/MergeList/" + iRowIndex + "/Rate");
				var l_EstimatedSales = agreement.getProperty("/MergeList/" + iRowIndex + "/EstimatedSales");
				var l_EstimatedVol = agreement.getProperty("/MergeList/" + iRowIndex + "/EstimatedVol");
				var l_UOM = agreement.getProperty("/MergeList/" + iRowIndex + "/UnitoFMesaure");
				var l_ItemType = agreement.getProperty("/MergeList/" + iRowIndex + "/ItemType");
				var l_Createdby = "MOB17";

				itemData.push({
					Prodno: l_Prodno,
					Natureid: l_NatureID,
					Naturedesc: l_Naturedesc,
					Settlement: l_Settlement,
					Chardesc: l_Chardesc,
					Chardid: l_ChardID,
					Rate: l_Rate,
					EstimatedSales: l_EstimatedSales,
					Createdby: l_Createdby,
					Itemtype: l_ItemType,
					EstimatedVol: l_EstimatedVol,
					Uom: l_UOM

				});
			}
			var oEntry1 = {};
			oEntry1.Custid = agreement.getData().CustomerID;
			oEntry1.Custname = agreement.getData().CustomerName;
			oEntry1.Salesorg = agreement.getData().Salesorg;
			oEntry1.Country = agreement.getData().Country;
			oEntry1.Currency = agreement.getData().Currency;
			oEntry1.ValidFrom = agreement.getData().ValidFrom;
			oEntry1.ValidTo = agreement.getData().ValidTo;
			oEntry1.Division = agreement.getData().Division;
			oEntry1.Dchannel = agreement.getData().Dchannel;
			oEntry1.Createdby = "MOB17";
			oEntry1.CONT_HEADERTOCONT_ITEM = itemData;
			var oModelCreate = this.getView().getModel("contS");
			var oContext = oModelCreate.create("/CONT_HEADERSet", oEntry1, {
				success: this._onCreateEntrySuccess.bind(this),
				error: this._onCreateEntryError.bind(this)
			});
			}else{
				MessageToast.show("Invalid Date");
			}
		},
		_onCreateEntrySuccess: function(oObject, oResponse) {
			MessageToast.show("Successfully created new entry!" + oResponse.data.Contractno);
			oView.byId("customerInput").setValue("");
			oView.byId("DP2").setValue("");
			oView.byId("DP3").setValue("");
			oView.byId("hdCountry").setValue("");
			oView.byId("hdCurrency").setValue("");
			oView.byId("hdSalesOrg").setValue("");
			oView.byId("hdDchannel").setValue("");
			oView.byId("hdDivision").setValue("");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("");
		},
		_onCreateEntryError: function(oError) {

			MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);
		},
		onCancelAgreement: function() {
			MessageToast.show("Cancel Agreement");
			oView.byId("psFlexGrp").setValue("");
			oView.byId("psnature").setValue("");
			oView.byId("pstopacc").setValue("");
			oView.byId("pssetmeth").setValue("");
			oView.byId("psMeasure").setValue("");
			oView.byId("psEstSales").setValue("");
			oView.byId("customerInput").setValue("");
			oView.byId("DP2").setValue("");
			oView.byId("DP3").setValue("");
			oView.byId("hdCountry").setValue("");
			oView.byId("customerInput").setValue("");
			oView.byId("hdCurrency").setValue("");
			oView.byId("hdSalesOrg").setValue("");
			oView.byId("hdDchannel").setValue("");
			oView.byId("hdDivision").setValue("");
			oView.byId("faFlexGrp").setValue("");
			oView.byId("fanature").setValue("");
			oView.byId("fatopacc").setValue("");
			oView.byId("fasetmeth").setValue("");
			oView.byId("faRate").setValue("");
			oView.byId("faEstSales").setValue("");
			oView.byId("lsFlexGrp").setValue("");
			oView.byId("lsnature").setValue("");
			oView.byId("lstopacc").setValue("");
			oView.byId("lssetmeth").setValue("");
			oView.byId("lsRate").setValue("");
			oView.byId("lsUOM").setValue("");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("appHome");
		},
		/*	onBackPress: function(){
				oView.byId("hdCurrency").setValue("");
				oView.byId("hdSalesOrg").setValue("");
				oView.byId("hdDchannel").setValue("");
				oView.byId("hdDivision").setValue("");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("appHome");
			},*/

		/***Flex Group Pop Up *****/

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

		_handleValueHelpSearchFlex: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterID = new Filter("Prodno", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilterID]);
		},

		_handleValueHelpCloseFlex: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdFlex),
					sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);
			}
			evt.getSource().getBinding("items").filter([]);
		},

		/***Flex Group Pop Up End***/

		/***Nature Pop Up Start***/

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
			var perSale = this.getView().getModel("PerSale");
			var fixedAmount = this.getView().getModel("FixedAmount");
			var lumpSum = this.getView().getModel("LumpSum");
			var searchStr = this.inputIdNat;
			if (oSelectedItem) {

				var productInput = this.byId(this.inputIdNat);
				var sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);

				if (searchStr.includes("psnature")) {
					perSale.getData().NatureID = oSelectedItem.getTitle();
					perSale.getData().NatureDesc = oSelectedItem.getDescription();
				} else if (searchStr.includes("fanature")) {
					fixedAmount.getData().NatureID = oSelectedItem.getTitle();
					fixedAmount.getData().NatureDesc = oSelectedItem.getDescription();
				} else if (searchStr.includes("lsnature")) {
					lumpSum.getData().NatureID = oSelectedItem.getTitle();
					lumpSum.getData().NatureDesc = oSelectedItem.getDescription();
				}
			}
			evt.getSource().getBinding("items").filter([]);
		},

		/***Nature Pop Up End***/

		/***Topaz Acc Pop Up Start***/

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
			var perSale = this.getView().getModel("PerSale");
			var fixedAmount = this.getView().getModel("FixedAmount");
			var lumpSum = this.getView().getModel("LumpSum");
			var searchStr = this.inputIdTop;
			if (oSelectedItem) {

				var productInput = this.byId(this.inputIdTop);
				var sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);
				if (searchStr.includes("pstopacc")) {
					perSale.getData().TopazAccID = oSelectedItem.getTitle();
					perSale.getData().TopazAccDesc = oSelectedItem.getDescription();
				} else if (searchStr.includes("fatopacc")) {
					fixedAmount.getData().TopazAccID = oSelectedItem.getTitle();
					fixedAmount.getData().TopazAccDesc = oSelectedItem.getDescription();
				} else if (searchStr.includes("lstopacc")) {
					lumpSum.getData().TopazAccID = oSelectedItem.getTitle();
					lumpSum.getData().TopazAccDesc = oSelectedItem.getDescription();
				}
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
			var perSale = this.getView().getModel("PerSale");
			var fixedAmount = this.getView().getModel("FixedAmount");
			var lumpSum = this.getView().getModel("LumpSum");
			var searchStr = this.inputIdSM;
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdSM);
				var sDescription = oSelectedItem.getDescription();
				productInput.setValue(sDescription);
				if (searchStr.includes("pssetmeth")) {
					perSale.getData().SettleMentID = oSelectedItem.getTitle();
					perSale.getData().SettleMentDesc = oSelectedItem.getDescription();
				} else if (searchStr.includes("fasetmeth")) {
					fixedAmount.getData().SettleMentID = oSelectedItem.getTitle();
					fixedAmount.getData().SettleMentDesc = oSelectedItem.getDescription();
				} else if (searchStr.includes("lssetmeth")) {
					lumpSum.getData().SettleMentID = oSelectedItem.getTitle();
					lumpSum.getData().SettleMentDesc = oSelectedItem.getDescription();
				}
			}

			evt.getSource().getBinding("items").filter([]);
		},

		/***Set Method Pop Up End***/

		handleValueHelpCust: function(oEvent) {
			//var oView = this.getView().getId();
			var sInputValue = oEvent.getSource().getValue();
			/*	var sInputId = oEvent.getSource().getId();
				var sFragName;
				if (sInputId === this.createId("customerInput")) {
					sFragName = "demonewcassini.fragment.CustomerHelpDialog";
				} else if (sInputId === this.createId("psFlexGrp")) {
					sFragName = "demonewcassini.fragment.FlexibleHelpDialog";
				}*/
			this.inputIdCust = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"demonewcassini.fragment.HelpPopUpDialog.CustomerHelpDialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter(
				[
					new Filter("Custid", sap.ui.model.FilterOperator.Contains, sInputValue)

				]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearchCust: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterID = new Filter("Custid", sap.ui.model.FilterOperator.EQ, sValue);
			var oFilterName = new Filter("Custname", sap.ui.model.FilterOperator.EQ, sValue);
			evt.getSource().getBinding("items").filter([oFilterID, oFilterName]);
		},

		_handleValueHelpCloseCust: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var oAgreement = this.getView().getModel("Agreement");
			var oModel = oView.getModel("contS");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdCust);
				var sBindPath = oSelectedItem.getBindingContext("contS").sPath;
				productInput.setValue(oSelectedItem.getTitle());

				oView.byId("hdCountry").setValue(oModel.getProperty(sBindPath + "/Country"));
				oView.byId("hdSalesOrg").setValue(oModel.getProperty(sBindPath + "/Salesorg"));
				oView.byId("hdCurrency").setValue(oModel.getProperty(sBindPath + "/Currency"));
				oView.byId("hdDivision").setValue(oModel.getProperty(sBindPath + "/Division"));
				oView.byId("hdDchannel").setValue(oModel.getProperty(sBindPath + "/Dchannel"));
				oAgreement.getData().CustomerID = oSelectedItem.getDescription();
				oAgreement.getData().CustomerName = oSelectedItem.getTitle();
				oAgreement.getData().Salesorg = oModel.getProperty(sBindPath + "/Salesorg");
				oAgreement.getData().Country = oModel.getProperty(sBindPath + "/Country");
				oAgreement.getData().Currency = oModel.getProperty(sBindPath + "/Currency");
				oAgreement.getData().Division = oModel.getProperty(sBindPath + "/Division");
				oAgreement.getData().Dchannel = oModel.getProperty(sBindPath + "/Dchannel");
			}
			evt.getSource().getBinding("items").filter([]);

		},

		handleUploadComplete: function(oEvent) {
			MessageToast.show("upload success");
		},
		handleUploadPress: function(oEvent) {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.upload();
		},
		customerItemSelected: function(oEvent) {
			var oSelectedItem = oEvent.getParameter('selectedItem');
			var oModel = oView.getModel("contS");
			var oAgreement = this.getView().getModel("Agreement");
			if (oSelectedItem) {
				var sBindPath = oSelectedItem.getBindingContext("contS").sPath;
				oView.byId("hdCountry").setValue(oModel.getProperty(sBindPath + "/Country"));
				oView.byId("hdSalesOrg").setValue(oModel.getProperty(sBindPath + "/Salesorg"));
				oView.byId("hdCurrency").setValue(oModel.getProperty(sBindPath + "/Currency"));
				oView.byId("hdDivision").setValue(oModel.getProperty(sBindPath + "/Division"));
				oView.byId("hdDchannel").setValue(oModel.getProperty(sBindPath + "/Dchannel"));
				

				oAgreement.getData().CustomerID = oSelectedItem.getKey();
				oAgreement.getData().CustomerName = oSelectedItem.getText();
				oAgreement.getData().Salesorg = oModel.getProperty(sBindPath + "/Salesorg");
				oAgreement.getData().Country = oModel.getProperty(sBindPath + "/Country");
				oAgreement.getData().Currency = oModel.getProperty(sBindPath + "/Currency");
				oAgreement.getData().Division = oModel.getProperty(sBindPath + "/Division");
				oAgreement.getData().Dchannel = oModel.getProperty(sBindPath + "/Dchannel");
			}

		},
		natureItemSelected: function(oEvent) {

			var perSale = this.getView().getModel("PerSale");
			var fixedAmount = this.getView().getModel("FixedAmount");
			var lumpSum = this.getView().getModel("LumpSum");
			var oSelectedItem = oEvent.getParameter('selectedItem');

			if (oSelectedItem) {
				var searchStr = oSelectedItem.getId();
				if (searchStr.includes("psnature")) {
					perSale.getData().NatureID = oSelectedItem.getKey();
					perSale.getData().NatureDesc = oSelectedItem.getText();
				} else if (searchStr.includes("fanature")) {
					fixedAmount.getData().NatureID = oSelectedItem.getKey();
					fixedAmount.getData().NatureDesc = oSelectedItem.getText();
				} else if (searchStr.includes("lsnature")) {
					lumpSum.getData().NatureID = oSelectedItem.getKey();
					lumpSum.getData().NatureDesc = oSelectedItem.getText();
				}
			}

		},
		prodHItemSelected: function(oEvent) {
			var perSale = this.getView().getModel("PerSale");
			var fixedAmount = this.getView().getModel("FixedAmount");
			var lumpSum = this.getView().getModel("LumpSum");
			var oSelectedItem = oEvent.getParameter('selectedItem');

			if (oSelectedItem) {
				var searchStr = oSelectedItem.getId();
				if (searchStr.includes("psFlexGrp")) {
					perSale.getData().FlexibleGrpNo = oSelectedItem.getText();
				} else if (searchStr.includes("faFlexGrp")) {
					fixedAmount.getData().FlexibleGrpNo = oSelectedItem.getText();
				} else if (searchStr.includes("lsFlexGrp")) {
					lumpSum.getData().FlexibleGrpNo = oSelectedItem.getText();
				}
			}
		},
		topazItemSelected: function(oEvent) {
			var perSale = this.getView().getModel("PerSale");
			var fixedAmount = this.getView().getModel("FixedAmount");
			var lumpSum = this.getView().getModel("LumpSum");
			var oSelectedItem = oEvent.getParameter('selectedItem');

			if (oSelectedItem) {
				var searchStr = oSelectedItem.getId();
				if (searchStr.includes("pstopacc")) {
					perSale.getData().TopazAccID = oSelectedItem.getKey();
					perSale.getData().TopazAccDesc = oSelectedItem.getText();
				} else if (searchStr.includes("fatopacc")) {
					fixedAmount.getData().TopazAccID = oSelectedItem.getKey();
					fixedAmount.getData().TopazAccDesc = oSelectedItem.getText();
				} else if (searchStr.includes("lstopacc")) {
					lumpSum.getData().TopazAccID = oSelectedItem.getKey();
					lumpSum.getData().TopazAccDesc = oSelectedItem.getText();
				}
			}
		},
		setItemSelected: function(oEvent) {
			var perSale = this.getView().getModel("PerSale");
			var fixedAmount = this.getView().getModel("FixedAmount");
			var lumpSum = this.getView().getModel("LumpSum");
			var oSelectedItem = oEvent.getParameter('selectedItem');

			if (oSelectedItem) {
				var searchStr = oSelectedItem.getId();
				if (searchStr.includes("pssetmeth")) {
					perSale.getData().SettleMentID = oSelectedItem.getKey();
					perSale.getData().SettleMentDesc = oSelectedItem.getText();
				} else if (searchStr.includes("fasetmeth")) {
					fixedAmount.getData().SettleMentID = oSelectedItem.getKey();
					fixedAmount.getData().SettleMentDesc = oSelectedItem.getText();
				} else if (searchStr.includes("lssetmeth")) {
					lumpSum.getData().SettleMentID = oSelectedItem.getKey();
					lumpSum.getData().SettleMentDesc = oSelectedItem.getText();
				}
			}
		}

	});
});