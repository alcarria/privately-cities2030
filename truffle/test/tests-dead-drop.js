const DeadDrop = artifacts.require('DeadDrop');

contract('DeadDrop', (accounts)=>{
  before(function (){
    account1 = accounts[0];
    account2 = accounts[1];
    seed = 'OLACARACOLA';
  })

  it('Se envia la semilla de la cuenta 1 a la 2', async () =>{
    const contract = await DeadDrop.deployed();

    const tx = await contract.shareSeed(account2, seed, {from: account1});
    const {logs} = tx;
    assert.ok(Array.isArray(logs))
    assert.equal(logs.length, 1);

    const log = logs[0];
    assert.equal(log.event, 'ShareSeed');
    assert.equal(log.args.to, account2);
    assert.equal(log.args.seed, seed);
  })

  it('El evento se envia a la direccion especificada por la semilla', async() =>{
    const contract = await DeadDrop.deployed();

    message = 'Esto es un mensaje secreto'

    const tx = await contract.sendMessage(seed, message, {from: account1});
    const {logs} = tx;
    assert.ok(Array.isArray(logs))
    assert.equal(logs.length, 1);

    const log = logs[0];
    assert.equal(log.event, 'SendMessage');
    assert.equal(log.args.to, seed);
    assert.equal(log.args.message, message);
  })
  }
)
