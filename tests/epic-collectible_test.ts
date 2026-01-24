import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Epic Collectible NFT Tests
// Supply: 5,000 | Mint Price: 0.05 STX (50000 microSTX)

Clarinet.test({
  name: "epic-collectible: can mint a single NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('epic-collectible', 'mint', [], wallet1.address),
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
    
    let ownerCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-owner',
      [types.uint(1)],
      wallet1.address
    );
    ownerCall.result.expectOk().expectSome().expectPrincipal(wallet1.address);
  },
});

Clarinet.test({
  name: "epic-collectible: get-last-token-id returns correct value",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let initialCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    initialCall.result.expectOk().expectUint(0);
    
    chain.mineBlock([
      Tx.contractCall('epic-collectible', 'mint', [], wallet1.address),
    ]);
    
    let afterMintCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    afterMintCall.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "epic-collectible: get-mint-price returns 50000 microSTX",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let priceCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-mint-price',
      [],
      wallet1.address
    );
    priceCall.result.expectOk().expectUint(50000);
  },
});

Clarinet.test({
  name: "epic-collectible: get-max-supply returns 5000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let supplyCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-max-supply',
      [],
      wallet1.address
    );
    supplyCall.result.expectOk().expectUint(5000);
  },
});

Clarinet.test({
  name: "epic-collectible: get-available-supply decreases after mint",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let initialCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-available-supply',
      [],
      wallet1.address
    );
    initialCall.result.expectOk().expectUint(5000);
    
    chain.mineBlock([
      Tx.contractCall('epic-collectible', 'mint', [], wallet1.address),
    ]);
    
    let afterCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-available-supply',
      [],
      wallet1.address
    );
    afterCall.result.expectOk().expectUint(4999);
  },
});

Clarinet.test({
  name: "epic-collectible: can transfer NFT to another user",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    chain.mineBlock([
      Tx.contractCall('epic-collectible', 'mint', [], wallet1.address),
    ]);
    
    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        'epic-collectible',
        'transfer',
        [types.uint(1), types.principal(wallet1.address), types.principal(wallet2.address)],
        wallet1.address
      ),
    ]);
    
    transferBlock.receipts[0].result.expectOk();
    
    let ownerCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-owner',
      [types.uint(1)],
      wallet1.address
    );
    ownerCall.result.expectOk().expectSome().expectPrincipal(wallet2.address);
  },
});

Clarinet.test({
  name: "epic-collectible: cannot transfer NFT if not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    chain.mineBlock([
      Tx.contractCall('epic-collectible', 'mint', [], wallet1.address),
    ]);
    
    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        'epic-collectible',
        'transfer',
        [types.uint(1), types.principal(wallet1.address), types.principal(wallet2.address)],
        wallet2.address
      ),
    ]);
    
    transferBlock.receipts[0].result.expectErr().expectUint(100);
  },
});

Clarinet.test({
  name: "epic-collectible: batch mint works correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('epic-collectible', 'mint-many', [types.uint(5)], wallet1.address),
    ]);
    
    block.receipts[0].result.expectOk();
    
    let lastIdCall = chain.callReadOnlyFn(
      'epic-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    lastIdCall.result.expectOk().expectUint(5);
  },
});
