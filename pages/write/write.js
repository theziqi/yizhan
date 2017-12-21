
//获取应用实例
var app = getApp()
var Bmob=require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
Page({
  onLoad: function(options) {
      that=this;
      that.setData({//初始化数据
        src:"",
        isSrc:false,
        ishide:"0",
        autoFocus:true,
        isLoading:false,
        loading:true,
        isdisabled:false,
        itemType:["其他","电路基础硬件","接焊工具","电脑硬件","技术图书","体育器材"],
        pickerlistenddate:'',
        pickerliststartdate: '',
      })
  },
  onReady:function(){
     wx.hideToast() 
  },
  onShow:function(){
    var myInterval=setInterval(getReturn,500);
    function getReturn(){
      wx.getStorage({
        key: 'user_openid',
        success: function(ress) {
          if(ress.data){
            clearInterval(myInterval)
              that.setData({
                loading:true
            })
          }
        } 
      })
    }
  },
  uploadPic:function(){//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc:true,
          src:tempFilePaths
        })
      }
    })
  },
  clearPic:function(){//删除图片
    that.setData({
      isSrc:false,
      src:""
    })
  },
  changePublic:function(e){//switch开关
    console.log(e.detail.value)
    if(e.detail.value==true){
      wx.showModal({
        title: '发布',
        content: '',
        showCancel:true,
        confirmColor:"#4fce7d",
        cancelColor:"#646464",
        success: function(res) {
          if (res.confirm) {
              that.setData({
                ishide:"1"
              })
          }
          else{
              that.setData({
                isPublic:true
              })    
          }
        }
      })
      
    }
    else{
      wx.showModal({
        title: '退回',
        content: '确定要将该项目退回吗？',
        showCancel:true,
        confirmColor:"#a07c52",
        cancelColor:"#646464",
        success: function(res) {
          if (res.confirm) {
              that.setData({
                ishide:"0"
              })
          }
          else{
              that.setData({
                isPublic:false
              })    
          }
        }
      })
      
    }
  },
  sendNewMood: function(e) {//保存
    //判断是否为空

    var content = e.detail.value.content;
    var title = e.detail.value.title;
    var typess= e.detail.value.typess;
    var listStartDate = e.detail.value.listStartDate;
    var listEndDate = e.detail.value.listEndDate;
    console.log(content)

    if(content==""){
      common.dataLoading("内容不能为空","loading");
    }
    else{
        that.setData({
          isLoading:true,
          isdisabled:true
        }) 
        wx.getStorage({
          key: 'user_id',
          success: function(ress) {
              var Diary = Bmob.Object.extend("Diary");
              var diary = new Diary();
              var me = new Bmob.User();
              me.id=ress.data;
              diary.set("title",title);
              diary.set("content",content);
              diary.set("is_hide",that.data.ishide);
              diary.set("publisher", me);
              diary.set("likeNum",0);
              diary.set("commentNum",0);
              diary.set("liker",[]);
              diary.set("typess",typess);
              diary.set("listStartDate", listStartDate);
              diary.set("listEndDate", listEndDate);
              if(that.data.isSrc==true){
                  var name=that.data.src;//上传的图片的别名
                  var file=new Bmob.File(name,that.data.src);
                  file.save();
                  diary.set("pic",file);
              }
              diary.save(null, {
                success: function(result) {
                  that.setData({
                    isLoading:false,
                    isdisabled:false
                  }) 
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  common.dataLoading("发布成功","success",function(){
                      wx.navigateBack({
                          delta: 1
                      })
                  });
                },
                error: function(result, error) {
                  // 添加失败
                  console.log(error)
                  common.dataLoading("发布失败","loading");
                  that.setData({
                    isLoading:false,
                    isdisabled:false
                  }) 

                }
            });


          }
        })
        
      
    }
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },
  bindPickerChange:function(e){
    this.setData({
     index: e.detail.value
    })
  },
  bindDateStartPickerChange:function(e){
    
    this.setData({
      pickerliststartdate: e.detail.value
    })
  },
  bindDateEndPickerChange: function (e) {

    this.setData({
      pickerlistenddate: e.detail.value
    })
  }


})
