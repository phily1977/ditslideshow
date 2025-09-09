/*
ditSlideShow图片幻灯片,版本1.1
作者：Phil

配置config
	config = {
		'tipbar_top':'35%',
		'subtitle_fontsize' : '24pt',
		'subtitle_top':'60%',
		'dotwidth':'14px',
		'interval':4000,
		'arrow_size':'2em',
		'animation':'fade'
		};

	'animation'有'fade'、'bounce'、'zoom'、'slide'、'flip'
	
	data为json数据,如果data不为空则按照data来生成
	data = {
		"slides":[{"pic":"images/0.jpg","url":"0","title":"1) Held in the park, there are millions of tulips"},
				{"pic":"images/1.jpg","url":"1","title":"2) A Time-Traveling Tribute: A tribute to the heroes of the Four-Row Warehouse"},
				{"pic":"images/2.jpg","url":"2","title":"3) Spring Palette: Take the subway to see the tulips"},
				]
	}
*/
class ditSlideShow
{
	
	//构造函数
	constructor(config = {'tipbar_top':'35%','subtitle_fontsize' : '24pt','subtitle_top':'50%','dotsize':'14px','interval':4000,'arrow_size':'2em','animation':'fadeIn'})
	{
		this.interval = (config.interval!=null)?config.interval:4000;
		this.slide_cur_img = 0;
		this.config = config;
	}
	
	//url数据获取
	async getdata(url){
		let response = await fetch(url);
		let data = await response.json();
		
		this.eleSlideBox.data = data;
		this.eleSlideBox.dispatchEvent(new CustomEvent('slideDataReady', {
			detail:{
				eleSlideBox:this.eleSlideBox,
				thisobj:this
			},
			bubbles: false, // 事件是否冒泡
			cancelable: false, // 事件能否被取消
			composed: false // 事件是否会在影子DOM根节点之外触发侦听器
		}));
		
		
		
		return data;
	}
	
	
	//绑定页面对象
	bind(objElementClassName,data=null){
		this.eleSlideBox = document.querySelector(objElementClassName);
		this.slide_cur_img = 0;
		this.eleSlideBox.side_cur_img = 0;
		
		//异步加载远程的json数据
		this.eleSlideBox.addEventListener('slideDataReady', function (evt) {
			//如果data不为空则按照data来生成
			console.log(evt.target);
			console.log(evt.detail.eleSlideBox.data);
			if (this.data!=null)
			{
				evt.detail.thisobj.init(evt.detail.eleSlideBox);
			}
		});
		
		
		console.log(typeof data);
		if (typeof data == 'object'){
			//data就是数据
			this.data = data;
			this.eleSlideBox.data = data;
			if (this.data!=null)
			{
				this.init(this.eleSlideBox);
			}
		}else{
			//data是字符串url，远程获取数据
			this.data = this.getdata(data);
			
		}

	}
	
	//初始化dom
	init(eleSlideBox){
		//清空绑定元素内容
		eleSlideBox.innerHTML = "";
		for(var i=0;i<eleSlideBox.data.slides.length;i++)
		{
			var slidebg = document.createElement("div");
			slidebg.setAttribute("id","bg"+i);
			slidebg.className = "slidebg slide";
			
			var subtitle = document.createElement("div");
			subtitle.className = "subtitle";
			subtitle.innerHTML ="<div><span><a href=\""+eleSlideBox.data.slides[i].url+"\">"+eleSlideBox.data.slides[i].title+"</a></span></div>";
			slidebg.appendChild(subtitle);
			
			var slideimage = document.createElement("div");
			slideimage.className = "slideimage";
			slideimage.innerHTML ="<img src=\""+eleSlideBox.data.slides[i].pic+"\" />";
			slidebg.appendChild(slideimage);
			
			eleSlideBox.appendChild(slidebg);


		}
		
		//点翻页
		var tipbar = document.createElement("div");
		tipbar.className = "tipbar";
		tipbar.innerHTML = "<div class=\"turnbar\"><div class=\"leftbtn\"><img src=\"toolsicon/angle-left.svg\"/></div><div class=\"rightbtn\"><img src=\"toolsicon/angle-right.svg\"/></div></div><div class=\"flipdot\"></div>";
		
		eleSlideBox.appendChild(tipbar);
		
		eleSlideBox.dispatchEvent(new CustomEvent('slideReady', {

			bubbles: false, // 事件是否冒泡
			cancelable: false, // 事件能否被取消
			composed: false // 事件是否会在影子DOM根节点之外触发侦听器
		}));
		
	}
	
	
	//图片轮播函数
	autoTurnSlides(curObj) {
		var imgs = curObj.eleSlideBox.children;
		
		if (curObj.slide_cur_img<imgs.length-1){
			curObj.animateIn(imgs[curObj.slide_cur_img]);
			
			var cur_dot =  curObj.eleSlideBox.querySelector(".flipdot > div[slideid='"+curObj.slide_cur_img+"']");
			cur_dot.className = "circlealive";
			
			if (curObj.slide_cur_img>0) {
				curObj.animateOut(imgs[curObj.slide_cur_img-1]);
				var cur_dot =  curObj.eleSlideBox.querySelector(".flipdot > div[slideid='"+(curObj.slide_cur_img-1)+"']");
				cur_dot.className = "circle";
			}
			curObj.slide_cur_img++;
			
		}else
		{
			curObj.animateOut(imgs[curObj.slide_cur_img-1]);
			var cur_dot =  curObj.eleSlideBox.querySelector(".flipdot > div[slideid='"+(curObj.slide_cur_img-1)+"']");
			cur_dot.className = "circle";
			curObj.slide_cur_img=0;
			curObj.animateIn(imgs[curObj.slide_cur_img]);
			
			var cur_dot =  curObj.eleSlideBox.querySelector(".flipdot > div[slideid='"+curObj.slide_cur_img+"']");
			cur_dot.className = "circlealive";
		}
	}
	
	//手动翻页
	turn2Slide(index)
	{
		try{
			
			var imgs = this.eleSlideBox.querySelectorAll(".slide");
			console.log("turn to:" + index);
			if (index>=imgs.length) index=imgs.length-1;	//复位
			if (this.slide_cur_img>=imgs.length) this.slide_cur_img=imgs.length-1;	//复位
			this.animateOut(imgs[parseInt(this.slide_cur_img)]);
				
			console.log("fade out:" + this.slide_cur_img);
			this.slide_cur_img = index;
			this.animateIn(imgs[index]);
			console.log("fade in:" + this.slide_cur_img);
			
			
			
			var dots =  this.eleSlideBox.querySelectorAll(".flipdot div[slideid]");
			for(var i=0;i<dots.length;i++)
			{
				if (i==index)
					dots[i].className = "circlealive";
				else
					dots[i].className = "circle";
			}
			var cur_dot =  this.eleSlideBox.querySelector(".flipdot > div[slideid='"+this.slide_cur_img+"']");
			cur_dot.className = "circlealive";
		}catch(e)
		{
			//console.log(this.eleSlideBox.innerHTML);
			console.log(e);
		}
	}
	
	//渲染html
	show(){
		
		var tipbar = this.eleSlideBox.querySelector(".tipbar");
		tipbar.style.top = this.config.tipbar_top;
		
		//设置切换按钮
		var slide_items = this.eleSlideBox.querySelectorAll(".slide");
		this.slides_length = slide_items.length;
		
		var eleFlipdot =  this.eleSlideBox.querySelector(".flipdot");
		for(var i=0;i<slide_items.length;i++)
		{
			var dot = document.createElement("div");
			dot.className = "circle";
			dot.innerHTML = " ";
			dot.setAttribute("slideid", i);
			dot.cur_slide_obj = this;
			
			dot.style.width = this.config.dotsize;
			dot.style.height = this.config.dotsize;
			
			
			slide_items[i].querySelector(".subtitle").style.top=this.config.subtitle_top;
			slide_items[i].querySelector(".subtitle").onmousemove = function(e){
				e.stopPropagation();
			}
			slide_items[i].querySelector(".subtitle > div").style.fontSize = this.config.subtitle_fontsize;
			
			dot.onmouseover = function(e){
				e.stopPropagation();
				var index = (e.target.getAttribute("slideid"));
				clearInterval(e.target.cur_slide_obj.slideInterval);
				
				console.log("turn to :" + index);
				e.target.cur_slide_obj.turn2Slide(index);
				
				var slide_items = e.target.cur_slide_obj.eleSlideBox.querySelectorAll(".slide");
				 
				e.target.setAttribute("title",slide_items[index].querySelector(".subtitle a").innerText); 
			}
			
			dot.onmouseout =  function(e){
				e.stopPropagation();
				e.target.cur_slide_obj.slideInterval = setInterval(e.target.cur_slide_obj.autoTurnSlides, e.target.cur_slide_obj.interval, e.target.cur_slide_obj);
			}
			
			dot.onclick = function(e){
				e.stopPropagation();
				var index = (e.target.getAttribute("slideid"));
				var slide_items = e.target.cur_slide_obj.eleSlideBox.querySelectorAll(".slide");
				window.location = (slide_items[index].querySelector(".subtitle a").getAttribute("href"));
				
			}
			eleFlipdot.appendChild(dot);
			
		
		}
		
		//图片鼠标事件

		this.eleSlideBox.onmousemove = function(e){
			e.stopPropagation();
			//console.log(e.target.parentElement.parentElement.parentElement.innerHTML);
			var eRect = e.target.getBoundingClientRect();
			//console.log('Left: ' + eRect.left + ', Top: ' + eRect.top);
			//console.log('Mouse X: ' + e.clientX + ', Mouse Y: ' + e.clientY);
			//console.log(e.clientX,eRect.width/2+eRect.left);
			
			e.target.parentElement.parentElement.parentElement.querySelector(".turnbar").style.opacity = 1;
			
			
		}
		
		this.eleSlideBox.onmouseout = function(e){
			e.stopPropagation();
			//e.target.querySelector(".turnbar").style.opacity=1;
			//console.log('Mouse X: ' + e.clientX + ', Mouse Y: ' + e.clientY);
			try{
				e.target.parentElement.parentElement.parentElement.querySelector(".turnbar").style.opacity = 0;
			}catch(err)
			{
				e.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".turnbar").style.opacity = 0;
				console.log(err);
			}
		}
		
		//手指滑动事件
		this.eleSlideBox.addEventListener("touchmove",function(evt){
			evt.target.setAttribute("te_x",parseInt(evt.touches[0].clientX));
			//console.log(evt.touches);
		},false);
		
		this.eleSlideBox.addEventListener("touchstart",function(evt){
			evt.target.setAttribute("ts_x",parseInt(evt.touches[0].clientX));
			console.log("TOUCH START",evt.touches);
		},false);
		
		this.eleSlideBox.addEventListener("touchend",function(evt){
			
			try{
				var ts_x = parseInt(evt.target.getAttribute("ts_x"));
				var te_x = parseInt(evt.target.getAttribute("te_x"));
				console.log("TOUCH END",te_x,ts_x);
				
				//有横向滑动距离后翻页
				if ((te_x-ts_x)>20){
					var leftobj = evt.target.parentElement.parentElement.parentElement.parentElement.querySelector(".turnbar .leftbtn img");
					leftobj.click();
				}
				else if((te_x-ts_x)<-20)
				{
					var rightobj = evt.target.parentElement.parentElement.parentElement.parentElement.querySelector(".turnbar .rightbtn img");
					rightobj.click();
				}
			}
			catch(ex)
			{
				console.log(ex);
			}
			
		},false);
		
		
		//设置轮播间隔
		this.turn2Slide(0)
		this.slideInterval = setInterval(this.autoTurnSlides, this.interval,this);
		
		
		//左侧翻页按钮
		var leftobj = this.eleSlideBox.querySelector(".turnbar .leftbtn img");
		leftobj.style.height = this.config.arrow_size;
		leftobj.onclick = function(e){
			var dot = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.circlealive');
			
			clearInterval(dot.cur_slide_obj.slideInterval);
			
			var cur_index = parseInt(dot.cur_slide_obj.slide_cur_img);
			dot.cur_slide_obj.turn2Slide((cur_index==0)?0:(cur_index-1));
			
			dot.cur_slide_obj.slideInterval = setInterval(dot.cur_slide_obj.autoTurnSlides, dot.cur_slide_obj.interval, dot.cur_slide_obj);
		}


		//右侧翻页按钮
		var rightobj = this.eleSlideBox.querySelector(".turnbar .rightbtn img");
		rightobj.style.height = this.config.arrow_size;
		rightobj.onclick = function(e){
			var dot = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.circlealive');
			
			clearInterval(dot.cur_slide_obj.slideInterval);
			
			var cur_index = parseInt(dot.cur_slide_obj.slide_cur_img);
			var cur_length = parseInt(dot.cur_slide_obj.slides_length);
			dot.cur_slide_obj.turn2Slide((cur_index<cur_length)?(cur_index+1):(cur_length-1));
			
			dot.cur_slide_obj.slideInterval = setInterval(dot.cur_slide_obj.autoTurnSlides, dot.cur_slide_obj.interval, dot.cur_slide_obj);
		}

		
	}
	
	
	//动画
	animateIn(e)
	{
		e.style.display="";
		switch (this.config.animation)
		{
			case "fade":
				e.className = "slidebg slide animate__animated animate__fadeIn";
				
				break;
			case "bounce":
				e.className = "slidebg slide animate__animated animate__bounceIn";
				break;
			case "zoom":
				e.className = "slidebg slide animate__animated animate__zoomIn";
				
				break;
			case "slide":
				e.className = "slidebg slide animate__animated animate__slideInDown";
				break;
			case "flip":
				e.className = "slidebg slide animate__animated animate__flipInX";
				break;
			default:
				e.className = "slidebg slide animate__animated animate__fadeIn";
				break;
		}
		e.style.opacity = 100;
		e.style.zIndex = 99;
	}
	
	animateOut(e)
	{
		e.className = "slidebg slide animate__animated animate__fadeOut";
		e.style.opacity = 100;
		e.style.zIndex=-1;
	}
	
}