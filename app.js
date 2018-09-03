const Web3 						= require('web3');
const contractConfig 	= require('./src/contract_config.js');
const apiConfig 			= require('./src/api_config.js');
const util 						= require('./src/util.js');

const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://192.168.10.232:8546"));


// 获取账号列表
web3.eth.getAccounts((error, accounts)=>{
	for (let index in accounts) {
		web3.eth.getBalance(accounts[index],  (error, balance)=>{
			console.log('account :', accounts[index], ', balance: ', balance);
		});
	}
});

// 创建合约对像
const contract = new web3.eth.Contract(contractConfig.abi, contractConfig.addr);

// 监听OrderProductEvent事件
contract.events.OrderProductEvent({
	  // filter: {}, // Using an array means OR: e.g. 20 or 23
	  fromBlock: 0
}, function(error, event){
		if(!error){
				console.log(error);
		}
}).on('data', function(event){
    console.log(event); // same results as the optional callback above

		let flag 			= event.returnValues.flag;

		// 转帐成功, 提交api
		if(flag === true){
				let postData 	=  {
						order_no				: event.returnValues.oderid,
						to_account 			: event.returnValues.payaddr,
						value							: event.returnValues.value,
						pay_model				: 1, //扫码
						pay_type				: 8, //以太币支付
						contract_address: event.address,
						block_number		: event.blockNumber,
						transaction_hash: event.transactionIndex,
						block_hash			: event.blockHash,
						log_id					: event.id,
						pay_time				: Math.round(Date.now() / 1000)
				}

				util.orderFinish(postData);
		}

}).on('changed', function(event){
    // remove event from local database
}).on('error', console.error);

// 监听全部事件
// contract.events.allEvents({
// 		// filter:{name:"aa"},
// 		fromBlock:0
// }, (error, res)=>{
// 	console.log('allEvents:', res);
// });

// web3.eth.personal.newAccount('123456', (error, result)=>{
// 	console.log(result);
// });
