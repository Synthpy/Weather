  const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data:{nowTemp:'',
       nowWeather:'',
       nowWeatherBackground:'',
       hourlyWeather: [],
       ff:'',
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })

  },
  onLoad(){
    this.getNow()
  },
  ff(){
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.name
        console.log(res)
        this.setData=({ff:latitude})
        //var longitude = res.longitude
        //var speed = res.speed
        //var accuracy = res.accuracy
      }
    })
  },
  

 getNow(callback){  
    wx.request({
      url:
        'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '广州市'
      },
      success: res => {
        //console.log(res)
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        console.log(weather,temp)
        this.setData({
          nowTemp:temp,
          nowWeather:weatherMap[weather],
          nowWeatherBackground:'/images/'+weather+'-bg.png'
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })

        //set forecast
        let forecast = result.forecast
        console.log(forecast)
        let nowHour = new Date().getHours()
        let hourlyWeather = []
        for (let i = 0; i<8; i+=1){
          hourlyWeather.push({
            time:(i*3 + nowHour) %24+'时',
            iconPath:'/images/'+forecast[i].weather+'-icon.png',
            temp:forecast[i].temp+'°'
          })
        }
        hourlyWeather[0].time='现在'
        this.setData({
          hourlyWeather: hourlyWeather
        })
      },
      complete: ()=>{
        callback && callback()
      }
    })
  }
})