import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Rare Collectible NFT Tests
// Supply: 7,500 | Mint Price: 0.035 STX (35000 microSTX)

Clarinet.test({
  name: "rare-collectible: can mint a single NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('rare-collectible', 'mint', [], wallet1.address),
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
    
    // Verify ownership
    let ownerCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-owner',
      [types.uint(1)],
      wallet1.address
    );
    ownerCall.result.expectOk().expectSome().expectPrincipal(wallet1.address);
  },
});

Clarinet.test({
  name: "rare-collectible: get-last-token-id returns correct value",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let initialCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    initialCall.result.expectOk().expectUint(0);
    
    chain.mineBlock([
      Tx.contractCall('rare-collectible', 'mint', [], wallet1.address),
    ]);
    
    let afterMintCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    afterMintCall.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "rare-collectible: get-mint-price returns 35000 microSTX",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let priceCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-mint-price',
      [],
      wallet1.address
    );
    priceCall.result.expectOk().expectUint(35000);
  },
});

Clarinet.test({
  name: "rare-collectible: get-max-supply returns 7500",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let supplyCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-max-supply',
      [],
      wallet1.address
    );
    supplyCall.result.expectOk().expectUint(7500);
  },
});

Clarinet.test({
  name: "rare-collectible: get-available-supply decreases after mint",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let initialCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-available-supply',
      [],
      wallet1.address
    );
    initialCall.result.expectOk().expectUint(7500);
    
    chain.mineBlock([
      Tx.contractCall('rare-collectible', 'mint', [], wallet1.address),
    ]);
    
    let afterCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-available-supply',
      [],
      wallet1.address
    );
    afterCall.result.expectOk().expectUint(7499);
  },
});

Clarinet.test({
  name: "rare-collectible: can transfer NFT to another user",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    chain.mineBlock([
      Tx.contractCall('rare-collectible', 'mint', [], wallet1.address),
    ]);
    
    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        'rare-collectible',
        'transfer',
        [types.uint(1), types.principal(wallet1.address), types.principal(wallet2.address)],
        wallet1.address
      ),
    ]);
    
    transferBlock.receipts[0].result.expectOk();
    
    let ownerCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-owner',
      [types.uint(1)],
      wallet1.address
    );
    ownerCall.result.expectOk().expectSome().expectPrincipal(wallet2.address);
  },
});

Clarinet.test({
  name: "rare-collectible: cannot transfer NFT if not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    chain.mineBlock([
      Tx.contractCall('rare-collectible', 'mint', [], wallet1.address),
    ]);
    
    let transferBlock = chain.mineBlock([
      Tx.contractCall(
        'rare-collectible',
        'transfer',
        [types.uint(1), types.principal(wallet1.address), types.principal(wallet2.address)],
        wallet2.address
      ),
    ]);
    
    // ERR-NOT-AUTHORIZED (u100)
    transferBlock.receipts[0].result.expectErr().expectUint(100);
  },
});

Clarinet.test({
  name: "rare-collectible: batch mint works correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('rare-collectible', 'mint-many', [types.uint(5)], wallet1.address),
    ]);
    
    block.receipts[0].result.expectOk();
    
    let lastIdCall = chain.callReadOnlyFn(
      'rare-collectible',
      'get-last-token-id',
      [],
      wallet1.address
    );
    lastIdCall.result.expectOk().expectUint(5);
  },
});
