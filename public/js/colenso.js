

function goHome(){
	window.open("/","_self");
}
function browse(){
	window.open("browse","_self");
}
function addLetter(){
	window.open("add","_self");
}
function searchLetter(){
	window.open("search","_self");
}

function displayTitles(){
	
}
function featuredPrivateLetter() {
	$.ajax({
		type: "GET",
		url: "Colenso/Colenso/private_letters/PrL-0001.xml",
		dataType: "xml",
		success: function(xml) {
		}
	});
}