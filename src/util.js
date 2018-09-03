"use strict"

const apiConfig = require('./api_config.js');
const crypto 	  = require('crypto');
const axios 		= require('./axios_config.js');

const Util = {
    buildSign( data, key ){
      let keys = Object.keys(data).sort();

      let sb = '';

      for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (k !== 'api_sign') {
          let v = data[k];
          sb = sb + k + '=' + v + '&';
        }
      }

      sb = sb + key;

      // 权限验证
      let shasum = crypto.createHash('sha256');
      shasum.update(sb);
      return shasum.digest('hex');
    },

    getSignData( DataObj ){
        // 删除原有api_sign
        if(DataObj.hasOwnProperty('api_sign')){
            delete DataObj['api_sign'];
        }
        if( !DataObj.hasOwnProperty('csp_id') ){
            DataObj.csp_id = apiConfig.csp_id;
        }

        if( !DataObj.hasOwnProperty('utm_source') ){
            DataObj.utm_source = apiConfig.utm_source;
        }

        if( !DataObj.hasOwnProperty('utm_medium') ){
            DataObj.utm_medium = apiConfig.utm_medium;
        }
        if( !DataObj.hasOwnProperty('system_version') ){
            DataObj.system_version = apiConfig.system_version;
        }

        if( !DataObj.hasOwnProperty('api_ver') ){
            DataObj.api_ver = apiConfig.api_ver;
        }

        if( !DataObj.hasOwnProperty('app_version') ){
            DataObj.app_version = apiConfig.app_version;
        }

        if( !DataObj.hasOwnProperty('device_id') ){
            DataObj.device_id = apiConfig.device_id;
        }

        if( !DataObj.hasOwnProperty('client_ip') ){
            DataObj.client_ip = this.getIPAdress();
        }

        if( !DataObj.hasOwnProperty('client_time') ){
            DataObj.client_time = Math.round(Date.now() / 1000);
        }

        DataObj.api_sign = this.buildSign( DataObj, apiConfig.csp_apikey );

        return DataObj;
    },

    getIPAdress(){
      var interfaces = require('os').networkInterfaces();
      for(var devName in interfaces){
            var iface = interfaces[devName];
            for(var i=0;i<iface.length;i++){
                 var alias = iface[i];
                 if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                       return alias.address;
                 }
            }
      }
    },


    orderFinish( postData ){
      let signData = this.getSignData(postData);
      let that = this;
      axios({
            method:'POST',
            url:'/wallet/order/finish',
            data: signData
      }).then(function(response) {
          console.log(response.data)
      }).catch(function(error){
          console.log(error)
      })
    },

    // orderExcept( data ){
    //   let params = this.getSignData(data);
    //   axios.get(apiConfig.ws_domain+'store_action', {
    //       params
    //   }).then(function(wsrep) {
    //       console.log(wsrep)
    //   }).catch(function(error){
    //       console.log(error)
    //   })
    // }



}



module.exports = Util;
