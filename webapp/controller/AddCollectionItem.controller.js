sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/TextArea",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device"

], function(Controller, History, JSONModel, Dialog, Button, TextArea, Filter, FilterOperator, Device) {
	"use strict";
	var oView, oController, oComponent;
	return Controller.extend("demonewcassini.controller.AddCollectionItem", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf demonewcassini.view.AddCollectionItem
		 */
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("AddCollectionItem").attachPatternMatched(this._onObjectMatched, this);

			var oModel = this.getOwnerComponent().getModel("CollectionGroupInformation");
			this.getView().setModel(oModel);

			var AddIteamModel = this.getOwnerComponent().getModel("AddIteamModel");
			this.getView().setModel(AddIteamModel, "AddIteamModel");

			var Naming = this.getOwnerComponent().getModel("Naming");
			this.getView().setModel(Naming, "Naming");

			var collectionItemMode = new sap.ui.model.json.JSONModel();
			this.getView().setModel(collectionItemMode, "collectionItemMode");

			var oDateModel = new sap.ui.model.json.JSONModel({
				currentDate: new Date().toLocaleDateString(),
				currentTime: new Date().toLocaleTimeString()
			});
			this.getView().setModel(oDateModel, "DateModel");

		},

		initializeView: function() {
			var collectionItemMode = this.getView().getModel("collectionItemMode");
			collectionItemMode.setProperty("/Category", false);
			collectionItemMode.setProperty("/Type", false);
			collectionItemMode.setProperty("/Brand", false);
			collectionItemMode.setProperty("/Model", false);
			collectionItemMode.setProperty("/MaterialNumber", false);
			collectionItemMode.setProperty("/MaxHierarchy", 0);

			if (this.itemId === undefined) {
				collectionItemMode.setProperty("/ListSelection", "MultiSelect");
			} else {
				collectionItemMode.setProperty("/ListSelection", "SingleSelectLeft");
			}

			var items = this.getView().byId("Allocationlist").getItems();
			for (var index in items) {
				if (items[index]._oMultiSelectControl === undefined)
					break;
				items[index]._oMultiSelectControl.setEnabled(true);
			}

			var MaterialModel = new sap.ui.model.json.JSONModel({
				"ListItems": []
			});
			this.getView().setModel(MaterialModel, "MaterialModel");
		},

		_onObjectMatched: function(oEvent) {
			var globalKeys = oComponent.getModel('GlobalKeys');
			globalKeys.getData().page = 'collectiongroup';
			globalKeys.refresh(true);

			$('#nav-icon1').addClass('back');
			$('#nav-icon1').removeClass('open');

			this.groupId = oEvent.getParameter("arguments").groupId;
			this.itemId = oEvent.getParameter("arguments").itemId;
			this.getView().byId("CollectionGroupDetails").bindElement("/CollectionGroupInformation/" + this.groupId);
			this.initializeView();

		},

		OnNavigateHome: function(oEvent) {

			this.getOwnerComponent().getRouter().navTo("CollectionGroupList", {}, true);
		},

		handleSuggestNum: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("Mandt", sap.ui.model.FilterOperator.EQ, "800"));
				aFilters.push(new Filter("Matnr", sap.ui.model.FilterOperator.EQ, sTerm));
				aFilters.push(new Filter("Maktx", sap.ui.model.FilterOperator.EQ, ""));
				aFilters.push(new Filter("Spras", sap.ui.model.FilterOperator.EQ, "EN"));
				aFilters.push(new Filter("Bname", sap.ui.model.FilterOperator.EQ, "MOB17"));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},
		handleSuggestDesc: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("Mandt", sap.ui.model.FilterOperator.EQ, "800"));
				aFilters.push(new Filter("Matnr", sap.ui.model.FilterOperator.EQ, ""));
				aFilters.push(new Filter("Maktx", sap.ui.model.FilterOperator.EQ, sTerm));
				aFilters.push(new Filter("Spras", sap.ui.model.FilterOperator.EQ, "EN"));
				aFilters.push(new Filter("Bname", sap.ui.model.FilterOperator.EQ, "MOB17"));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},

		suggestionItemSelected: function(evt) {

			var oItem = evt.getParameter('selectedItem');
			var oMaterialModel = this.getView().getModel("MaterialModel");
			var newItem = {
				"MaterialNumber": oItem.getText(),
				"MaterialDescription": oItem.getAdditionalText()
			};

			oMaterialModel.getData().ListItems.push(newItem);
			oMaterialModel.refresh(true);

		},

		onAllocationChange: function(oEvent) {

			var collectionItemMode = this.getView().getModel("collectionItemMode");
			var oSelectedItem = oEvent.getParameter("listItem");
			var tabName = oSelectedItem.getTitle();
			var oAllocationlist = oEvent.getSource();
			var items = oAllocationlist.getItems();
			var checkBoxSelected = oEvent.getParameter('selected');
			// var selectedItemlist = oAllocationlist.getSelectedItems();

			if (tabName === 'Category') {
				collectionItemMode.setProperty("/Category", checkBoxSelected);

			} else if (tabName === 'Type') {
				collectionItemMode.setProperty("/Type", checkBoxSelected);
				if (checkBoxSelected)
					oAllocationlist.setSelectedItem(items[1], true, true);
				else
					oAllocationlist.setSelectedItem(items[1], false, true);
			} else if (tabName === 'Brand') {
				collectionItemMode.setProperty("/Brand", checkBoxSelected);
				if (checkBoxSelected)
					oAllocationlist.setSelectedItem(items[2], true, true);
				else
					oAllocationlist.setSelectedItem(items[2], false, true);
			} else if (tabName === 'Model') {
				collectionItemMode.setProperty("/Model", checkBoxSelected);
				if (checkBoxSelected)
					oAllocationlist.setSelectedItem(items[3], true, true);
				else
					oAllocationlist.setSelectedItem(items[3], false, true);
			} else if (tabName === 'Material Number') {
				collectionItemMode.setProperty("/MaterialNumber", checkBoxSelected);

			}
		},

		filterGlobally: function(oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			var selectedTab = oEvent.getSource().getParent().getParent().getKey();

			if (sQuery) {
				aFilters = new Filter([
					new Filter("ddkey", FilterOperator.Contains, sQuery),
					new Filter("ddtext", FilterOperator.Contains, sQuery)
				], false);

			}

			if (selectedTab === "Naming") {
				var list = this.getView().byId("Naminglist");
			} else if (selectedTab === 'Brands') {
				var list = this.getView().byId("Brandslist");
			} else if (selectedTab === 'QualityGroup') {
				var list = this.getView().byId("QualityGrouplist");
			} else if (selectedTab === 'Quality') {
				var list = this.getView().byId("Qualitylist");
			} else if (selectedTab === 'BottleSize') {
				var list = this.getView().byId("BottleSizelist");
			}

			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");

		},

		_onGetHierarchyItems: function(level, allfilters) {
			try {
				//collectionItemMode.setProperty("/Hierarchy1", checkBoxSelected);
				var oModel2 = this.getOwnerComponent().getModel("prodH");
				var param2 = "EN";
				var param3 = "";
				var param4 = level.toString();

				if (allfilters.length === 0)

					allfilters.push(
					new sap.ui.model.Filter({
						path: 'Spras',
						operator: sap.ui.model.FilterOperator.EQ,
						value1: param2
					}));

				allfilters.push(
					new sap.ui.model.Filter({
						path: 'Stufe',
						operator: sap.ui.model.FilterOperator.EQ,
						value1: param4
					}));

				oModel2.read("/PROD_HIERARCHYSet", {
					filters: allfilters,
					success: function(oData) {
						var oHierarchyModel = new sap.ui.model.json.JSONModel(oData);

						//oODataJSONModelDLSet.setData(oData);
						//var oList = sap.ui.getCore().byId("__xmlview3--ToolListItem");
						oView.setModel(oHierarchyModel, "hierarchy" + level);
						console.log(oData);
					},
					error: function(oError) {
						console.log(oError);
					}
				});
			} catch (ex) {
				console.log(ex);
			}
		},

		onSelectHierarchyItem: function(oEvent) {
			try {
				var listItem = oEvent.getParameter('listItem');
				var level = parseInt(listItem.data('level'), 10);
				var oListHie = oView.byId("Hie" + level + "list");
				if (listItem.getProperty("selected")) {
					var collectionItemMode = this.getView().getModel("collectionItemMode");
					collectionItemMode.setProperty("/MaxHierarchy", level);
					var maxH = collectionItemMode.getProperty("/MaxHierarchy");
					console.log(maxH);
				}
				var selItems = oListHie.getSelectedItems();
				if(selItems.length === 0 && level !== 4){
					var xNo = level + 1;
					var nextLevelModel = "hierarchy" + xNo;
					this.getView().getModel(nextLevelModel).setData({});
					this.getView().getModel(nextLevelModel).refresh();
				}
				var allfilters = [];
				var paramT3;
				for (var i = 0; i < selItems.length; i++) {
				    paramT3	= selItems[i].data('id');
					
					allfilters.push(new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.EQ, paramT3));
					
				}
				if(paramT3){
				oController._onGetHierarchyItems(level + 1, allfilters);
				}
			} catch (ex) {
				console.log(ex);
			}
		},


		onSave: function(oEvent) {
			try {
				var productHierarchySets = [];
				var collectionItemMode = this.getView().getModel("collectionItemMode");
				var maxHierarchy = collectionItemMode.getProperty("/MaxHierarchy");
				var oModel = this.getView().getModel("hierarchy" + maxHierarchy);
				if (maxHierarchy !== 0) {
					var oListHie = oView.byId("Hie" + maxHierarchy + "list");
					var selItems = oListHie.getSelectedItems();
					for (var i = 0; i < selItems.length; i++) {
						var item = selItems[i];
						var objData = oModel.getProperty(item.getBindingContextPath());
						productHierarchySets.push(objData);
					}
				}
				
				var oProductHierarchySetsModel =  oComponent.getModel('productHierarchySets').getProperty("/");
				for(var len = 0; len<productHierarchySets.length; len++){
				oProductHierarchySetsModel.push(productHierarchySets[len]);
				}
				oComponent.getModel('productHierarchySets').setProperty("/", oProductHierarchySetsModel);
				//oProductHierarchySetsModel.refresh(true);
				
				
				this.getView().byId("Hie1list").removeSelections(true);
				this.getView().byId("Hie2list").removeSelections(true);
				this.getView().byId("Hie3list").removeSelections(true);
				this.getView().byId("Hie4list").removeSelections(true);
				this.getView().byId("Allocationlist").removeSelections(true);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("CollectionGroupDetails");
				
			} catch (ex) {
				console.log(ex);
			}
		},
		onQualityChange: function(oEvent) {
			var collectionItemMode = this.getView().getModel("collectionItemMode");
			collectionItemMode.setProperty("/QualitySelectionUpdate", true);
			collectionItemMode.setProperty("/QualitySelectionCount", oEvent.getSource().getSelectedContexts(true).length);
		},
		onBottleSizeChange: function(oEvent) {
			var collectionItemMode = this.getView().getModel("collectionItemMode");
			collectionItemMode.setProperty("/BottleSizeSelectionUpdate", true);
			collectionItemMode.setProperty("/BottleSizeSelectionCount", oEvent.getSource().getSelectedContexts(true).length);
		},

		/*	onTabSelect: function(oEvent) {

				var oModel;
				var result;
				var oParentList = [];
				var selectedParents = [];
				var array = [];

				var collectionItemMode = this.getView().getModel("collectionItemMode");
				var selectedTab = oEvent.getParameters().key;

				if (selectedTab === "Naming") {

				} else if (selectedTab === 'Brands') {
					var namingModel = this.getView().getModel("Naming");
					if (collectionItemMode.getProperty("/NamingSelectionUpdate")) {
						collectionItemMode.setProperty("/NamingSelectionUpdate", false);
						this.selectedNamingParents = {};
						oParentList = this.getView().byId("Naminglist");
						selectedParents = oParentList.getSelectedContexts(true);
						if (selectedParents.length === 0) {
							oModel = this.getView().getModel("Brands");
							oModel.setData({});
							oModel.updateBindings(true);
						} else {

							for (var sItem in selectedParents) {
								var item = selectedParents[sItem];
								var key = namingModel.getProperty(item.sPath).ddkey;
								array.push(key);
								this.selectedNamingParents[key] = item.sPath;
							}

							// parent = this.getView().getModel().getProperty(this.selectedContext).namingkey;
							oModel = this.getOwnerComponent().getModel("Brands");

							result = jQuery.grep(oModel.getData().ListItems, function(e) {
								return jQuery.inArray(e.parent, array) !== -1;
							});

							var Brands = new sap.ui.model.json.JSONModel(result);
							this.getView().setModel(Brands, "Brands");
						}
					}

				} else if (selectedTab === 'QualityGroup') {
					var brandsModel = this.getView().getModel("Brands");
					if (collectionItemMode.getProperty("/BrandsSelectionUpdate")) {
						collectionItemMode.setProperty("/BrandsSelectionUpdate", false);
						this.selectedBrandParents = {};
						oParentList = this.getView().byId("Brandslist");
						selectedParents = oParentList.getSelectedContexts(true);
						if (selectedParents.length === 0) {
							oModel = this.getView().getModel("QualityGroup");
							oModel.setData({});
							oModel.updateBindings(true);
						} else {

							for (var sItem in selectedParents) {
								var item = selectedParents[sItem];
								var key = brandsModel.getProperty(item.sPath).ddkey;
								array.push(key);
								this.selectedBrandParents[key] = item.sPath;
							}

							// parent = this.getView().getModel().getProperty(this.selectedContext).namingkey;
							oModel = this.getOwnerComponent().getModel("QualityGroup");

							result = jQuery.grep(oModel.getData().ListItems, function(e) {
								return jQuery.inArray(e.parent, array) !== -1;
							});

							var QualityGroup = new sap.ui.model.json.JSONModel(result);
							this.getView().setModel(QualityGroup, "QualityGroup");
						}
					}

				} else if (selectedTab === 'Quality') {
					var qualityGroupModel = this.getView().getModel("QualityGroup");
					if (collectionItemMode.getProperty("/QualityGroupSelectionUpdate")) {
						collectionItemMode.setProperty("/QualityGroupSelectionUpdate", false);
						this.selectedQualityGroupParents = {};
						oParentList = this.getView().byId("QualityGrouplist");
						selectedParents = oParentList.getSelectedContexts(true);
						if (selectedParents.length === 0) {
							oModel = this.getView().getModel("Quality");
							oModel.setData({});
							oModel.updateBindings(true);
						} else {

							for (var sItem in selectedParents) {
								var item = selectedParents[sItem];
								var key = qualityGroupModel.getProperty(item.sPath).ddkey;
								array.push(key);
								this.selectedQualityGroupParents[key] = item.sPath;
							}

							// parent = this.getView().getModel().getProperty(this.selectedContext).namingkey;
							oModel = this.getOwnerComponent().getModel("Quality");

							result = jQuery.grep(oModel.getData().ListItems, function(e) {
								return jQuery.inArray(e.parent, array) !== -1;
							});

							var Quality = new sap.ui.model.json.JSONModel(result);
							this.getView().setModel(Quality, "Quality");
						}
					}

				} else if (selectedTab === 'BottleSize') {

					var qualityModel = this.getView().getModel("Quality");
					if (collectionItemMode.getProperty("/QualitySelectionUpdate")) {
						collectionItemMode.setProperty("/QualitySelectionUpdate", false);
						this.selectedQualityParents = {};
						oParentList = this.getView().byId("Qualitylist");
						selectedParents = oParentList.getSelectedContexts(true);
						if (selectedParents.length === 0) {
							oModel = this.getView().getModel("BottleSize");
							oModel.setData({});
							oModel.updateBindings(true);
						} else {

							for (var sItem in selectedParents) {
								var item = selectedParents[sItem];
								var key = qualityModel.getProperty(item.sPath).ddkey;
								array.push(key);
								this.selectedQualityParents[key] = item.sPath;
							}

							// parent = this.getView().getModel().getProperty(this.selectedContext).namingkey;
							oModel = this.getOwnerComponent().getModel("BottleSize");

							result = jQuery.grep(oModel.getData().ListItems, function(e) {
								return jQuery.inArray(e.parent, array) !== -1;
							});

							var BottleSize = new sap.ui.model.json.JSONModel(result);
							this.getView().setModel(BottleSize, "BottleSize");
						}
					}

				} else if (selectedTab === 'MaterialNumber') {

				}

			},*/

		// onSelectMaterialType:function(oEvent){
		// 	var text = oEvent.getSource().getSelectedItem().getText();
		// 	var MaterialModel =this.getView().getModel("MaterialModel");
		// 	MaterialModel.getProperty(oEvent.getSource().getParent().getBindingContextPath()).MaterialTypeDescription=text;

		// },

		handleAddMaterial: function(oEvent) {
			var itemPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
			var item = this.getView().getModel("MaterialModel").getProperty(itemPath);
			this.selectMatrialType(item.MaterialName, item.MaterialNumber);

			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment("demonewcassini.view.MaterialSearchPopup", this);
				this.getView().addDependent(this.oDialog);
			}
			// clear the old search filter
			this.oDialog.getBinding("items").filter([]);
			// toggle compact style for the dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oDialog);
			this.oDialog.open();

		},
		selectMatrialType: function(MaterialName, MaterialNumber) {

			var materialModel = this.getOwnerComponent().getModel("Materials");
			var oData = materialModel.getData();
			var result = jQuery.grep(oData.ListItems, function(e) {
				// return e.MaterialType === MaterialType;
				return (e.ddtext.includes(MaterialName) && e.ddkey.includes(MaterialNumber));
			});
			var SearchHelpModel = new sap.ui.model.json.JSONModel(result);
			this.getView().setModel(SearchHelpModel, "SearchHelpModel");
		},

		handleMaterialSearchClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts.length) {
				var Selectedrecord = aContexts.map(function(oContext) {
					return oContext.getObject();
				});
				var oTable = this.getView().byId("tbl_Material");
				var model = oTable.getModel("MaterialModel");
				var data = model.getData();
				data.ListItems.push({
					MaterialType: Selectedrecord[0].MaterialType,
					MaterialTypeDescription: Selectedrecord[0].MaterialTypeDescription,
					MaterialNumber: Selectedrecord[0].ddkey,
					MaterialName: Selectedrecord[0].ddtext,
					editable: false,
					deletable: true
				});
				model.setData(data);

			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleMaterialSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("MaterialName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);

		},
		handleMaterialDelete: function(oEvent) {
			var path = oEvent.getSource().getParent().getParent().getBindingContextPath();
			var oTable = this.getView().byId("tbl_Material");
			var model = oTable.getModel("MaterialModel");
			var data = model.getData();
			data.ListItems.splice(parseInt(path.substring(11)), 1);
			model.setData(data);
		},

		OnCancel: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			if (sPreviousHash !== undefined) {
				// window.history.go(-1);
				oRouter.navTo("CollectionGroupDetails", {}, true);

			} else {

				oRouter.navTo("CollectionGroupList", {}, true);
			}
		},
		OnSubmit: function() {

			var masterModel = this.getView().getModel("CollectionGroupInformation");
			var collectionItemMode = this.getView().getModel("collectionItemMode");
			var sPath = "/CollectionGroupInformation/" + (this.groupId) + "/Items";
			var data = masterModel.getProperty(sPath);
			var collectionRecord = [];

			if (collectionItemMode.getProperty("/MaterialNumber")) {
				var items = this.getView().getModel("MaterialModel").getData().ListItems;

				for (var index in items) {
					if (index > 0) {
						collectionRecord.push({
							materialDescription: items[index].MaterialName,
							materialkey: items[index].MaterialNumber
						});
					}
				}
			} else if (collectionItemMode.getProperty("/BottleSize")) {

				var BottleSizeList = this.getView().byId("BottleSizelist");
				var selctedBottleSizeList = BottleSizeList.getSelectedContexts(true);
				var bottleSizeModel = this.getView().getModel("BottleSize");
				for (var index in selctedBottleSizeList) {

					var item = bottleSizeModel.getProperty(selctedBottleSizeList[index].sPath);

					var parent = item.parent;
					var QualityContext = this.getView().getModel("Quality").getProperty(this.selectedQualityParents[parent]);

					var qualityGroupparent = QualityContext.parent;
					var QualityGroupContext = this.getView().getModel("QualityGroup").getProperty(this.selectedQualityGroupParents[qualityGroupparent]);

					var brandparent = QualityGroupContext.parent;
					var brandContext = this.getView().getModel("Brands").getProperty(this.selectedBrandParents[brandparent]);

					collectionRecord.push({
						bottleSizekey: item.ddkey,
						bottleSizeDescription: item.ddtext,
						qualitykey: parent,
						qualityDescription: QualityContext.ddtext,
						qualityGroupkey: qualityGroupparent,
						qualityGroupDescription: QualityGroupContext.ddtext,
						brandkey: brandparent,
						brandDescription: brandContext.ddtext,
						namingkey: brandContext.parent,
						namingDescription: this.getView().getModel("Naming").getProperty(this.selectedNamingParents[brandContext.parent]).ddtext
					});

				}

			} else if (collectionItemMode.getProperty("/Quality")) {

				var QualityList = this.getView().byId("Qualitylist");
				var selctedQualityList = QualityList.getSelectedContexts(true);
				var qualityModel = this.getView().getModel("Quality");
				for (var index in selctedQualityList) {

					var item = qualityModel.getProperty(selctedQualityList[index].sPath);

					var parent = item.parent;
					var QualityGroupContext = this.getView().getModel("QualityGroup").getProperty(this.selectedQualityGroupParents[parent]);

					var brandparent = QualityGroupContext.parent;
					var brandContext = this.getView().getModel("Brands").getProperty(this.selectedBrandParents[brandparent]);

					collectionRecord.push({
						qualitykey: item.ddkey,
						qualityDescription: item.ddtext,
						qualityGroupkey: parent,
						qualityGroupDescription: QualityGroupContext.ddtext,
						brandkey: brandparent,
						brandDescription: brandContext.ddtext,
						namingkey: brandContext.parent,
						namingDescription: this.getView().getModel("Naming").getProperty(this.selectedNamingParents[brandContext.parent]).ddtext
					});

				}

			} else if (collectionItemMode.getProperty("/QualityGroup")) {

				var QualityGroupList = this.getView().byId("QualityGrouplist");
				var selctedQualityGroupList = QualityGroupList.getSelectedContexts(true);
				var qualityGroupModel = this.getView().getModel("QualityGroup");
				for (var index in selctedQualityGroupList) {

					var item = qualityGroupModel.getProperty(selctedQualityGroupList[index].sPath);
					var parent = item.parent;
					var brandContext = this.getView().getModel("Brands").getProperty(this.selectedBrandParents[parent]);

					collectionRecord.push({
						qualityGroupkey: item.ddkey,
						qualityGroupDescription: item.ddtext,
						brandkey: parent,
						brandDescription: brandContext.ddtext,
						namingkey: brandContext.parent,
						namingDescription: this.getView().getModel("Naming").getProperty(this.selectedNamingParents[brandContext.parent]).ddtext
					});

				}

			} else if (collectionItemMode.getProperty("/Brand")) {

				var BrandsList = this.getView().byId("Brandslist");
				var selctedBrandsList = BrandsList.getSelectedContexts(true);
				var brandModel = this.getView().getModel("Brands");

				for (var index in selctedBrandsList) {

					var item = brandModel.getProperty(selctedBrandsList[index].sPath);
					var parent = item.parent;

					collectionRecord.push({
						brandkey: item.ddkey,
						brandDescription: item.ddtext,
						namingkey: parent,
						namingDescription: this.getView().getModel("Naming").getProperty(this.selectedNamingParents[parent]).ddtext
					});

				}
			} else if (collectionItemMode.getProperty("/Naming")) {

				var NamingList = this.getView().byId("Naminglist");
				var selctedNamingList = NamingList.getSelectedContexts(true);
				var NamingModel = this.getView().getModel("Naming");
				for (var index in selctedNamingList) {

					var item = NamingModel.getProperty(selctedNamingList[index].sPath);
					collectionRecord.push({
						namingkey: item.ddkey,
						namingDescription: item.ddtext
					});

				}
			}

			if (this.itemId !== undefined) {
				data[this.itemId] = collectionRecord[0];
			} else {
				data.push.apply(data, collectionRecord);
			}

			masterModel.refresh();

			this.OnCancel();

		}

	});

});