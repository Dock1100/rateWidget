function hasClass(el, name) {
   return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
}

function addClass(el, name)
{
   if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
}

function removeClass(el, name)
{
   if (hasClass(el, name)) {
      el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
   }
}

function Rate(){
	with (this) {
	var stars = null;
	var message = null;
	var votes = null;
	var valueSum = 0;
	var votesCount = 0;
	this.init = function(element){
		var str = "";
		str += '<ul class="rate_stars">';
			str += '<li data="1">&#9733;</li>';
			str += '<li data="2">&#9733;</li>';
			str += '<li data="3">&#9733;</li>';
			str += '<li data="4">&#9733;</li>';
			str += '<li data="5">&#9733;</li>';
		str += '</ul>';
		str += '<div class="rate_digit"></div>';
		str += '<div class="rate_voices"></div>';
		element.innerHTML = str;
		stars = element.childNodes[0];
		message = element.childNodes[1];
		votes = element.childNodes[2];
		stars.addEventListener("mouseover",rateMouseMove);
		stars.addEventListener("mouseout",rateMouseOut);
		stars.addEventListener("click",rateClick);
	}

	checkIsRate = function(elem){
		if (elem.className!="rate_stars") return true;
			else return false;
	}

	getStarNumber = function(elem){
		if (elem.getAttribute("data")) return parseInt(elem.getAttribute("data"));
			else return 0;
	}

	getMessage = function(value){
		value = Math.round(value*100)/100;
		if (value >= 4.5) return "OK";
		if ((value <= 3.5) && (value >= 2.5)) return "TAKE";
		if (value <= 1.5) return "HEOK";
		return value;
	}

	getVotes = function(votes){
		return votes+" голосів";
	}

	draw = function(value,type) {//type = all (redraw all with messages); 
								//else redraw hovered rate stars;
								//set value only for not full redraw
		v = valueSum/votesCount;
		if (type=="stars")
		{
			for (var i=0;i<stars.childElementCount;i++){
				removeClass(stars.childNodes[i],'rate_checked');
				removeClass(stars.childNodes[i],'rate_hover');
				if (i<value) addClass(stars.childNodes[i],'rate_hover');
				else if (i<Math.round(v)) addClass(stars.childNodes[i],'rate_checked');
			};
		} else if (type=="content") {
			if (votesCount>0) {
				message.innerHTML = getMessage(v);
				votes.innerHTML = getVotes(votesCount);
			}
		}
		else 
		{
			for (var i=0;i<stars.childElementCount;i++){
				removeClass(stars.childNodes[i],'rate_checked');
				removeClass(stars.childNodes[i],'rate_hover');
				if (i<Math.round(v)) addClass(stars.childNodes[i],'rate_checked');
				if (i<value) addClass(stars.childNodes[i],'rate_hover');

			};
			if (votesCount>0) {
				message.innerHTML = getMessage(v);
				votes.innerHTML = getVotes(votesCount);
			}
		}
	}

	addVoice = function(value){
		valueSum += parseInt(value);
		votesCount += 1;
	}

	rateMouseMove = function(e){
		if (checkIsRate(e.target))
			draw(getStarNumber(e.target),"stars");
	}

	rateMouseOut = function(e){
		if (checkIsRate(e.target)) draw(0,"all");
	}

	rateClick = function(e){
		if (checkIsRate(e.target)) {
			addVoice(getStarNumber(e.target));
			draw(getStarNumber(e.target),"all");
		}
	}

	//init(element);
}
};

window.onload = function(e){
	var body = document.getElementsByTagName("body")[0];
	if (body) {
		var nodes = body.getElementsByTagName("div");
		var rates = new Array; 
		var rateObj = new Array;
		for (var i=0;i<body.childElementCount;i++)
			if (nodes[i].getAttribute("name") == "rate") rates.push(nodes[i]);
		for (var i=0;i<rates.length;i++)		
		{
			rateObj.push(new Rate);
			console.log(rateObj[i]);
			rateObj[i].init(rates[i]);
		}
	}
}
