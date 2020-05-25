function addSkipButton() {
    let duration = document.getElementById("vilosRoot");
    let button = document.createElement("div");
   // let text = document.createTextNode("SKIP INTRO");

    button.style.zIndex = 999;
    button.style.color = "white";
    button.style.position = "fixed";
    button.style.right = 0;
    button.style.bottom = "80px";
    button.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    button.style.border = "1px solid white";
    button.style.padding = "10px 10px 9px 10px";
    button.style.margin = "0 20px 0 0";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";
    button.style.display = "none";
	button.id = "skipButton";
	button.onclick = skipTime;
    /*     button.onclick = () => {
            if (timestamp > video.currentTime) {
                video.currentTime = timestamp;
            }
        }; */

  //  button.appendChild(text);
    duration.insertAdjacentElement("afterend", button);

	window.setInterval(showHideSkipButton, 1000);
	
    /*     setInterval(() => {
            if (video.currentTime > timestamp - 1 && button.style.display === "block") {
                button.style.display = "none";
            } else if (video.currentTime < timestamp - 1 && button.style.display === "none") {
                button.style.display = "block";
            }
        }, 1000); */
}

function skipTime()
{
	let skipButton = document.getElementById("skipButton");
	let player = document.getElementById('player0');
	let time = parseInt(player.currentTime);
	let isVisible = false;
	if(selectedOutroSkiptimestamp)
	{
		if(time >= parseInt(selectedOutroSkiptimestamp.begin) && time <= parseInt(selectedOutroSkiptimestamp.end))
		{
			player.currentTime = selectedOutroSkiptimestamp.end+1;
			return;
		}
	}
	
	if(selectedIntroSkiptimestamp)
	{
		if(time >= parseInt(selectedIntroSkiptimestamp.begin) && time <= parseInt(selectedIntroSkiptimestamp.end))
		{
			player.currentTime = selectedIntroSkiptimestamp.end+1;
			return;
		}
	}
}

function showHideSkipButton()
{
	let skipButton = document.getElementById("skipButton");
	let player = document.getElementById('player0');
	let time = parseInt(player.currentTime);
	let isVisible = false;
	if(selectedOutroSkiptimestamp)
	{
		if(time >= parseInt(selectedOutroSkiptimestamp.begin) && time <= parseInt(selectedOutroSkiptimestamp.end) && isSettingsWindowShown === false)
		{
			skipButton.innerHTML = "SKIP OUTRO";
			skipButton.style.display = "block";
			isVisible = true;
		}
		else
		{
			skipButton.style.display = "none";
		}
	}
	
	if(selectedIntroSkiptimestamp)
	{
		if(time >= parseInt(selectedIntroSkiptimestamp.begin) && time <= parseInt(selectedIntroSkiptimestamp.end) && isSettingsWindowShown === false)
		{
			skipButton.innerHTML = "SKIP INTRO";
			skipButton.style.display = "block";
		}
		else
		{
			if(isVisible === false)
				skipButton.style.display = "none";
		}
	}
	

}

function observeVelocityControlsPackageDiv() {
    new MutationObserver((mutationsList) => {
        const addedNode = mutationsList[mutationsList.length - 1].addedNodes[0];
        if (addedNode && addedNode.id === 'vilosControlsContainer' && addedNode.hasChildNodes()) addSettings(addedNode);
    }).observe(document.getElementById('velocity-controls-package'), {
        childList: true,
    });
}

function addTimeOptions(prepend, selected, duration)
{
	let time = secondsToHms(selected);
	let durationTime = secondsToHms(duration);
	let hourSkip = document.getElementById(  prepend +'HourSkip');
	
	
	
	for(let i = 0; i < durationTime.hours +1;i++ )
	{
		var option = document.createElement("option");
		option.text = i.toString().padStart(2, '0');
		option.value = i;
		hourSkip.add(option);
	}

	
	let minuteSkip = document.getElementById(prepend+'MinSkip');
	for(let i = 0; i < 60;i++ )
	{
		var option = document.createElement("option");
		option.text = i.toString().padStart(2, '0');
		option.value = i;
		minuteSkip.add(option);
	}
	//console.log( minutes.toString().padStart(2, '0'));

	let secondSkip = document.getElementById(prepend+'SecSkip');
	for(let i = 0; i < 60;i++ )
	{
		var option = document.createElement("option");
		option.text = i.toString().padStart(2, '0');
		option.value = i;
		secondSkip.add(option);
	}
	
	secondSkip.value = time.seconds;
	minuteSkip.value = time.minutes;
	hourSkip.value = time.hours;
}



function seconds(hrs,min,sec)
{
    return((hrs*60*60+min*60+sec));
}

function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}



function uploadSkiptimestamp()
{
		let uploadBtn = document.getElementById("uploadSkip");
		uploadBtn.disabled = true;
		window.setTimeout(function() {
			uploadBtn.disabled = false;
		}, 5000)
	
		let fromHour = parseInt(document.getElementById('fromHourSkip').value);
		let fromMin =  parseInt(document.getElementById('fromMinSkip').value);
		let fromSec =  parseInt(document.getElementById('fromSecSkip').value);
		let toHour = parseInt(document.getElementById('toHourSkip').value);
		let toMin =  parseInt(document.getElementById('toMinSkip').value);
		let toSec =  parseInt(document.getElementById('toSecSkip').value);
		
		
		let type = parseInt(document.getElementById('introOutroType').value);
		
		let fromSeconds = seconds(fromHour, fromMin, fromSec);
		let toSeconds = seconds(toHour, toMin, toSec);
		
		
		if(fromSeconds > toSeconds)
		{
			showSnackbar("Skip not added, because the 'from' time is later than the 'to' time.");
			return;
		}
		
		let skipTimestamp = {url:referrer, begin:fromSeconds, end:toSeconds, type: type};
		// Sending and receiving data in JSON format using POST method
		//
		let url = skipUrl + skipTimestampUrl + "/" + skipTimestampAddUrl;
		let xhr = createCORSRequest("POST", url);
	
		//xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
		
			if (xhr.readyState === 4 && xhr.status === 200) {
				
	
				let skipTimestamp = JSON.parse(this.responseText);
				
				
				
				if(skipTimestamp.type === 1)
				{
					introSkiptimestamps.unshift(skipTimestamp);
					
					showSnackbar("Intro skip added");
				}
				
				if(skipTimestamp.type === 2)
				{
					outroSkiptimestamps.unshift(skipTimestamp);
					showSnackbar("Outro skip added");
				}
				
				showSkiptimestamps();
			}
			if (xhr.readyState === 4 && xhr.status === 204) {
				showSnackbar("Skip not added, because too many skips from your IP.");
			}
		};
		let data = JSON.stringify(skipTimestamp);
		xhr.send(data);
				
}

function showSkipstimestampsByType(prepend, skiptimestamps)
{
	let skips = document.getElementById(prepend + 'Skips');
	removeOptions(skips);
	for (let i = 0; i < skiptimestamps.length; i++) {
	  let skipTimestamp = skiptimestamps[i];

	  	let option = document.createElement("option");
		let beginTime = secondsToHms(skipTimestamp.begin);
		let endTime = secondsToHms(skipTimestamp.end);
		let rank = parseInt(i)+1;
	
		option.text = "(" + rank + ") " + beginTime.hours.toString().padStart(2, '0') + ":" + beginTime.minutes.toString().padStart(2, '0') + ":" + beginTime.seconds.toString().padStart(2, '0') + " - " + endTime.hours.toString().padStart(2, '0') + ":" + endTime.minutes.toString().padStart(2, '0') + ":" + endTime.seconds.toString().padStart(2, '0');
		option.value = skipTimestamp.id;
		skips.add(option);
	  
	}
	
	if(skiptimestamps.length === 0)
	{
		let option = document.createElement("option");
		
		let text = "Be the first to add!"
		option.text = text;
		option.value = -1;
					
		skips.add(option);
	}
}

function removeOptions(selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

function showSkiptimestamps()
{
	showSkipstimestampsByType('intro', introSkiptimestamps);
	showSkipstimestampsByType('outro', outroSkiptimestamps);
	
	introSkipsChange();
	outroSkipsChange();
}

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

   return {
        hours : h,
        minutes : m,
        seconds : s,
        clock : h + ":" + m + ":" + s
    };
}

function introLike()
{
	addRating(1, "introSkips", this, document.getElementById("introDislike"));

}
function introDislike()
{
	addRating(-1, "introSkips", this, document.getElementById("introLike"));
}

function outroLike()
{
	addRating(1, "outroSkips", this, document.getElementById("outroDislike"));

}
function outroDislike()
{
	addRating(-1, "outroSkips", this, document.getElementById("outroLike"));
}

function showRatingState(likeDislikeBtnElement, otherLikeDislikeBtnElement, rating)
{
	
	likeDislikeBtnElement.style.color = "white";
	otherLikeDislikeBtnElement.style.backgroundColor = "";
	otherLikeDislikeBtnElement.style.color = "";
	
	if(rating === 0)
	{
		likeDislikeBtnElement.style.backgroundColor = "";
		likeDislikeBtnElement.style.color = "";
	}
	if(rating === 1)
	{
		likeDislikeBtnElement.style.backgroundColor  = "green";
	}
	if(rating === -1)
	{
		likeDislikeBtnElement.style.backgroundColor  = "red";
	}
}

function addRating(rating, elementId, likeDislikeBtnElement, otherLikeDislikeBtnElement)
{
	
	likeDislikeBtnElement.disabled = true;
	otherLikeDislikeBtnElement.disabled = true;
	window.setTimeout(function(){
		likeDislikeBtnElement.disabled = false;
		otherLikeDislikeBtnElement.disabled = false;
	}, 5000)
	let skipTimestampId = document.getElementById(elementId).value;
	if(skipTimestampId === "")
		return;
	let url = skipUrl + skipRatingUrl + "/" + skipRatingAddUrl;
	let xhr = createCORSRequest("POST", url + "?rating=" +  rating + "&skipTimestampId=" + skipTimestampId);
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			
		
			
			showRatingState(likeDislikeBtnElement, otherLikeDislikeBtnElement, rating);
		}
	};
	xhr.send(null);
}


function showIntroOutroSkipsChange(otherBtnId, thisBtnId, introOutroSkipsCbxId)
{
	let otherBtn = document.getElementById(otherBtnId);
	let thisBtn = document.getElementById(thisBtnId);
	
	let skipTimestampId = document.getElementById(introOutroSkipsCbxId).value;
	
	if(skipTimestampId === "-1")
	{
		otherBtn.disabled = true;
		thisBtn.disabled = true;
		return;
	}
	else
	{
		otherBtn.disabled = false;
		thisBtn.disabled = false;
	}
	
	if(skipTimestampId === "")
		return;
	let url = skipUrl + skipRatingUrl + "/" + skipRatingGetRatingUrl;
	let xhr = createCORSRequest("GET", url + "?&skipTimestampId=" + skipTimestampId);
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
		
			let rating = parseInt(this.responseText);
			
			if(rating === 0)
			{
				showRatingState(thisBtn, otherBtn, rating)
			}
			if(rating === 1)
			{
				showRatingState(thisBtn, otherBtn, rating)
			}
			if(rating === -1)
			{
				showRatingState(otherBtn,thisBtn , rating)
			}
		
		}
	};
	xhr.send(null);
}

function introSkipsChange()
{
	let elementName = "introSkips";
	showIntroOutroSkipsChange("introDislike", "introLike", elementName);
	
	let cbx = document.getElementById(elementName);
	for(let i = 0; i < introSkiptimestamps.length; i++)
	{
		let introSkiptimestamp = introSkiptimestamps[i];
		if(introSkiptimestamp.id === cbx.value)
		{
			selectedIntroSkiptimestamp = introSkiptimestamp;
		}
	}
	
	

}

function outroSkipsChange()
{
	let elementName = "outroSkips";
	showIntroOutroSkipsChange("outroDislike", "outroLike", elementName);
	
	let cbx = document.getElementById(elementName);
	for(let i = 0; i < outroSkiptimestamps.length; i++)
	{
		let outroSkiptimestamp = outroSkiptimestamps[i];
		if(outroSkiptimestamp.id === cbx.value)
		{
			selectedOutroSkiptimestamp = outroSkiptimestamp;
		}
	}
}

function addSettings(vilosControlsContainer) {
    const controlsBar = vilosControlsContainer.firstElementChild.lastElementChild.children[2];
    if (!controlsBar) return;
    const controlsBarLeft = controlsBar.firstElementChild;
    const controlsBarRight = controlsBar.lastElementChild;
    const controlsBarRightSettingsButton = controlsBarRight.firstElementChild;


    new MutationObserver(() => {
        const vilosSettingsMenu = document.getElementById('vilosSettingsMenu');
      
        if (vilosSettingsMenu) {

            vilosSettingsMenu.style.width = '400px';
            vilosSettingsMenu.insertAdjacentHTML('beforeend', settingHtml);
			
			document.getElementById("uploadSkip").onclick = uploadSkiptimestamp;
			document.getElementById("introLike").onclick = introLike;
			document.getElementById("introDislike").onclick = introDislike;
			document.getElementById("outroLike").onclick = outroLike;
			document.getElementById("outroDislike").onclick = outroDislike;
			document.getElementById("introSkips").onchange = introSkipsChange;
			document.getElementById("outroSkips").onchange = outroSkipsChange;
			
			let player = document.getElementById('player0');
			let currentTime = player.currentTime;
			let duration = player.duration;
			
			addTimeOptions("from", currentTime, duration);
			addTimeOptions("to", currentTime + 90, duration);
			showSkiptimestamps();
			

			if(currentTime > duration/2)
			{

				let introOutroType = document.getElementById('introOutroType');
				introOutroType.selectedIndex = "1";
			}
			isSettingsWindowShown = true;
        }
		else
		{
			isSettingsWindowShown = false;
			
		}
		showHideSkipButton();
    }).observe(controlsBarRightSettingsButton, {
        childList: true,
    });
}

function setSkiptimestampsByType(skipTimestampType)
{
	let url = skipUrl + skipTimestampUrl + "/" + skipTimestampGetUrl;
		let xhr = createCORSRequest("GET", url + "?url=" +  referrer + "&skipTimestampType=" + skipTimestampType);
		
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				
				if(skipTimestampType === 1)
				{
					introSkiptimestamps = JSON.parse(this.responseText);
					if(introSkiptimestamps.length > 0)
						selectedIntroSkiptimestamp = introSkiptimestamps[0];
				}
				
				if(skipTimestampType === 2)
				{
					outroSkiptimestamps = JSON.parse(this.responseText);
					if(outroSkiptimestamps.length > 0)
						selectedOutroSkiptimestamp = outroSkiptimestamps[0];
				}
			}
		};
		xhr.send(null);
}
function setSkiptimestamps()
{
	setSkiptimestampsByType(1);
	setSkiptimestampsByType(2);
}

function showSnackbar(message) 
{
	// Get the snackbar DIV
	var x = document.getElementById("snackbar");
	x.innerHTML = message;
	// Add the "show" class to DIV
	x.className = "show";

	// After 3 seconds, remove the show class from DIV
	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function init() {

    let player = document.getElementById('player0');
    referrer = document.referrer;
	
	addSkipButton();
	
    setSkiptimestamps();


    if (document.getElementById('velocity-controls-package')) {
        observeVelocityControlsPackageDiv();
    } else {
        new MutationObserver((mutationsList, observer) => {
            observer.disconnect();
            observeVelocityControlsPackageDiv();
        }).observe(document.getElementById('vilosRoot'), {
            childList: true,
        });
    }


}

var isSettingsWindowShown = false;
var introSkiptimestamps = [];
var outroSkiptimestamps = [];
var selectedIntroSkiptimestamp;
var selectedOutroSkiptimestamp;
var skipUrl = "https://www.crskipper.com/";
//var skipUrl = "https://83.84.39.207:44391/";
var skipTimestampUrl = "skip";
var skipTimestampAddUrl = "add";
var skipTimestampGetUrl = "get";
var skipRatingUrl = "skiprating";
var skipRatingAddUrl = "add";
var skipRatingGetRatingUrl = "getrating";
var referrer = "";
var settingHtml = "<style>/* The snackbar - position it at the bottom and in the middle of the screen */#snackbar { visibility: hidden; /* Hidden by default. Visible on click */ min-width: 250px; /* Set a default minimum width */ margin-left: -125px; /* Divide value of min-width by 2 */ background-color: #333; /* Black background color */ color: #fff; /* White text color */ text-align: center; /* Centered text */ border-radius: 2px; /* Rounded borders */ padding: 16px; /* Padding */ position: fixed; /* Sit on top of the screen */ z-index: 1; /* Add a z-index if needed */ left: 50%; /* Center the snackbar */ bottom: 30px; /* 30px from the bottom */}/* Show the snackbar when clicking on a button (class added with JavaScript) */#snackbar.show { visibility: visible; /* Show the snackbar */ /* Add animation: Take 0.5 seconds to fade in and out the snackbar. However, delay the fade out process for 2.5 seconds */ -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s; animation: fadein 0.5s, fadeout 0.5s 2.5s;}/* Animations to fade the snackbar in and out */@-webkit-keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}@keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;}}@-webkit-keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;}}@keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;}}</style><div id='snackbar'></div><div> <hr style='width:100%;'> <div style='text-align:center;font-family: Lato; font-size: 14px; font-weight: 500; color: rgb(218, 218, 218);'> <h3>CR Skipper</h3> </div> <div data-focusable='true' tabindex='0' class='css-1dbjc4n r-1awozwy r-1loqt21 r-18u37iz r-eu3ka r-1wtj0ep r-b5h31w r-1ah4tor r-1otgn73' data-testid='vilos-settings_texttrack_submenu' style=''> <div class='css-1dbjc4n r-1awozwy r-13awgt0 r-18u37iz r-1wtj0ep'> <div dir='auto' class='css-901oao r-jwli3a' style='font-family: Lato; font-size: 14px; font-weight: 500;'>Add Skip</div> <div class='css-1dbjc4n r-1awozwy r-18u37iz r-1t0rgn2' style='font-family: Lato; font-size: 14px; font-weight: 500; color: rgb(218, 218, 218);'> From Hour <select id='fromHourSkip' style='margin-left:5px;margin-right:5px'> </select> Min <select id='fromMinSkip' style='margin-left:5px;margin-right:5px'> </select> Sec <select id='fromSecSkip' style='margin-left:5px;'> </select> </div> </div> </div> <div data-focusable='true' tabindex='0' class='css-1dbjc4n r-1awozwy r-1loqt21 r-18u37iz r-eu3ka r-1wtj0ep r-b5h31w r-1ah4tor r-1otgn73' data-testid='vilos-settings_texttrack_submenu' style=''> <div class='css-1dbjc4n r-1awozwy r-13awgt0 r-18u37iz r-1wtj0ep'> <div dir='auto' class='css-901oao r-jwli3a' style='font-family: Lato; font-size: 14px; font-weight: 500;'></div> <div class='css-1dbjc4n r-1awozwy r-18u37iz r-1t0rgn2' style='font-family: Lato; font-size: 14px; font-weight: 500; color: rgb(218, 218, 218);'> To Hour <select id='toHourSkip' style='margin-left:5px;margin-right:5px'> </select> Min <select id='toMinSkip' style='margin-left:5px;margin-right:5px'> </select> Sec <select id='toSecSkip' style='margin-left:5px;'> </select> </div> </div> </div> <div data-focusable='true' tabindex='0' class='css-1dbjc4n r-1awozwy r-1loqt21 r-18u37iz r-eu3ka r-1wtj0ep r-b5h31w r-1ah4tor r-1otgn73' data-testid='vilos-settings_texttrack_submenu' style=''> <div class='css-1dbjc4n r-1awozwy r-13awgt0 r-18u37iz r-1wtj0ep'> <div dir='auto' class='css-901oao r-jwli3a' style='font-family: Lato; font-size: 14px; font-weight: 500;'></div> <div class='css-1dbjc4n r-1awozwy r-18u37iz r-1t0rgn2' style='font-family: Lato; font-size: 14px; font-weight: 500; color: rgb(218, 218, 218);'> Intro/Outro <select id='introOutroType' style='margin-left:5px;margin-right:5px'> <option value='1'>Intro</option> <option value='2'>Outro</option> </select> <input id='uploadSkip' style='margin-left:10px;' type='button' value='Upload' /> </div> </div> </div> <hr style='width:100%;'> <div data-focusable='true' tabindex='0' class='css-1dbjc4n r-1awozwy r-1loqt21 r-18u37iz r-eu3ka r-1wtj0ep r-b5h31w r-1ah4tor r-1otgn73' data-testid='vilos-settings_texttrack_submenu' style=''> <div class='css-1dbjc4n r-1awozwy r-13awgt0 r-18u37iz r-1wtj0ep'> <div dir='auto' class='css-901oao r-jwli3a' style='font-family: Lato; font-size: 14px; font-weight: 500;'>Intro Skip</div> <div class='css-1dbjc4n r-1awozwy r-18u37iz r-1t0rgn2' style='font-family: Lato; font-size: 14px; font-weight: 500; color: rgb(218, 218, 218);'> <select id='introSkips' style='width:150px;'> </select> <input id='introLike' style='margin-left:10px;' type='button' value='Like' /> <input id='introDislike' style='margin-left:5px' type='button' value='Dislike' /> </div> </div> </div> <div data-focusable='true' tabindex='0' class='css-1dbjc4n r-1awozwy r-1loqt21 r-18u37iz r-eu3ka r-1wtj0ep r-b5h31w r-1ah4tor r-1otgn73' data-testid='vilos-settings_texttrack_submenu' style=''> <div class='css-1dbjc4n r-1awozwy r-13awgt0 r-18u37iz r-1wtj0ep'> <div dir='auto' class='css-901oao r-jwli3a' style='font-family: Lato; font-size: 14px; font-weight: 500;'>Outro Skip</div> <div class='css-1dbjc4n r-1awozwy r-18u37iz r-1t0rgn2' style='font-family: Lato; font-size: 14px; font-weight: 500; color: rgb(218, 218, 218);'> <select id='outroSkips' style='width:150px;'> </select> <input id='outroLike' style='margin-left:10px;' type='button' value='Like' /> <input id='outroDislike' style='margin-left:5px' type='button' value='Dislike' /> </div> </div> </div> <hr style='width:100%;'></div>";
init();