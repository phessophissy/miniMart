import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Common Collectible NFT Tests
// Supply: 10,000 | Mint Price: 0.01 STX (10000 microSTX)

Clarinet.test({
  name: "common-collectible: can mint a single NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('common-collectible', 'mint', [], wallet1.address),
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
    
    // Verify ownership
    let ownerCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-owner',
      [types.uint(1)],
      wallet1.address
    );
    ownerCall.result.expectOk().expectSome().expectPrincipal(wallet1.address);
  },
});

Clarinet.test({
  name: "common-collectible: get-last-token-id returns correct value",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    // Initially should be 0
    let initialCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    initialCall.result.expectOk().expectUint(0);
    
    // Mint one NFT
    chain.mineBlock([
      Tx.contractCall('common-collectible', 'mint', [], wallet1.address),
    ]);
    
    // Should now be 1
    let afterMintCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    afterMintCall.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "common-collectible: get-mint-price returns 10000 microSTX",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let priceCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-mint-price',
      [],
      wallet1.address
    );
    priceCall.result.expectOk().expectUint(10000);
  },
});

Clarinet.test({
  name: "common-collectible: get-max-supply returns 10000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let supplyCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-max-supply',
      [],
      wallet1.address
    );
    supplyCall.result.expectOk().expectUint(10000);
  },
});

Clarinet.test({
  name: "common-collectible: get-available-supply decreases after mint",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    // Initial available supply
    let initialCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-available-supply',
      [],
      wallet1.address
    );
    initialCall.result.expectOk().expectUint(10000);
    
    // Mint one
    chain.mineBlock([
      Tx.contractCall('common-collectible', 'mint', [], wallet1.address),
    ]);
    
    // Available should be 9999
    let afterCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-available-supply',
      [],
      wallet1.address
    );
    afterCall.result.expectOk().expectUint(9999);
  },
});

Clarinet.test({
  name: "common-collectible: can transfer NFT to another user",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // Mint NFT
    chain.mineBlock([
      Tx.contractCall('common-collectible', 'mint', [], wallet1.address),
    ]);
    
    // Transfer to wallet2
    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        'common-collectible',
        'transfer',
        [types.uint(1), types.principal(wallet1.address), types.principal(wallet2.address)],
        wallet1.address
      ),
    ]);
    
    transferBlock.receipts[0].result.expectOk();
    
    // Verify new owner
    let ownerCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-owner',
      [types.uint(1)],
      wallet1.address
    );
    ownerCall.result.expectOk().expectSome().expectPrincipal(wallet2.address);
  },
});

Clarinet.test({
  name: "common-collectible: cannot transfer NFT if not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // Mint NFT to wallet1
    chain.mineBlock([
      Tx.contractCall('common-collectible', 'mint', [], wallet1.address),
    ]);
    
    // wallet2 tries to transfer wallet1's NFT
    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        'common-collectible',
        'transfer',
        [types.uint(1), types.principal(wallet1.address), types.principal(wallet2.address)],
        wallet2.address
      ),
    ]);
    
    // Should fail with ERR-NOT-TOKEN-OWNER (u103)
    transferBlock.receipts[0].result.expectErr().expectUint(103);
  },
});

Clarinet.test({
  name: "common-collectible: multiple users can mint",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    const wallet3 = accounts.get('wallet_3')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('common-collectible', 'mint', [], wallet1.address),
      Tx.contractCall('common-collectible', 'mint', [], wallet2.address),
      Tx.contractCall('common-collectible', 'mint', [], wallet3.address),
    ]);
    
    assertEquals(block.receipts.length, 3);
    block.receipts[0].result.expectOk().expectUint(1);
    block.receipts[1].result.expectOk().expectUint(2);
    block.receipts[2].result.expectOk().expectUint(3);
    
    // Verify last token id
    let lastIdCall = chain.callReadOnlyFn(
      'common-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    lastIdCall.result.expectOk().expectUint(3);
  },
});
