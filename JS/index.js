;(function($){
	$(function(){
		var addTask=$(".inputTop");	////提交的表单
		var newTask={};			//新表
		var index1=null;		//当前点击索引
		var listTask=[];		//全部表数组;
		var listNote;			//全部备注数组
		
		init();
		
		/*点击增加,按钮*/
		addTask.submit(function(e){
			e.preventDefault();	//取消默认
			//获取输入文字
			newTask=$(this).find('.addContent').val();
			$(".addContent").prop('value','');
			if(!newTask){return} //未输入不进行
			//push数组添加存储
			addTaskfn(newTask);
		});
		
		/*先把储存中的所有表放入list总表中*/
		function init(){
			listTask=store.get('listTask')||[];//主题存储
			listNote=store.get('listNote')||{
								content:[],
								desc:[]
								};
			//刷新时渲染存储中的
			if(listTask.length){readerTask();}
		};
		
		/*新表增加，list总表更新*/
		function addTaskfn(newTask){
			//提交数据加到总表中
			listTask.push(newTask);
			change();
		};
		
		/*更新存储中的数据*/
		function change(){
			//更新存储数据
			store.set('listTask',listTask);
			//储存数据后执行重新渲染页面函数
			readerTask();
		}
		
		/*重新渲染页面*/
		function readerTask(){
			var $ulTask=$("ul");
			//每次从新渲染整个li总表，渲染前删除所有文档
			$ulTask.html('');
			//遍历渲染总表数组中每一个值
			for(var i = 0;i<listTask.length;i++){
				//赋值给要显示li模板的data文字内容
				var $task=readerTpl(listTask[i],i);
				//追加到ul
				$ulTask.append($task);
			};
		};
		/*新增li模板*/
		function readerTpl(data,index){
			//如果数组中没有这值就不在赋值模板进行渲染
			if(!index||!data) return;
			var liTask='<li data-index='+index+'><input type="checkbox"/><span class="span1">'+
			data+
			'</span><span class="span2"><a class="details">详情</a><a class="delete">删除</a></span></li>'
			return liTask;
		};
		
		/*删除条*/		
		/*删除元素点击监听事件*/
		$('ul').on('click','.delete',function(){
			var index=$(this).parent().parent().data('index');
			var r=confirm('您确定删除此条信息吗')
			r?deleteTask(index):null;
		});
		
		/*删除task项的函数*/
		function deleteTask(index){
			if(index==undefined||!listTask[index]) return;
			delete listTask[index];	//总表中删除这一项
			change();	//重新存储并渲染
		}
		
		/*li双击/详情按钮点击监听事件*/
		//$(document).on('dblclick','li',maskShow);//双击
		$(document).on('click','.details',maskShow);//单机详情
		$(".mask").on('click',maskHid);	//单机消失
		//弹出层出现函数		
		function maskShow(){
			//获取当前点击的索引*存在data-中
			index1=$(this).parent().parent().data('index');
			inputTop(index1);
			$(".mask").css('display','block').animate({opacity:'1'},300);
			$(".inputOut").css('transform','rotateX(0deg)');
			//判断改变备注时间
			var nodeDesc=listNote.desc[index1];
			nodeDesc==undefined? null: $("[type=date]").val(nodeDesc);
		};
		//弹出层消失函数
		function maskHid(){
			$(".inputOut").css('transform','rotateX(90deg)');
			$(".mask").animate({opacity:'0'},500,function(){
				$(this).css('display','none');
			});
		};

		/*创建弹出层模板同步点击显示数据*/
		function inputTop(index){
			var item=listTask[index];
			//判断改变备注信息
			var noteText;
			if(!listNote.content[index]||listNote.content[index]==undefined){
				noteText=""
			}else{
				noteText=listNote.content[index];
			}
			
			var tpl='<form name="note"><div class="inputOut">'+
				'<span>标题:<input type="text" value="'+item+'"/></span>'+
				'<textarea class="note1" placeholder="填写备注">'+noteText+'</textarea>'+
				'<input type="date"/>'+
			'<input type="submit"value="保 存"/></div>'+
			'</form>';
			//创建层前清空模板&创建新模板
			$(".inputOut-box").html();
			$(".inputOut-box").html(tpl);
			
			//详情层保存提交事件
			$("[name=note]").submit(function(e){
				e.preventDefault();//阻止提交跳转的默认事件
				noteCun(index1);
				maskHid();
				//标题可能改变重新渲染
				change();
			});
			$(".inputOut [type=text]").on('click',function(){
				$(this).css({border:'1px solid #b5afaf'});
			});
			$(".inputOut [type=text]").on('blur',function(){
				$(this).css({border:'1px solid white'});
				//每次失去焦点后改变标题数组当前索引下的内容，点击保存后更新存储重新渲染
				listTask[index]=$(this).val();
			});
		};
		/*把写在详情页的数据保存到新建对象的数组属性里*/
		function noteCun(index){
			//改变当前索引下的备注信息
			listNote.content[index]=$('.note1').val();
			listNote.desc[index]=$("[type=date]").val();
			//每次更新详情信息后存入本地存储
			store.set('listNote',listNote);
		}
		
		/*全部内存初始化*/
		$("#clearAll").click(function(){
			store.clear();
			$(".clearAll-p").css('right','40px');
			setTimeout(function(){
				$(".clearAll-p").css('right','-200px');
			},2500)
		});
	
		
		
		
/*============================================================*/		

		
		
		
	});
})(jQuery);

