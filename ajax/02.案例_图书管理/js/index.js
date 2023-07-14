/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
//封装-获取病渲染图书列表函数
const creator = 'zhen'
function getBooksList() {
	axios({
		url:'http://hmajax.itheima.net/api/books',
		//默认get省略
		params:{
			creator
		
	}
}).then(result =>{
	console.log(result);
	const bookList = result.data.data;
	console.log(bookList);
	const htmlStr = bookList.map((item ,index)=> {
		return `<tr>
          <td>${index+1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td data-id=${item.id}>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>`
	}).join('')
	console.log(htmlStr);
	document.querySelector('.list').innerHTML = htmlStr;
	
})
}
// 网页加载运行时，获取并渲染列表一次
getBooksList()
//目标2：新增图书
//2.1 弹框隐藏
const addModalDom = document.querySelector('.add-modal')
const addModal = new bootstrap.Modal(addModalDom)
//绑定点击事件
document.querySelector('.add-btn').addEventListener('click',() =>{
	//2.2 收集表单数据
	const addForm  = document.querySelector('.add-form')
	const bookObj = serialize(addForm,{hash: true,empty: true})
	console.log(bookObj);
	//提交到服务器
	axios({
		url:'http://hmajax.itheima.net/api/books',
		method:'post',
		data:{
			...bookObj,
			creator
		}
	}).then(result => {
		console.log(result);
		//刷新页面
		getBooksList()
		//重置表单
		addForm.reset()
		addModal.hide()
		
	})
	
})
//目标3：删除图书
//3.1 删除元素绑定点击事件 获取图书id(事件委托)
document.querySelector('.list').addEventListener('click',e => {
	if(e.target.classList.contains('del')){
		const theId = e.target.parentNode.dataset.id
		console.log(theId);
		//在路径上传参
		axios({
			url:`http://hmajax.itheima.net/api/books/${theId}`,
			method:'delete'
		}).then(result => {
			getBooksList()
		})
		
	}
})
//目标4：编辑图书
//4.1显示和隐藏弹框
const editDom = document.querySelector('.edit-modal')
const editModal = new bootstrap.Modal(editDom)
document.querySelector('.list').addEventListener('click',e => {
	if(e.target.classList.contains('edit')){
		//4.1数据回显
		const theId = e.target.parentNode.dataset.id;
		axios({
			url:`http://hmajax.itheima.net/api/books/${theId}`
		}).then(result =>{
			const bookObj = result.data.data;
			//数据对象“属性”和标签“类名”一致
			//遍历数据对象，使用属性去获取对应的标签，快速赋值
			const keys = Object.keys(bookObj)//['id', 'bookname', 'author', 'publisher']
			keys.forEach(key =>{
				document.querySelector(`.edit-form .${key}`).value = bookObj[key]
			})
		})

		editModal.show()
		
	}
})
//点击修改隐藏
document.querySelector('.edit-btn').addEventListener('click',() => {
	//4.3 提交保存数据并刷新列表
		const editForm = document.querySelector('.edit-form')
		const { id, bookname, author, publisher } = serialize(editForm,
		{hash: true,empty: true})
		//保存正在编辑的图书id，隐藏起来：无需让用户修改（在前一步遍历中已经获取）
		//<input type="hidden" class="id" name="id" value="217473">
		axios({
			url:`http://hmajax.itheima.net/api/books/${id}`,
			method:'put',
			data:{
				bookname, author, publisher,creator
			}
			}).then(result =>{
				getBooksList()
				editModal.hide()
			
			
		})
	
})