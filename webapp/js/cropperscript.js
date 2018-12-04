$(function () {
var $image = $('.cropbox1');

$image.cropper({});

// Get the Cropper.js instance after initialized
var cropper = $image.data('cropper');
var d=cropper.getCroppedCanvas();

});