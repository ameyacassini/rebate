var jcrop_api;
$(function() {
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
	jcrop_api = this;
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

		$.post("https://api.ocr.space/parse/image", {
				apikey: "aa7aa7676d88957",
				language: "eng",
				isOverlayRequired: "true",
				base64Image: png
			},
			function(data, status) {
				var resultVal1 = data.ParsedResults[0].ParsedText;
				var resultVal = $.trim(resultVal1);
console.log(resultVal1);
				$(".writableLength input").each(function() {
					if (!$(this).hasClass("disabled")) {
						if ($(this).val() == '' && resultVal != '') {
							var $tdPrevs = $(this).closest('td').prev('td').attr('id');

							var Stype = validation.isNumber(resultVal);
							if (Stype == "error") {

								$.nok({

									message: "Please do proper selection",

									type: "error"

								});
								/*	alert("Please do selection properly");*/
							}else{
									$(this).val(Stype + '(' + resultVal.length + ')');
							$(this).addClass("disabled");
							var $tds = $(this).closest('td').next('td').attr('id'); //$row.find("td:nth-child(4)"); 
							$("#" + $tds + ' .writableVal input').val(resultVal);
							var trId = $(this).closest('tr').attr('id');
							$("#" + trId).addClass("filledRow");
							}
						
						}
					}
				});

			});

	}

});

$(document).ready(function() {
	$(document).ajaxStart(function() {
		$('.process_img').css("display", "block");
	});
	$(document).ajaxComplete(function() {
		$('.process_img').css("display", "none");
	});
});