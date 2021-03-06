var Bmob = require('../../utils/bmob.js');
var that;
Page({
	onLoad: function (options) {
		that = this;
    var sellerId = getApp().auth();
    that.setData({
      sellerId: sellerId
    })
    // 管理员认证
    if (options.objectId) {
			// 缓存数据
			that.setData({
				isEdit: true,
				objectId: options.objectId,
      });
			// 请求待编辑的分类对象
			var query = new Bmob.Query('Category');
			query.get(that.data.objectId).then(function (category) {
				that.setData({
					category: category
				});
			});
    }
	},
  
	add: function (e) {
		var form = e.detail.value;
		if (form.title == '') {
			wx.showModal({
				title: '请填写分类名称',
				showCancel: false
			});
			return;
		}
		// 添加或者修改分类
		var category = new Bmob.Object('Category');
		// 修改模式
		if (that.data.isEdit) {
			category = that.data.category;
		}
    form.sellerId = that.data.sellerId;
		form.priority = parseInt(form.priority);
		category.save(form).then(function (updatedCategory) {
      wx.showModal({
				title: that.data.isEdit ? '修改成功' : '添加成功',
				showCancel: false,
				success: function () {
					wx.navigateBack();
				}
			});
		});
	},
	delete: function () {
		// 确认删除对话框
		wx.showModal({
			title: '确认删除',
			success: function (res) {
				if (res.confirm) {
					var category = that.data.category;
					category.destroy().then(function (result) {
						wx.showModal({
							title: '删除成功',
							showCancel: false,
							success: function () {
								wx.navigateBack();
							}
						});
					});
				}
			}
		});
	}
})