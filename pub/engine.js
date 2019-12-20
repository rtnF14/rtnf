//Get Base URL
//Example : if URL is http://localhost/r/Main/Internet 
//          then, base URL is http://localhost/r/Main/
function getBaseURL() {
	var thisPageURL = window.location.href;
	if (thisPageURL === "http://localhost/r/") 
	{ 
		thisPageURL = thisPageURL + "Main/"
	}
	else {
		var enough = false;
		while (!enough) {
			var length = thisPageURL.length;
			var lastChar = thisPageURL.charAt(length-1);
			
			if (lastChar === "/") {
				enough = true
			}
			else {
				thisPageURL = thisPageURL.slice(0,-1)
			}
		}
	}
	return thisPageURL;
}

//Convert string to title case
//Example: if input is ababa
//         then, output is Ababa
function titleCaser(item) {
	var theFirst = item.charAt(0);
	theFirst = theFirst.toUpperCase();
	var theRest = item.slice(1);
	var combined = theFirst + theRest;
	return combined
}

function copyToClipboard(str){
	var el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly','');
	el.style = {display:'none'};
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}


var dropArea = document.querySelector("#dropzone");
var everything = document.querySelector("body");
dropArea.addEventListener("dragenter",preventDefaults,false);
dropArea.addEventListener("dragover",preventDefaults,false);
dropArea.addEventListener("dragleave",preventDefaults,false);
dropArea.addEventListener("drop",preventDefaults,false);

dropArea.addEventListener("dragenter",highlight,false);
dropArea.addEventListener("dragover",highlight,false);
dropArea.addEventListener("dragleave",unhighlight,false);
dropArea.addEventListener("drop",unhighlight,false);

everything.addEventListener("dragenter",highlight,false);
everything.addEventListener("dragover",highlight,false);
everything.addEventListener("dragleave",unhighlight,false);
everything.addEventListener("drop",unhighlight,false);

dropArea.addEventListener("drop",handleDrop,false);

function preventDefaults(e){
	e.preventDefault()
	e.stopPropagation()
}
function highlight(e){
	console.log("dragenter!")
	dropArea.classList.add('highlight')
}
function unhighlight(e){
	dropArea.classList.remove('highlight')
}
function handleDrop(e){
	var dt = e.dataTransfer
	var files = dt.files
	console.log(files)
	handleFiles(files)
}
function handleFiles(files){
	([...files].forEach(uploadFile))
}
function uploadFile(file){
	console.log(file)
	var url = window.location.href +"?action=postupload";
	var fullURL = window.location.href;
  fullURL = fullURL.split("/")
  var n = fullURL[fullURL.length-2]+"."+fullURL[fullURL.length-1]

	console.log(url);
	var formData = new FormData()
	formData.append('n',n)
	formData.append('action',"postupload")
	formData.append('uploadfile',file)
	fetch(url,{
		method:'POST',
		body:formData
	})
	.then((e)=>{console.log(e)})
	.catch(()=>{console.log("error")})
}



//Shortcut Functionality
//Ctrl + . = New node
//Only work for main namespace :(
document.onkeyup = function(e) {
  console.log(e.which);
  if (e.ctrlKey && e.which == 190) {
	var a = prompt("Node name");
	if (a != null){
		var split_a = a.split(" ");
		console.log(split_a);
		var i = 0;
		for (var i=0; i <split_a.length; i++){
			split_a[i] = titleCaser(split_a[i])
		}
		a = ""
		for (var i=0; i <split_a.length; i++){
			a = a + split_a[i]
		}
		baseURL = getBaseURL()
		var URL = baseURL + a + "?action=edit";
		window.location = baseURL + a + "?action=edit";
	}
  }
  else if (e.ctrlKey && e.which == 188) {
	window.location = window.location.href+"?action=edit";
  }
  else if (e.ctrlKey && e.which == 191) {
	var a = prompt("Node name");
	if (a != null){
		var split_a = a.split(" ");
		console.log(split_a);
		var i = 0;
		for (var i=0; i <split_a.length; i++){
			split_a[i] = titleCaser(split_a[i])
		}
		a = ""
		for (var i=0; i <split_a.length; i++){
			a = a + split_a[i]
		}
		baseURL = getBaseURL()
		var URL = baseURL + a + "?action=edit";
		window.location = baseURL + a;
	}
  }
  else if (e.ctrlKey && e.which == 59){
  	var fullURL = window.location.href;
  	fullURL = fullURL.split("/")
  	var nodeKey = fullURL[fullURL.length-1];
  	var titleNode = document.querySelector(".pagetitle");
  	var linkSyntax = "[[" + nodeKey +"|" + titleNode.innerHTML  +"]]";
  	console.log(nodeKey);
  	console.log(titleNode.innerHTML);
  	console.log(linkSyntax);
  	copyToClipboard(linkSyntax);
  	var oldTitle = document.title;
  	document.title = "Node Copied..";
  	setTimeout(function(){
  		document.title = oldTitle;
  	}, 1000);
  }

};

//"Class" Functionality
//Fixing proper link from instance to class
var targetnode = document.getElementById("rtnf");
target = targetnode.href
target = target.replace("%3C/p%3E","")
target = target.replace("%3Cp%3E","")
target = target.replace(new RegExp("%20","g"),"");
console.log(target);


targetnode.href = target


var textarea = window.document.querySelector("textarea");
if(textarea){	
	textarea.onkeyup = function(e){
		if(textarea.scrollTop != 0){
			textarea.style.height = textarea.scrollHeight + "px";
			console.log("Did something! " + textarea.scrollTop)
		}
	
		if(e.which == 34){
			window.scrollBy(0,125);	
		}
		else if (e.which == 33){
			window.scrollBy(0,-125);
		}
	}
}




window.addEventListener("load",function() {
	textarea = window.document.querySelector("textarea");
	if(textarea){
	textarea.style.height = textarea.scrollHeight + "px";
	}
	
},false);


//Img Server Functionality
var target1 = document.getElementById("imgstrg").innerHTML
target1 = target1.replace("</p>","")
target1 = target1.replace("<p>","")
target1 = target1.replace(/(\r\n|\n|\r)/gm, "");
console.log(target1)

function isNumeric(num){
	return !isNaN(num)
}


if (target1.length != 0) {
	console.log("lolos!")
	imgpath = "http://localhost/r/pub/imgstrg/imgstrg_server.php?id=" + target1;
	$.get(imgpath, function(data,status){
		//console.log(data)
		$('<div class="img_showcase"><img style="width:100%" src="' + data +'" ></div>').insertAfter("#wikitext")
	});
}







//Img Paste Functionality
$(function(){
      $('.demo-noninputable').pastableNonInputable();
      $('.demo-textarea').on('focus', function(){
        var isFocused = $(this).hasClass('pastable-focus');
        console && console.log('[textarea] focus event fired! ' + (isFocused ? 'fake onfocus' : 'real onfocus'));
      }).pastableTextarea().on('blur', function(){
        var isFocused = $(this).hasClass('pastable-focus');
        console && console.log('[textarea] blur event fired! ' + (isFocused ? 'fake onblur' : 'real onblur'));
      });
      $('.demo-contenteditable').pastableContenteditable();
      $('.demo').on('pasteImage', function(ev, data){
		//Data is the image
		console.log(data)
		
		//Send the image to imgstrg 
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function(data) {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Image is sent to imgstrg" + data)
				img_id = data.currentTarget.response
				img_script = "(:Imgstrg:"+img_id+":)"
				current_tbox_val = $("#text").val();
				new_tbox_val = current_tbox_val + img_script;
				$("#text").val(new_tbox_val);
			}
		}
		xhttp.open("POST","http://localhost/r/pub/imgstrg/imgstrg.php")
		var formData = new FormData();
		formData.append('size',data.blob.size);
		formData.append('type',data.blob.type);
		formData.append('dataURL',data.dataURL);
		formData.append('height',data.height);
		formData.append('width',data.width);
		xhttp.send(formData)
		
		
		
        var blobUrl = URL.createObjectURL(data.blob);
        $('<div class="img_showcase"><img style="width:100%" src="' + data.dataURL +'" ></div>').insertAfter(this);
      }).on('pasteImageError', function(ev, data){
        alert('Oops: ' + data.message);
        if(data.url){
          alert('But we got its url anyway:' + data.url)
        }
      }).on('pasteText', function(ev, data){
        $('<div class="result"></div>').text('text: "' + data.text + '"').insertAfter(this);
      });
    });
console.log("Prep done!")


//Nodepeek

function nodepeek(node){
	console.log(node)
}

var wikilinks = document.getElementsByClassName("wikilink")
for (var i=0; i<wikilinks.length; i++){
	wikilinks[i].onmouseover = function() {
		console.log("wikilink selected!");
		var link = this.href
		var link = link.split("/")
		var nodekey = link[link.length-1]
		console.log(nodekey)
		//Send the hovered link to nodeservr 
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function(data) {
			if (this.readyState == 4 && this.status == 200) {
				console.log(data.currentTarget.response)
				console.log("Hovered link data is sent to nodeservr" + data)
			}
		}
		xhttp.open("POST","http://localhost/r/pub/nodeservr/nodeservr.php")
		var formData = new FormData();
		formData.append('nodekey',nodekey);
		xhttp.send(formData)


		/*
		console.log(this.href)
		const url = this.href
		fetch(url)
		.then(function(data){console.log(data.text())})
		.catch(function(error){console.log(error)})
		*/

	}
}