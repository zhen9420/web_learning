/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */
 //1.1获取用户数据
 const creator = 'zhen'
 axios({
	 url:'http://hmajax.itheima.net/api/settings',
	 params: {
		 creator
	 }
 }).then(result => {
	 
	 const userObj = result.data.data
	 //console.log(userObj);
	 //1.2回显数据
	 Object.keys(userObj).forEach(key =>{
		 if(key === 'avatar' ){
			 //默认头像
			 document.querySelector('.prew').src = userObj[key]
		 }else if(key ==='gender'){
			 //默认性别
			 const gRadioList = document.querySelectorAll('.gender')
			 const gNum = userObj[key]
			 //通过性别数字，作为下标，找到对应性别单选框设置选中状态
			 gRadioList[gNum].checked = true
		 }else {
			 document.querySelector(`.${key}`).value = userObj[key]
		 }
	 })
 })
 document.querySelector(".upload").addEventListener('change', e =>{
	 const fd = new FormData()
	 console.log(e.target.files[0]);
	 fd.append('avatar',e.target.files[0])
	 fd.append('creator',creator)
	 axios({
		 url:'http://hmajax.itheima.net/api/avatar',
		 method:'put',
		 data:fd
	 }).then(result =>{
		const imgUrl = result.data.data.avatar
		document.querySelector(".prew").src = imgUrl
	 })
 })
 document.querySelector('.submit').addEventListener('click',()=>{
	 const userForm = document.querySelector('.user-form')
	 const userObj = serialize(userForm,{harsh:true,empty:true})
	 userObj.gender = +userObj.gender
	 userObj.creator = creator
	 console.log(userObj);
	 axios({
		 url:'http://hmajax.itheima.net/api/settings',
		 method:'put',
		 data:userObj
	  }).then(result =>{
		 const toastDom = document.querySelector('.my-toast')
		 const toast = new bootstrap.Toast(toastDom)
		 toast.show()
	 })
 })