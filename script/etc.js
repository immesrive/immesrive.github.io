
function mo_chk(){
    
	var os;

	var mobile = (/iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()));	 

	if (mobile) {
		var userAgent = navigator.userAgent.toLowerCase();
		if (userAgent.search("android") > -1){
			return os = "android";
		}else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)){
			return os = "ios";
		}else{
			return os = "otehr";
		}

	} else {
		return os = "pc";
	}
}

function action_app_instagram(android_url , ios_url , ios_appstore_url){
	var result_mo_chk = mo_chk();

	if(result_mo_chk!="pc"){
		if(result_mo_chk == "ios"){

			/*
			setTimeout( function() {
				window.open(ios_appstore_url);
			}, 1500);
			*/

			location.href = ios_url;
		}else{
			location.href = android_url;
		}
	}
}

function jsCopyLink(copyText) {
            
    var tmpTextarea = document.createElement('textarea');
    tmpTextarea.value = copyText;
 
    document.body.appendChild(tmpTextarea);
    tmpTextarea.select();
    tmpTextarea.setSelectionRange(0, 9999);  // 셀렉트 범위 설정
 
    document.execCommand('copy');
    document.body.removeChild(tmpTextarea);
    //alert("URL 복사가 완료되었습니다."); 
              
}


function makeModelViewer() {

		var obj = document.getElementById("parent");
		var newDIV = document.createElement("model-viewer");


		//newDIV.innerHTML = 'dfadfa ';
		newDIV.setAttribute("id","model-viewer");

		newDIV.setAttribute("src", "./../assets/models/H_A/LG TwinWash/TwinWash_W.glb");
		newDIV.setAttribute("ios-src", "./../assets/models/H_A/LG TwinWash/TwinWash_W.usdz" );

		newDIV.setAttribute("ar-modes","scene-viewer quick-look webxr");
        newDIV.setAttribute("ar-scale","auto");
		newDIV.setAttribute("auto-rotate","");
		
		obj.appendChild(newDIV);
	}