//ditSlideShow图片幻灯片
/*配置config
	config = {'subtitle_fontsize' : '24pt','subtitle_top':'60%','dotwidth':'14px','interval':4000};
*/
class ditSlideShow
{
	
	//构造函数
	constructor(config = {'subtitle_fontsize' : '24pt','subtitle_top':'60%','dotsize':'14px','interval':4000}){
	
		this.interval = (config.interval!=null)?config.interval:4000;
		this.slide_cur_img = 0;
		this.config = config;
	
	}
	
	//绑定页面对象
	bind(objElementClassName){
		this.eleSlideBox = document.querySelector(objElementClassName);
		this.slide_cur_img = 0;
		this.eleSlideBox.side_cur_img = 0;
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
		var imgs = this.eleSlideBox.querySelectorAll(".slide");
		console.log("turn to:" + index);
		this.animateOut(imgs[parseInt(this.slide_cur_img)]);
			
		console.log("fade out:" + this.slide_cur_img);
		this.slide_cur_img = index;
		this.animateIn(imgs[index]);
		console.log("fade in:" + this.slide_cur_img);
		
		var dots =  this.eleSlideBox.querySelectorAll(".flipdot > div[slideid]");
		for(var i=0;i<dots.length;i++)
		{
			if (i==index)
				dots[i].className = "circlealive";
			else
				dots[i].className = "circle";
		}
		var cur_dot =  this.eleSlideBox.querySelector(".flipdot > div[slideid='"+this.slide_cur_img+"']");
		cur_dot.className = "circlealive";
	}
	
	//渲染html
	show(){
		//设置切换按钮
		var slide_items = this.eleSlideBox.querySelectorAll(".slide");
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
			slide_items[i].querySelector(".subtitle > div").style.fontSize = this.config.subtitle_fontsize;
			
			dot.onmouseover = function(e){
				var index = (e.target.getAttribute("slideid"));
				clearInterval(e.target.cur_slide_obj.slideInterval);
				
				console.log("turn to :" + index);
				e.target.cur_slide_obj.turn2Slide(index);
				
				var slide_items = e.target.cur_slide_obj.eleSlideBox.querySelectorAll(".slide");
				 
				e.target.setAttribute("title",slide_items[index].querySelector(".subtitle a").innerText); 
			}
			
			dot.onmouseout =  function(e){
				e.target.cur_slide_obj.slideInterval = setInterval(e.target.cur_slide_obj.autoTurnSlides, e.target.cur_slide_obj.interval, e.target.cur_slide_obj);
			}
			
			dot.onclick = function(e){
				var index = (e.target.getAttribute("slideid"));
				var slide_items = e.target.cur_slide_obj.eleSlideBox.querySelectorAll(".slide");
				window.location = (slide_items[index].querySelector(".subtitle a").getAttribute("href"));
				
			}
			eleFlipdot.appendChild(dot);
		}
		
		
		//设置轮播间隔
		this.turn2Slide(0)
		this.slideInterval = setInterval(this.autoTurnSlides, this.interval,this);
	}
	
	
	animateIn(e)
	{
		e.style.display="";

		e.className = "slidebg slide animate__animated animate__fadeIn";
	}
	
	animateOut(e)
	{
		e.className = "slidebg slide";
		//e.style.display = "none";	
	}
	
}