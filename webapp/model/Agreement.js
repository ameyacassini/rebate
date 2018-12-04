sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel",
  "demonewcassini/model/AgreementPerSale",
  "demonewcassini/model/AgreementFixedAmount",
  "demonewcassini/model/AgreementLumpSum"
], function(Object, JSONModel, AgreementPerSale, AgreementFixedAmount, AgreementLumpSum) {
  "use strict";
  return Object.extend("demonewcassini.model.Agreement", {
    constructor: function(data) {
        this.CustomerID = (data) ? data.CustomerID : "";
		this.DocumentNumber = (data) ? data.DocumentNumber : "";
		this.AgreementNumber = (data) ? data.AgreementNumber : "";
		this.AgreementCopy = (data) ? data.AgreementCopy : "";
		this.CustomerName = (data) ? data.CustomerName : "";
		this.LineItems = (data && data.LineItems) ? this.getLineItems(data.LineItems) : this.getLineItems();
		this.PerSale = this.getPerSale(data);
		this.FixedAmount = this.getFixedAmount(data);
		this.LumpSum = this.getLumpSum(data);
		this.MergeList = (data) ? data.MergeList : [];
		this.Salesorg = (data) ? data.Salesorg : "";
		this.Country = (data) ? data.Country : "";
		this.Currency = (data) ? data.Currency : "";
		this.ValidFrom = (data) ? data.ValidFrom : "";
		this.ValidTo = (data) ? data.ValidTo : "";
		this.Dchannel = (data) ? data.Dchannel : "";
		this.Division = (data) ? data.Division : "";
		this.BtnID = (data) ? data.BtnID : "";
    	
    	this.model = new JSONModel();
    	this.model.setData(this);
    },
    addListItem: function(listItem) {
    	var generatedListItem = {
    		Custid: listItem.Custid,
    		Custname: listItem.Custname,
    		ValidTo: listItem.ValidTo,
    		ValidFrom: listItem.ValidFrom,
    		Salesorg: listItem.Salesorg,
    		Currency: listItem.Currency,
    		Country: listItem.Country,
    		FlexibleGrpNo: listItem.FlexibleGrpNo,
    		NatureID: listItem.NatureID,
    		NatureDesc : listItem.NatureDesc,
			TopazAccID: listItem.TopazAccID,
			TopazAccDesc: listItem.TopazAccDesc,
			SettleMentID: listItem.SettleMentID,
			SettleMentDesc: listItem.SettleMentDesc,
			Rate: listItem.Rate,
			UnitoFMesaure: listItem.UnitoFMesaure,
			EstimatedVol: listItem.EstimatedVol,
			EstimatedSales: listItem.EstimatedSales,
			ItemType : listItem.ItemType,
			ItemDesc : listItem.ItemDesc,
			BtnID : listItem.BtnID
    	};
    	this.MergeList.push(generatedListItem);
    },
    getLineItems: function(data) {
    	return {
    		Country: (data) ? data.Country : "",
			SalesOrg: (data) ? data.SalesOrg : "",
			Currency: (data) ? data.Currency : "",
			ValidFrom: (data) ? data.ValidFrom : "",
			ValidTo: (data) ? data.ValidTo : "",
			Status: (data) ? data.Status : "Released",
			PerSale: (data) ? data.PerSale : "true",
			FixedAmount: (data) ? data.FixedAmount : "true",
			LumpSum: (data) ? data.LumpSum : "true",
			image: (data) ? data.image : "",
			customerimg: (data) ? data.customerimg : "",
			percentComp: (data) ? data.percentComp : 70,
			displayValue: (data) ? data.displayValue : "70%",
			Language: (data) ? data.Language : "French",
			Email: (data) ? data.Email : "abc@lvmh.com"
    	};
    },
    getPerSale: function(data) {
    	var perSaleList = [];
    	if(data && data.PerSale) {
    		for(var i = 0; i < data.PerSale.length; i++) {
    			var perSale = new AgreementPerSale(data.PerSale[i]);
    			perSaleList.push(perSale);
    		}
    	}
    	return perSaleList;
    },
    getFixedAmount: function(data) {
    	var fixedAmountList = [];
    	if(data && data.FixedAmount) {
    		for(var i = 0; i < data.FixedAmount.length; i++) {
    			var fixedAmount = new AgreementFixedAmount(data.FixedAmount[i]);
    			fixedAmountList.push(fixedAmount);
    		}
    	}
    	return fixedAmountList;
    },
    getLumpSum: function(data) {
    	
    	var lumpSumList = [];
    	if(data && data.LumpSum) {
    		for(var i = 0; i < data.LumpSum.length; i++) {
    			var lumpSum = new AgreementLumpSum(data.LumpSum[i]);
    			lumpSumList.push(lumpSum);
    		}
    	}
    	return lumpSumList;
    },
    isBlank: function() {
      return this.CustomerName === "";
    },
    setObjectData: function(data) {
    	this.CustomerID = "";
		this.DocumentNumber = "DOC-1000";
		this.AgreementNumber = "";
		this.AgreementCopy = "image/samplecontract.pdf";
		this.CustomerName = "";
		this.LineItems = this.getLineItems();
		this.PerSale = [];
		this.FixedAmount = [];
		this.LumpSum = [];
		this.MergeList = [];
		this.BtnID = "";
    },
    getModel: function() {
      return this.model;
    }
  });
});