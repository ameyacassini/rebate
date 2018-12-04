sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
  "use strict";
  return Object.extend("demonewcassini.model.AgreementPerSale", {
    constructor: function(data) {
    	this.FlexibleGrpNo = (data) ? data.FlexibleGrpNo : "";
		this.NatureID = (data) ? data.NatureID : "";
		this.NatureDesc = (data) ? data.NatureDesc : "";
		this.TopazAccID = (data) ? data.TopazAccID : "";
		this.TopazAccDesc = (data) ? data.TopazAccDesc : "";
		this.SettleMentID = (data) ? data.SettleMentID : "";
		this.SettleMentDesc = (data) ? data.SettleMentDesc : "";
		this.Rate = (data) ? data.Rate : "";
		this.UnitoFMesaure = (data) ? data.UnitoFMesaure : "";
		this.EstimatedSales = (data) ? data.EstimatedSales : "";
		this.Custname = (data) ? data.Custname : "";
		this.Custid = (data) ? data.Custid : "";
		this.Salesorg = (data) ? data.Salesorg : "";
		this.Country = (data) ? data.Country : "";
		this.Currency = (data) ? data.Currency : "";
		this.ValidFrom = (data) ? data.ValidFrom : "";
		this.ValidTo = (data) ? data.ValidTo : "";
		this.ItemType = (data) ? data.ItemType : "";
		this.ItemDesc = (data) ? data.ItemDesc : "";
		this.BtnID = (data) ? data.BtnID : "";
			
    	this.model = new JSONModel();
    	this.model.setData(this);
    },
    isBlank: function() {
      return	this.FlexibleGrpNo === "" &&
				this.Nature === "" &&
				this.TopazAcc === "" &&
				this.SettleMent === "" &&
				this.Rate === "" &&
				this.UnitoFMesaure === "" &&
				this.EstimatedVol === "";
    },
    setObjectData: function(data) {
    	this.FlexibleGrpNo = (data) ? data.FlexibleGrpNo : "";
		this.NatureID = (data) ? data.NatureID : "";
		this.NatureDesc = (data) ? data.NatureDesc : "";
		this.TopazAccID = (data) ? data.TopazAccID : "";
		this.TopazAccDesc = (data) ? data.TopazAccDesc : "";
		this.SettleMentID = (data) ? data.SettleMentID : "";
		this.SettleMentDesc = (data) ? data.SettleMentDesc : "";
		this.Rate = (data) ? data.Rate : "";
		this.UnitoFMesaure = (data) ? data.UnitoFMesaure : "";
		this.EstimatedSales = (data) ? data.EstimatedSales : "";
		this.Custname = (data) ? data.Custname : "";
		this.Custid = (data) ? data.Custid : "";
		this.Salesorg = (data) ? data.Salesorg : "";
		this.Country = (data) ? data.Country : "";
		this.Currency = (data) ? data.Currency : "";
		this.ValidFrom = (data) ? data.ValidFrom : "";
		this.ValidTo = (data) ? data.ValidTo : "";
		this.ItemType = (data) ? data.ItemType : "";
		this.ItemDesc = (data) ? data.ItemDesc : "";
		this.BtnID = (data) ? data.BtnID : "";

    },
    getModel: function() {
      return this.model;
    }
  });
});