var titletext="CISSL | HOME . . ."
				var repeat=true; // SET TO true TO REPEAT, false TO "TYPE" OUT TITLE ONLY ONCE.
				set=setTimeout;
				var index=0;
				function scrolltitle(){
				if(index<=titletext.length){
				document.title=titletext.substring(0,index);
				index++;
				set('scrolltitle()', 200);
				}else{
				index=0;
				if(repeat)set('scrolltitle()',1000);
				}}
				window.onload=function(){
				if(!document.layers)set('scrolltitle()',1000);
				}